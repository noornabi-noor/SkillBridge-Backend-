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
  return await prisma.tutorProfile.upsert({
    where: { userId },
    update: {
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories:
        data.categories && data.categories.length > 0
          ? {
              deleteMany: {}, // clear old categories
              create: data.categories.map((name: string) => ({
                category: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : {},
    },
    create: {
      userId,
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories:
        data.categories && data.categories.length > 0
          ? {
              create: data.categories.map((name: string) => ({
                category: {
                  connectOrCreate: {
                    where: { name },
                    create: { name },
                  },
                },
              })),
            }
          : {},
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

// const getTutorDashboardStats = async (userId: string) => {
//   const profile = await prisma.tutorProfile.findFirst({
//     where: { userId },
//     include: {
//       categories: { include: { category: true } },
//       user: {
//         select: {
//           id: true,
//           name: true,
//           email: true,
//           phone: true,
//           image: true,
//         },
//       },
//     },
//   });

//   if (!profile) {
//     return {
//       user: null,
//       profile: null,
//       bookings: [],
//       reviews: [],
//       totalBookings: 0,
//       totalReviews: 0,
//       averageRating: 0,
//       upcomingSessions: 0,
//     };
//   }

//   const bookings = await prisma.booking.findMany({
//     where: { tutorId: profile.id },
//   });

//   const reviews = await prisma.review.findMany({
//     where: { tutorId: profile.id },
//   });

//   return {
//     user: profile.user, 
//     profile,
//     bookings,
//     reviews,
//     totalBookings: bookings.length,
//     totalReviews: reviews.length,
//     averageRating:
//       reviews.length === 0
//         ? 0
//         : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length,
//     upcomingSessions: bookings.filter(
//       (b) => new Date(b.date) > new Date(),
//     ).length,
//   };
// };

export async function getTutorDashboardStats(userId: string) {
  // 1️⃣ Get the tutor profile including the user
  const profile = await prisma.tutorProfile.findFirst({
    where: { userId },
    include: {
      categories: { include: { category: true } },
      user: { select: { id: true, name: true, email: true, phone: true, image: true } },
    },
  });

  if (!profile) {
    return {
      user: null,
      profile: null,
      bookings: [],
      reviews: [],
      totalBookings: 0,
      totalReviews: 0,
      averageRating: 0,
      upcomingSessions: 0,
    };
  }

  // 2️⃣ Fetch bookings correctly (linked to userId, not profile.id)
  const bookings = await prisma.booking.findMany({
    where: { tutorId: profile.userId }, // ✅ fix here
  });

  // 3️⃣ Fetch reviews correctly
  const reviews = await prisma.review.findMany({
    where: { tutorId: profile.userId }, // ✅ fix here
  });

  const totalReviews = reviews.length;

  // 4️⃣ Calculate average rating correctly
  const averageRating =
    totalReviews === 0
      ? 0
      : parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1));

  // 5️⃣ Upcoming sessions
  const upcomingSessions = bookings.filter(b => new Date(b.date) > new Date()).length;

  return {
    user: profile.user,
    profile,
    bookings,
    reviews,
    totalBookings: bookings.length,
    totalReviews,
    averageRating, 
    upcomingSessions,
  };
}

const getSingleTutorByUserId = async (userId: string) => {
  return await prisma.tutorProfile.findFirst({
    where: { userId },
    include: { 
      categories: { 
        include: { 
          category: true 
        } 
      } 
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
};
