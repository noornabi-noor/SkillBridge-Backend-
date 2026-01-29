import { prisma } from "../../lib/prisma";

const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
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

export const usersServices = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUserStatus,
};
