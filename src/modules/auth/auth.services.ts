import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";

export const authServices = {
  async getMe(user: any) {
    if (!user) return null;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true, 
      },
    });

    return dbUser;
  },

  async signOut(headers: any) {
    return await auth.api.signOut({ headers });
  },
};