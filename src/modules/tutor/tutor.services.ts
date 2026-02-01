import { TutorProfile } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

// const createTutorProfile = async (
//   data: Omit<
//     TutorProfile,
//     | "id"
//     | "createdAt"
//     | "updatedAt"
//     | "availability"
//     | "user"
//     | "bookings"
//     | "reviews"
//     | "categories"
//   >,
//   userId: string,
// ) => {
//   return await prisma.tutorProfile.create({
//     // data: {
//     //   ...data,
//     //   userId,
//     // },


//     data: {
//       bio: data.bio,
//       experience: data.experience, // must be Int
//       pricePerHour: data.pricePerHour, // must be Int
//       userId,
//       // Handle categories separately
//       categories: {
//         create: data.categories?.map((name: string) => ({
//           category: { connectOrCreate: { where: { name }, create: { name } } }
//         })),
//       },
//     },

//   });
// };

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
  categories?: string[]; // add this
};

const createTutorProfile = async (data: TutorProfileInput, userId: string) => {
  return await prisma.tutorProfile.upsert({
    where: { userId },
    update: {
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories: data.categories && data.categories.length > 0
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
      categories: data.categories && data.categories.length > 0
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
        create: data.categories?.map((name: string) => ({
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


const deleteTutorProfile = async(userId: string) => {
    const tutorData = await prisma.tutorProfile.findFirst({
        where: {
            userId
        }
    });

    if(!tutorData){
        throw new Error("Tutor profile not found");
    }

    return prisma.tutorProfile.delete({
        where: {
            userId
        }
    });
};

const getTutorDashboardStats = async (userId: string) => {
  // 1️⃣ Fetch tutor profile by userId
  const profile = await prisma.tutorProfile.findFirst({
    where: { userId },
    include: { categories: { include: { category: true } } },
  });

  if (!profile) {
    // user is not a tutor yet
    return {
      profile: null,
      bookings: [],
      reviews: [],
      totalBookings: 0,
      totalReviews: 0,
      averageRating: 0,
      upcomingSessions: 0,
    };
  }

  // 2️⃣ Use the correct tutorId from profile.id for bookings & reviews
  const bookings = await prisma.booking.findMany({ where: { tutorId: profile.id } });
  const reviews = await prisma.review.findMany({ where: { tutorId: profile.id } });

  const totalBookings = bookings.length;
  const totalReviews = reviews.length;
  const averageRating = totalReviews === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  const upcomingSessions = bookings.filter(b => new Date(b.date) > new Date()).length;

  return {
    profile,
    bookings,
    reviews,
    totalBookings,
    totalReviews,
    averageRating,
    upcomingSessions,
  };
};


const getSingleTutorByUserId = async (userId: string) => {
  return await prisma.tutorProfile.findFirst({
    where: { userId },
    include: { categories: { include: { category: true } } }, 
  });
};


export const tutorServices = {
  createTutorProfile,
  getAllTutors,
  getSingleTutor,
  updateTutorProfile,
  deleteTutorProfile,
  getTutorDashboardStats,
  getSingleTutorByUserId
};
