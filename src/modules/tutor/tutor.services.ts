import { TutorProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

type TutorProfileInput = Omit<
  TutorProfile,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "availability"
  | "user"
  | "bookings"
  | "reviews"
> & {
  categories?: string[];
};

const createTutorProfile = async (data: TutorProfileInput, userId: string) => {
  return prisma.tutorProfile.upsert({
    where: { userId },
    update: {
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories: {
        deleteMany: {},
        create:
          data.categories?.map((name) => ({
            category: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })) || [],
      },
    },
    create: {
      userId,
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories: {
        create:
          data.categories?.map((name) => ({
            category: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })) || [],
      },
    },
  });
};

const getAllTutors = async () => {
  return await prisma.tutorProfile.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      reviews: true,
    },
  });
};

const getSingleTutor = async (id: string) => {
  return await prisma.tutorProfile.findFirst({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true,
        },
      },
      categories: {
        include: {
          category: true,
        },
      },
      availability: {
        where: {
          isBooked: false,
        },
        orderBy: {
          dayOfWeek: "asc",
        },
      },
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      },
    },
  });
};

const updateTutorProfile = async (userId: string, data: TutorProfileInput) => {
  return prisma.tutorProfile.upsert({
    where: { userId },
    update: {
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories: {
        deleteMany: {},
        create:
          data.categories?.map((name: string) => ({
            category: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })) || [],
      },
    },
    create: {
      userId,
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories: {
        create:
          data.categories?.map((name: string) => ({
            category: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })) || [],
      },
    },
  });
};

const deleteTutorProfile = async (userId: string) => {
  const tutorData = await prisma.tutorProfile.findFirst({
    where: {
      userId,
    },
  });

  if (!tutorData) {
    throw new Error("Tutor profile not found");
  }

  return prisma.tutorProfile.delete({
    where: {
      userId,
    },
  });
};

export async function getTutorDashboardStats(userId: string) {
  const profile = await prisma.tutorProfile.findFirst({
    where: { userId },
    include: {
      categories: { include: { category: true } },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
    },
  });

  if (!profile) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
      },
    });

    return {
      user,
      profile: null,
      bookings: [],
      reviews: [],
      totalBookings: 0,
      totalReviews: 0,
      averageRating: 0,
      upcomingSessions: 0,
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const globalBookings = await prisma.booking.findMany({ take: 5 });
  console.log("DIAGNOSTIC: Global Bookings in DB:", globalBookings.map(b => ({ id: b.id, tutorId: b.tutorId, studentId: b.studentId })));

  const bookings = await prisma.booking.findMany({
    where: { tutorId: profile.id },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  const allBookings = await prisma.booking.findMany({
    where: { tutorId: profile.id },
  });

  console.log("DEBUG: Tutor Dashboard Profile ID:", profile.id);
  console.log("DEBUG: Tutor Dashboard All Bookings Count:", allBookings.length);
  console.log("DEBUG: Tutor Dashboard All Bookings Sample:", allBookings.slice(0, 2).map(b => ({ id: b.id, status: b.status, date: b.date })));

  const upcomingSessionsList = await prisma.booking.findMany({
    where: {
      tutorId: profile.id,
      status: { in: ["CONFIRMED", "PENDING"] },
      date: {
        gte: today,
      },
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  console.log("DEBUG: Tutor Dashboard Upcoming Sessions Found:", upcomingSessionsList.length);

  const availability = await prisma.availability.findMany({
    where: { tutorId: profile.id },
  });

  const reviews = await prisma.review.findMany({
    where: { tutorId: profile.id },
  });

  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : parseFloat(
          (
            reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
          ).toFixed(1),
        );

  return {
    user: profile.user,
    profile,
    bookings,
    reviews,
    availability,
    totalBookings: bookings.length,
    totalReviews,
    averageRating,
    upcomingSessions: upcomingSessionsList.length,
    upcomingSessionsList,
  };
}

const getSingleTutorByUserId = async (userId: string) => {
  return await prisma.tutorProfile.findFirst({
    where: { userId },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });
};

const getTopRatedTutor = async () => {
  return await prisma.tutorProfile.findMany({
    orderBy: {
      rating: "desc",
    },
    take: 6,
    include: {
      user: true,
    },
  });
};

export const tutorServices = {
  createTutorProfile,
  getAllTutors,
  getSingleTutor,
  updateTutorProfile,
  deleteTutorProfile,
  getTutorDashboardStats,
  getSingleTutorByUserId,
  getTopRatedTutor,
};
