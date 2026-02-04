import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return await prisma.user.findMany({
    where: {
      role: { in: ["STUDENT", "TUTOR"] }, 
    },
    orderBy: { createdAt: "desc" },
    include: {
      tutorProfile: {
        include: {
          bookings: true,
          reviews: true,
        },
      },
    },
  });
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      tutorProfile: {
        include: {
          bookings: true,
          reviews: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  if (user.role === "TUTOR" && user.tutorProfile) {
    const totalReviews = user.tutorProfile.reviews.length;
    const avgRating =
      totalReviews === 0
        ? "0.0"
        : (
            user.tutorProfile.reviews.reduce(
              (sum, r) => sum + r.rating,
              0,
            ) / totalReviews
          ).toFixed(1);

    return {
      ...user,
      tutorProfile: {
        ...user.tutorProfile,
        totalBookings: user.tutorProfile.bookings.length,
        totalReviews,
        averageRating: avgRating,
      },
    };
  }

  return user;
};


const getCurrentUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  return user;
};

const updateUserStatus = async (id: string, status: "ACTIVE" | "BANNED") => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  return await prisma.user.update({
    where: { id },
    data: { status },
  });
};

const updateUserProfile = async (id: string, data: { name?: string; email?: string; image?: string, phone?: string }) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  return await prisma.user.update({
    where: { id },
    data: {
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      image: data.image ?? user.image,
      phone: data.phone ?? user.phone
    },
  });
};



export const usersServices = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserStatus,
  updateUserProfile,
};
