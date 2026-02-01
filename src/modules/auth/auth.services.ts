import { auth } from "../../lib/auth";

export const authServices = {
  getMe(user: any) {
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    };
  },

  async signOut(headers: any) {
    return await auth.api.signOut({ headers });
  },

};


