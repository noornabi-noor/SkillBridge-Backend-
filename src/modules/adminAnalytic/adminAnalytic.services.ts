import { prisma } from "../../lib/prisma";

const getDashboardData = async () => {
  const totalUsers = await prisma.user.count();
  const totalStaff = await prisma.user.count({
    where: { role: "TUTOR" },
  });
  const totalBookings = await prisma.booking.count();
  const totalCategories = await prisma.category.count();

  return {
    totalUsers,
    totalStaff,
    totalBookings,
    totalCategories,
  };
};

const getStats = async () => {
  const bookingStatusStats = await prisma.booking.groupBy({
    by: ["status"],
    _count: {
      status: true,
    },
  });

  const userRoleStats = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      role: true,
    },
  });

  return {
    bookingStatusStats,
    userRoleStats,
  };
};

export const adminAnalyticsServices = {
  getDashboardData,
  getStats,
};
