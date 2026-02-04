// import { NextFunction, Request, Response } from "express";
// import { auth as betterAuth } from "../lib/auth";
// import { prisma } from "../lib/prisma";

// export enum userRoles {
//   STUDENT = "STUDENT",
//   ADMIN = "ADMIN",
//   TUTOR = "TUTOR",
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         email: string;
//         name: string;
//         role: string;
//         emailVerified: boolean;
//         image?: string;
//       };
//     }
//   }
// }


// export const auth =
//   (...roles: userRoles[]) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       // Get session from your auth library
//       const session = await betterAuth.api.getSession({
//         headers: {
//           cookie: req.headers.cookie || "",
//           authorization: req.headers.authorization || "",
//         },
//       });

//       // DEBUG: Check what session you actually have
//       console.log("==== DEBUG SESSION START ====");
//       console.log("req.headers.cookie:", req.headers.cookie);
//       console.log("req.headers.authorization:", req.headers.authorization);
//       console.log("session:", session);
//       console.log("==== DEBUG SESSION END ====");

//       // No session? Unauthorized
//       if (!session) {
//         return res.status(401).json({
//           success: false,
//           message: "You are not authorized!",
//         });
//       }

//       // Email verification check
//       if (!session.user.emailVerified) {
//         return res.status(403).json({
//           success: false,
//           message: "Email verification required!",
//         });
//       }

//       // Fetch role from database
//       const dbUser = await prisma.user.findUnique({
//         where: { id: session.user.id },
//         select: { role: true },
//       });

//       req.user = {
//         id: session.user.id,
//         email: session.user.email,
//         name: session.user.name,
//         role: dbUser?.role ?? "STUDENT",
//         emailVerified: session.user.emailVerified,
//       };

//       console.log("req.user.role:", req.user.role); // DEBUG: Check role

//       // Role check
//       if (roles.length > 0 && !roles.includes(req.user.role as userRoles)) {
//         return res.status(403).json({
//           success: false,
//           message: "You do not have permission to access this resource!",
//         });
//       }

//       // All good, continue
//       next();
//     } catch (error) {
//       console.error("Auth middleware error:", error);
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error during authentication",
//       });
//     }
//   };



import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export enum userRoles {
  STUDENT = "STUDENT",
  ADMIN = "ADMIN",
  TUTOR = "TUTOR",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: userRoles;
        emailVerified: boolean;
        tutorProfileId?: string | null;
        image?: string;
      };
    }
  }
}

export const auth =
  (...roles: userRoles[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: {
          cookie: req.headers.cookie || "",
          authorization: req.headers.authorization || "",
        },
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

      // ✅ FETCH USER + TUTOR PROFILE
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          tutorProfile: {
            select: { id: true },
          },
        },
      });

      if (!dbUser) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      // ✅ ATTACH tutorProfileId HERE
      req.user = {
        id: dbUser.id,
        email: session.user.email,
        name: session.user.name,
        role: dbUser.role as userRoles,
        emailVerified: session.user.emailVerified,
        tutorProfileId: dbUser.tutorProfile?.id ?? null,
      };

      // ✅ ROLE CHECK
      if (roles.length > 0 && !roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "You do not have permission!",
        });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error during authentication",
      });
    }
  };
