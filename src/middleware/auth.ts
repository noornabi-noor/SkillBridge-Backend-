import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

export enum userRoles {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  TUTOR = "TUTOR",
}

export const auth =
  (...roles: userRoles[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized!",
        });
      }

      if (!session.user.emailVerified) {
        return res.status(403).json({
          success: false,
          message: "Email verification required!",
        });
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
      });

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: dbUser?.role ?? "STUDENT",
        emailVerified: session.user.emailVerified,
      };

      if (roles.length > 0 && !roles.includes(req.user.role as userRoles)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission to access this resource!",
        });
      }

      console.log("Authenticated session:", session);

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during authentication",
      });
    }
  };
