// src/app.ts
import express11 from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  STUDENT\n  TUTOR\n  ADMIN\n}\n\nenum BookingStatus {\n  PENDING\n  CONFIRMED\n  COMPLETED\n  CANCELLED\n}\n\nenum UserStatus {\n  ACTIVE\n  BANNED\n}\n\nmodel TutorProfile {\n  id           String   @id @default(uuid())\n  userId       String   @unique\n  bio          String?\n  pricePerHour Int\n  experience   Int\n  rating       Float    @default(0)\n  totalReviews Int      @default(0)\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  user         User            @relation(fields: [userId], references: [id], onDelete: Cascade)\n  categories   TutorCategory[]\n  availability Availability[]\n  bookings     Booking[]       @relation("TutorBookings")\n  reviews      Review[]\n\n  @@map("tutor_profiles")\n}\n\nmodel Category {\n  id        String   @id @default(uuid())\n  name      String   @unique\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  tutors TutorCategory[]\n\n  @@map("categories")\n}\n\nmodel TutorCategory {\n  id         String @id @default(uuid())\n  tutorId    String\n  categoryId String\n\n  tutor    TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  category Category     @relation(fields: [categoryId], references: [id], onDelete: Cascade)\n\n  @@unique([tutorId, categoryId])\n  @@map("tutor_categories")\n}\n\nmodel Availability {\n  id        String  @id @default(uuid())\n  tutorId   String\n  dayOfWeek Int\n  startTime String\n  endTime   String\n  isBooked  Boolean @default(false)\n\n  tutor TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("availability")\n}\n\nmodel Booking {\n  id        String        @id @default(uuid())\n  studentId String\n  tutorId   String\n  date      DateTime\n  startTime String\n  endTime   String\n  status    BookingStatus @default(PENDING)\n  createdAt DateTime      @default(now())\n  updatedAt DateTime      @updatedAt\n\n  student User         @relation("StudentBookings", fields: [studentId], references: [id], onDelete: Cascade)\n  tutor   TutorProfile @relation("TutorBookings", fields: [tutorId], references: [id], onDelete: Cascade)\n  review  Review?\n\n  @@index([tutorId, date])\n  @@map("bookings")\n}\n\nmodel Review {\n  id        String   @id @default(uuid())\n  studentId String\n  tutorId   String\n  bookingId String   @unique\n  rating    Int\n  comment   String?\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  student User         @relation(fields: [studentId], references: [id], onDelete: Cascade)\n  tutor   TutorProfile @relation(fields: [tutorId], references: [id], onDelete: Cascade)\n  booking Booking      @relation(fields: [bookingId], references: [id], onDelete: Cascade)\n\n  @@map("reviews")\n}\n\nmodel User {\n  id            String    @id\n  name          String\n  email         String\n  emailVerified Boolean   @default(false)\n  image         String?\n  phone         String?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  sessions      Session[]\n  accounts      Account[]\n\n  role   Role       @default(STUDENT)\n  status UserStatus @default(ACTIVE)\n\n  tutorProfile    TutorProfile?\n  studentBookings Booking[]     @relation("StudentBookings")\n  reviews         Review[]\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"TutorProfile":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bio","kind":"scalar","type":"String"},{"name":"pricePerHour","kind":"scalar","type":"Int"},{"name":"experience","kind":"scalar","type":"Int"},{"name":"rating","kind":"scalar","type":"Float"},{"name":"totalReviews","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"TutorProfileToUser"},{"name":"categories","kind":"object","type":"TutorCategory","relationName":"TutorCategoryToTutorProfile"},{"name":"availability","kind":"object","type":"Availability","relationName":"AvailabilityToTutorProfile"},{"name":"bookings","kind":"object","type":"Booking","relationName":"TutorBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToTutorProfile"}],"dbName":"tutor_profiles"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"tutors","kind":"object","type":"TutorCategory","relationName":"CategoryToTutorCategory"}],"dbName":"categories"},"TutorCategory":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorCategoryToTutorProfile"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToTutorCategory"}],"dbName":"tutor_categories"},"Availability":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"dayOfWeek","kind":"scalar","type":"Int"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"isBooked","kind":"scalar","type":"Boolean"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"AvailabilityToTutorProfile"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"availability"},"Booking":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"date","kind":"scalar","type":"DateTime"},{"name":"startTime","kind":"scalar","type":"String"},{"name":"endTime","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"BookingStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"User","relationName":"StudentBookings"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"TutorBookings"},{"name":"review","kind":"object","type":"Review","relationName":"BookingToReview"}],"dbName":"bookings"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"studentId","kind":"scalar","type":"String"},{"name":"tutorId","kind":"scalar","type":"String"},{"name":"bookingId","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"student","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"tutor","kind":"object","type":"TutorProfile","relationName":"ReviewToTutorProfile"},{"name":"booking","kind":"object","type":"Booking","relationName":"BookingToReview"}],"dbName":"reviews"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"UserStatus"},{"name":"tutorProfile","kind":"object","type":"TutorProfile","relationName":"TutorProfileToUser"},{"name":"studentBookings","kind":"object","type":"Booking","relationName":"StudentBookings"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/lib/auth.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  trustedOrigins: [
    process.env.APP_URL,
    "http://localhost:3000"
  ],
  // trustedOrigins: [
  //   "https://skillbridge-frontend-liard.vercel.app",
  //   "https://skill-bridge-mocha.vercel.app",
  //   "https://skillbridge-0r8a.onrender.com",
  // ],
  session: {
    cookieCache: {
      secure: true,
      enabled: true,
      maxAge: 5 * 60,
      // 5 minutes
      // sameSite: "lax",
      sameSite: "none",
      httpOnly: true,
      path: "/"
    }
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    // useSecureCookies: true,
    crossSubDomainCookies: {
      enabled: false
    }
    // disableCSRFCheck: true,
  },
  // session: {
  //   cookieCache: {
  //     secure: true,
  //     enabled: true,
  //     maxAge: 5 * 60,
  //     sameSite: "lax",
  //     httpOnly: true,
  //     path: "/",
  //   },
  // },
  // advanced: {
  //   useSecureCookies: true,
  //   cookiePrefix: "__Secure-better-auth",
  // },
  // advanced: {
  //   useSecureCookies: true,
  //   defaultCookieAttributes: {
  //     sameSite: "none",
  //     secure: true,
  //   },
  //   // ADD THIS SECTION: Specifically target the 'state' cookie
  //   cookies: {
  //     state: {
  //       attributes: {
  //         sameSite: "none",
  //         secure: true,
  //       },
  //     },
  //   },
  // },
  // advanced: {
  //   defaultCookieAttributes: {
  //     sameSite: "lax",
  //     secure: true,
  //     httpOnly: true,
  //     // partitioned: true,
  //   },
  // },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  // additional field added within user table
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "STUDENT",
        required: false
      },
      phone: {
        type: "string",
        required: false
      },
      image: {
        type: "string",
        required: false
      }
    }
  },
  // Email verification part by nodemailer
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    //after sign up automatic sign in app
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verifationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"SkillBridge" <skillbridge@gmail.com>',
          to: user.email,
          subject: "Please Verify Your Email!",
          html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background-color: #4f46e5; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0;">SkillBridge</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding: 30px; color: #333333;">
                <h2 style="margin-top: 0;">Verify your email address</h2>
                <p>
                  Thanks for creating an account! Please confirm your email address by clicking the button below.
                </p>

                <div style="text-align: center; margin: 30px 0;">
                  <a
                    href="${verifationUrl}"
                    style="
                      background-color: #4f46e5;
                      color: #ffffff;
                      padding: 12px 24px;
                      text-decoration: none;
                      border-radius: 6px;
                      display: inline-block;
                      font-weight: bold;
                    "
                  >
                    Verify Email
                  </a>
                </div>

                <p>
                  If you didn\u2019t create this account, you can safely ignore this email.
                </p>

                <p style="font-size: 14px; color: #777777;">
                  This link will expire in a limited time.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #777777;">
                \xA9 2026 SkillBridge. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
        });
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      accessType: "offline",
      prompt: "select_account consent"
    }
  },
  redirectTo: process.env.APP_URL
  // redirectTo: process.env.BETTER_AUTH_URL,
});

// src/modules/tutor/tutor.routes.ts
import express from "express";

// src/middleware/auth.ts
var auth2 = (...roles) => async (req, res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: {
        cookie: req.headers.cookie || "",
        authorization: req.headers.authorization || ""
      }
    });
    if (!session) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized!"
      });
    }
    if (!session.user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Email verification required!"
      });
    }
    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        tutorProfile: {
          select: { id: true }
        }
      }
    });
    if (!dbUser) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    req.user = {
      id: dbUser.id,
      email: session.user.email,
      name: session.user.name,
      role: dbUser.role,
      emailVerified: session.user.emailVerified,
      tutorProfileId: dbUser.tutorProfile?.id ?? null
    };
    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission!"
      });
    }
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication"
    });
  }
};

// src/modules/tutor/tutor.services.ts
var createTutorProfile = async (data, userId) => {
  return prisma.tutorProfile.upsert({
    where: { userId },
    update: {
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories: {
        deleteMany: {},
        create: data.categories?.map((name) => ({
          category: {
            connectOrCreate: {
              where: { name },
              create: { name }
            }
          }
        })) || []
      }
    },
    create: {
      userId,
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories: {
        create: data.categories?.map((name) => ({
          category: {
            connectOrCreate: {
              where: { name },
              create: { name }
            }
          }
        })) || []
      }
    }
  });
};
var getAllTutors = async () => {
  return await prisma.tutorProfile.findMany({
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true
        }
      },
      categories: {
        include: {
          category: true
        }
      },
      reviews: true
    }
  });
};
var getSingleTutor = async (id) => {
  return await prisma.tutorProfile.findFirst({
    where: {
      id
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          phone: true
        }
      },
      categories: {
        include: {
          category: true
        }
      },
      availability: {
        where: {
          isBooked: false
        },
        orderBy: {
          dayOfWeek: "asc"
        }
      },
      reviews: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      }
    }
  });
};
var updateTutorProfile = async (userId, data) => {
  return prisma.tutorProfile.upsert({
    where: { userId },
    update: {
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories: {
        deleteMany: {},
        create: data.categories?.map((name) => ({
          category: {
            connectOrCreate: {
              where: { name },
              create: { name }
            }
          }
        })) || []
      }
    },
    create: {
      userId,
      bio: data.bio,
      experience: data.experience,
      pricePerHour: data.pricePerHour,
      categories: {
        create: data.categories?.map((name) => ({
          category: {
            connectOrCreate: {
              where: { name },
              create: { name }
            }
          }
        })) || []
      }
    }
  });
};
var deleteTutorProfile = async (userId) => {
  const tutorData = await prisma.tutorProfile.findFirst({
    where: {
      userId
    }
  });
  if (!tutorData) {
    throw new Error("Tutor profile not found");
  }
  return prisma.tutorProfile.delete({
    where: {
      userId
    }
  });
};
async function getTutorDashboardStats(userId) {
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
          image: true
        }
      }
    }
  });
  if (!profile) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true
      }
    });
    return {
      user,
      profile: null,
      bookings: [],
      reviews: [],
      totalBookings: 0,
      totalReviews: 0,
      averageRating: 0,
      upcomingSessions: 0
    };
  }
  const bookings = await prisma.booking.findMany({
    where: { tutorId: profile.userId }
  });
  const reviews = await prisma.review.findMany({
    where: { tutorId: profile.userId }
  });
  const totalReviews = reviews.length;
  const averageRating = totalReviews === 0 ? 0 : parseFloat(
    (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
  );
  const upcomingSessions = bookings.filter(
    (b) => new Date(b.date) > /* @__PURE__ */ new Date()
  ).length;
  return {
    user: profile.user,
    profile,
    bookings,
    reviews,
    totalBookings: bookings.length,
    totalReviews,
    averageRating,
    upcomingSessions
  };
}
var getSingleTutorByUserId = async (userId) => {
  return await prisma.tutorProfile.findFirst({
    where: { userId },
    include: {
      categories: {
        include: {
          category: true
        }
      }
    }
  });
};
var getTopRatedTutor = async () => {
  return await prisma.tutorProfile.findMany({
    orderBy: {
      rating: "desc"
    },
    take: 6,
    include: {
      user: true
    }
  });
};
var tutorServices = {
  createTutorProfile,
  getAllTutors,
  getSingleTutor,
  updateTutorProfile,
  deleteTutorProfile,
  getTutorDashboardStats,
  getSingleTutorByUserId,
  getTopRatedTutor
};

// src/modules/tutor/tutor.controller.ts
var createTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.role === "TUTOR" /* TUTOR */) {
      return res.status(400).json({
        success: false,
        message: "You are already a tutor"
      });
    }
    const tutorProfile = await tutorServices.createTutorProfile(
      req.body,
      user.id
    );
    await prisma.user.update({
      where: { id: user.id },
      data: { role: "TUTOR" /* TUTOR */ }
    });
    return res.status(201).json({
      success: true,
      data: tutorProfile
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getAllTutors2 = async (req, res) => {
  try {
    const result = await tutorServices.getAllTutors();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff"
    });
  }
};
var getSingleTutor2 = async (req, res) => {
  try {
    const { id: userId } = req.params;
    const result = await tutorServices.getSingleTutor(userId);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Tutor not found"
      });
    }
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch tutor"
    });
  }
};
var updateTutorProfile2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const data = req.body;
    const updatedProfile = await tutorServices.updateTutorProfile(user.id, data);
    return res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    console.error("UpdateTutorProfile error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update tutor profile"
    });
  }
};
var deleteTutorProfile2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tutorServices.deleteTutorProfile(id);
    return res.status(200).json({
      success: true,
      message: "Tutor profile deleted successfully",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete tutor profile"
    });
  }
};
var getTutorDashboardStats2 = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await tutorServices.getTutorDashboardStats(id);
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
var getTutorByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const tutor = await tutorServices.getSingleTutorByUserId(userId);
    if (!tutor)
      return res.status(404).json({ success: false, message: "Tutor not found" });
    res.status(200).json({ success: true, data: tutor });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getTopRatedTutor2 = async (req, res) => {
  try {
    const result = await tutorServices.getTopRatedTutor();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var tutorController = {
  createTutorProfile: createTutorProfile2,
  getAllTutors: getAllTutors2,
  getSingleTutor: getSingleTutor2,
  updateTutorProfile: updateTutorProfile2,
  deleteTutorProfile: deleteTutorProfile2,
  getTutorDashboardStats: getTutorDashboardStats2,
  getTutorByUserId,
  getTopRatedTutor: getTopRatedTutor2
};

// src/modules/tutor/tutor.routes.ts
var router = express.Router();
router.get("/top-tutor", tutorController.getTopRatedTutor);
router.get("/by-user/:userId", tutorController.getTutorByUserId);
router.get("/dashboard/:id", auth2("TUTOR" /* TUTOR */), tutorController.getTutorDashboardStats);
router.get("/", tutorController.getAllTutors);
router.get("/:id", tutorController.getSingleTutor);
router.post("/", auth2(), tutorController.createTutorProfile);
router.patch("/", auth2("TUTOR" /* TUTOR */), tutorController.updateTutorProfile);
router.delete("/:id", auth2("TUTOR" /* TUTOR */, "ADMIN" /* ADMIN */), tutorController.deleteTutorProfile);
var tutorRouter = router;

// src/modules/categories/categories.routes.ts
import express2 from "express";

// src/modules/categories/categories.services.ts
var createCategories = async (data) => {
  const existing = await prisma.category.findFirst({
    where: {
      name: {
        equals: data.name,
        mode: "insensitive"
      }
    }
  });
  if (existing) {
    throw new Error(`Category "${data.name}" already exists`);
  }
  return await prisma.category.create({
    data: {
      ...data
    }
  });
};
var getAllCategory = async () => {
  return await prisma.category.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      // tutors: {
      //   select: {
      //     tutor: {
      //       select: {
      //         id: true,
      //         userId: true,
      //         bio: true,
      //         pricePerHour: true,
      //         experience: true,
      //         rating: true,
      //       },
      //     },
      //   },
      // },
      tutors: {
        select: {
          tutor: {
            select: {
              id: true,
              userId: true,
              bio: true,
              pricePerHour: true,
              experience: true,
              rating: true,
              user: {
                select: {
                  name: true,
                  image: true,
                  email: true
                  // optional if needed
                }
              }
            }
          }
        }
      }
    }
  });
};
var getSingleCategory = async (categoryId) => {
  const categoryData = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  });
  if (!categoryData) {
    throw new Error("Can not get category data!");
  }
  return await prisma.category.findUnique({
    where: {
      id: categoryId
    },
    include: {
      tutors: {
        include: {
          tutor: true
        }
      }
    }
  });
};
var updateCategory = async (categoryId, data) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { tutors: true }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const updateData = {};
  if (data.name) {
    updateData.name = data.name;
  }
  if (data.tutorIds && data.tutorIds.length > 0) {
    const existingTutorIds = category.tutors.map((t) => t.tutorId);
    const newTutors = data.tutorIds.filter(
      (id) => !existingTutorIds.includes(id)
    );
    if (newTutors.length > 0) {
      updateData.tutors = {
        create: newTutors.map((tutorId) => ({
          tutor: {
            connect: { id: tutorId }
          }
        }))
      };
    }
  }
  return prisma.category.update({
    where: { id: categoryId },
    data: updateData,
    include: {
      tutors: {
        include: {
          tutor: true
        }
      }
    }
  });
};
var deleteCategory = async (categoryId) => {
  const categoryData = await prisma.category.findUnique({
    where: {
      id: categoryId
    }
  });
  if (!categoryData) {
    throw new Error("Can not get category data!");
  }
  return await prisma.category.delete({
    where: {
      id: categoryId
    }
  });
};
var categoryServices = {
  createCategories,
  getAllCategory,
  getSingleCategory,
  updateCategory,
  deleteCategory
};

// src/modules/categories/categories.controller.ts
var createCategories2 = async (req, res) => {
  try {
    const result = await categoryServices.createCategories(req.body);
    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message
    });
  }
};
var getAllCategory2 = async (req, res) => {
  try {
    const result = await categoryServices.getAllCategory();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch all category data"
    });
  }
};
var getSingleCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryServices.getSingleCategory(id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch category"
    });
  }
};
var updateCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tutorIds } = req.body;
    const result = await categoryServices.updateCategory(id, {
      name,
      tutorIds
    });
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var deleteCategory2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await categoryServices.deleteCategory(id);
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Failed to delete category"
    });
  }
};
var categoryController = {
  createCategories: createCategories2,
  getAllCategory: getAllCategory2,
  getSingleCategory: getSingleCategory2,
  updateCategory: updateCategory2,
  deleteCategory: deleteCategory2
};

// src/modules/categories/categories.routes.ts
var router2 = express2.Router();
router2.get("/", categoryController.getAllCategory);
router2.get("/:id", categoryController.getSingleCategory);
router2.post("/", auth2("ADMIN" /* ADMIN */), categoryController.createCategories);
router2.patch("/:id", auth2("ADMIN" /* ADMIN */), categoryController.updateCategory);
router2.delete("/:id", auth2("ADMIN" /* ADMIN */), categoryController.deleteCategory);
var categoryRouter = router2;

// src/modules/availability/availability.routes.ts
import express3 from "express";

// src/modules/availability/availability.services.ts
var createAvailability = async (data, tutorId) => {
  return await prisma.availability.create({
    data: {
      ...data,
      dayOfWeek: Number(data.dayOfWeek),
      tutorId
    }
  });
};
var getAllAvailabilty = async () => {
  return await prisma.availability.findMany({
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      isBooked: true,
      createdAt: true,
      tutor: {
        select: {
          id: true,
          bio: true,
          pricePerHour: true,
          experience: true,
          rating: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
};
var getSingleAvailability = async (availabilityId) => {
  const availabilityData = await prisma.availability.findUnique({
    where: {
      id: availabilityId
    }
  });
  if (!availabilityData) {
    throw new Error("Cannot fetch availability data");
  }
  return await prisma.availability.findUnique({
    where: {
      id: availabilityId
    },
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true,
      isBooked: true,
      createdAt: true,
      tutor: {
        select: {
          id: true,
          bio: true,
          pricePerHour: true,
          experience: true,
          rating: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    }
  });
};
var updateAvailability = async (availabilityId, data) => {
  const availabilityData = await prisma.availability.findUnique({
    where: { id: availabilityId }
  });
  if (!availabilityData) {
    throw new Error("Cannot fetch availability data");
  }
  return prisma.availability.update({
    where: { id: availabilityId },
    data: {
      ...data.dayOfWeek !== void 0 && {
        dayOfWeek: Number(data.dayOfWeek)
      },
      ...data.startTime && { startTime: data.startTime },
      ...data.endTime && { endTime: data.endTime },
      ...data.isBooked !== void 0 && { isBooked: data.isBooked }
    }
  });
};
var deleteAvailability = async (avilabilityId) => {
  return await prisma.availability.delete({
    where: {
      id: avilabilityId
    }
  });
};
var getAvailabilityByTutor = async (tutorId) => {
  return prisma.availability.findMany({
    where: {
      tutorId,
      isBooked: false
    },
    select: {
      id: true,
      dayOfWeek: true,
      startTime: true,
      endTime: true
    },
    orderBy: [
      { dayOfWeek: "asc" },
      { startTime: "asc" }
    ]
  });
};
var availabilityServices = {
  createAvailability,
  getAllAvailabilty,
  getSingleAvailability,
  updateAvailability,
  deleteAvailability,
  getAvailabilityByTutor
};

// src/modules/availability/availability.controller.ts
var createAvailability2 = async (req, res) => {
  try {
    const tutorId = req.user?.tutorProfileId;
    if (!tutorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = await availabilityServices.createAvailability(req.body, tutorId);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Create availability error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create availability",
      error: error.message
    });
  }
};
var getAllAvailabilty2 = async (Req, res) => {
  try {
    const result = await availabilityServices.getAllAvailabilty();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Availabilty"
    });
  }
};
var getSingleAvailability2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await availabilityServices.getSingleAvailability(
      id
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Availabilty"
    });
  }
};
var updateAvailability2 = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No data provided to update"
      });
    }
    const { id } = req.params;
    const result = await availabilityServices.updateAvailability(
      id,
      req.body
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error("Update availability error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var deleteAvailability2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await availabilityServices.deleteAvailability(id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete Availabilty"
    });
  }
};
var getAvailabilityByTutor2 = async (req, res) => {
  try {
    let tutorId = req.params.tutorId;
    if (!tutorId) {
      return res.status(400).json({
        success: false,
        message: "Tutor ID is required"
      });
    }
    const result = await availabilityServices.getAvailabilityByTutor(tutorId);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tutor availability"
    });
  }
};
var getMyAvailability = async (req, res) => {
  try {
    const tutorId = req.user?.tutorProfileId;
    if (!tutorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const result = await availabilityServices.getAvailabilityByTutor(tutorId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability"
    });
  }
};
var availabiltyController = {
  createAvailability: createAvailability2,
  getAllAvailabilty: getAllAvailabilty2,
  getSingleAvailability: getSingleAvailability2,
  updateAvailability: updateAvailability2,
  deleteAvailability: deleteAvailability2,
  getAvailabilityByTutor: getAvailabilityByTutor2,
  getMyAvailability
};

// src/modules/availability/availability.routes.ts
var router3 = express3.Router();
router3.get("/", availabiltyController.getAllAvailabilty);
router3.get("/me", auth2("TUTOR" /* TUTOR */), availabiltyController.getMyAvailability);
router3.get("/tutor/:tutorId", availabiltyController.getAvailabilityByTutor);
router3.get("/:id", availabiltyController.getSingleAvailability);
router3.post("/me", auth2("TUTOR" /* TUTOR */), availabiltyController.createAvailability);
router3.patch("/:id", auth2("TUTOR" /* TUTOR */), availabiltyController.updateAvailability);
router3.delete("/:id", auth2("TUTOR" /* TUTOR */), availabiltyController.deleteAvailability);
var availabilityRouter = router3;

// src/modules/bookings/bookings.routes.ts
import express4 from "express";

// src/modules/bookings/bookings.services.ts
var toMinutes = (time) => {
  time = time.trim();
  const match24 = time.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (match24) {
    const h = Number(match24[1]);
    const m = Number(match24[2]);
    return h * 60 + m;
  }
  const match12 = time.match(/^(\d{1,2}):([0-5]\d)\s?(AM|PM)$/i);
  if (match12 && match12[1] && match12[2] && match12[3]) {
    const h = Number(match12[1]);
    const m = Number(match12[2]);
    const period = match12[3].toUpperCase();
    let hours = h === 12 ? 0 : h;
    if (period === "PM") hours += 12;
    return hours * 60 + m;
  }
  throw new Error(`Invalid time format: ${time}`);
};
var createBooking = async (studentId, data) => {
  const startMin = toMinutes(data.startTime);
  const endMin = toMinutes(data.endTime);
  if (startMin >= endMin) {
    throw new Error("End time must be after start time");
  }
  const existingBookings = await prisma.booking.findMany({
    where: {
      tutorId: data.tutorId,
      date: data.date,
      status: { in: ["PENDING", "CONFIRMED"] }
    }
  });
  for (const b of existingBookings) {
    const bStart = toMinutes(b.startTime);
    const bEnd = toMinutes(b.endTime);
    if (startMin < bEnd && endMin > bStart) {
      throw new Error("This time slot is already booked for this tutor");
    }
  }
  return prisma.booking.create({
    data: {
      tutorId: data.tutorId,
      studentId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: "PENDING"
    }
  });
};
var getAllBookings = async () => {
  return prisma.booking.findMany({
    include: {
      tutor: {
        select: {
          id: true,
          bio: true,
          pricePerHour: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      },
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var getBookingById = async (bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      tutor: true,
      student: true
    }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  return booking;
};
var updateBooking = async (bookingId, data) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  return prisma.booking.update({
    where: { id: bookingId },
    data
  });
};
var deleteBooking = async (bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId }
  });
  if (!booking) {
    throw new Error("Booking not found");
  }
  return prisma.booking.delete({
    where: { id: bookingId }
  });
};
var getBookingsByTutor = async (tutorProfileId) => {
  return prisma.booking.findMany({
    where: { tutorId: tutorProfileId },
    include: {
      student: {
        select: { id: true, name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
};
var getUpcomingBookingsByTutor = async (tutorProfileId, studentId) => {
  const today = /* @__PURE__ */ new Date();
  today.setHours(0, 0, 0, 0);
  return prisma.booking.findMany({
    where: {
      tutorId: tutorProfileId,
      ...studentId && { studentId },
      // optional filter for current student
      date: { gte: today },
      status: { in: ["CONFIRMED", "PENDING"] }
    },
    include: { student: { select: { id: true, name: true } } },
    orderBy: [{ date: "asc" }, { startTime: "asc" }]
  });
};
var getBookingsByStudent = async (studentId) => {
  return prisma.booking.findMany({
    where: {
      studentId
    },
    include: {
      tutor: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var bookingServices = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByTutor,
  getUpcomingBookingsByTutor,
  getBookingsByStudent
};

// src/modules/bookings/bookings.controller.ts
var createBooking2 = async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await bookingServices.createBooking(studentId, {
      tutorId: req.body.tutorId,
      date: new Date(req.body.date),
      // convert string to Date
      startTime: req.body.startTime,
      endTime: req.body.endTime
    });
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getAllBookings2 = async (_req, res) => {
  try {
    const result = await bookingServices.getAllBookings();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getBookingById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await bookingServices.getBookingById(id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};
var updateBooking2 = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    const booking = await bookingServices.getBookingById(id);
    if (user.role === "STUDENT" && booking.studentId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (user.role === "TUTOR" && booking.tutorId !== user.tutorProfileId) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const allowedStatus = {
      STUDENT: ["CANCELLED"],
      TUTOR: ["CONFIRMED", "COMPLETED", "CANCELLED"],
      ADMIN: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"]
    };
    if (req.body.status && !allowedStatus[user.role]?.includes(req.body.status)) {
      return res.status(403).json({ message: "Invalid status change" });
    }
    const result = await bookingServices.updateBooking(id, req.body);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var deleteBooking2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await bookingServices.deleteBooking(id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getBookingsByTutor2 = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await bookingServices.getBookingsByTutor(id);
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
var getUpcomingBookingsByTutor2 = async (req, res) => {
  try {
    let tutorId = req.params.id;
    if (Array.isArray(tutorId)) {
      tutorId = tutorId[0];
    }
    if (!tutorId) {
      return res.status(400).json({ success: false, message: "Tutor ID is required" });
    }
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const bookings = await prisma.booking.findMany({
      where: {
        tutorId,
        // ✅ now TypeScript is happy
        date: { gte: today },
        status: { in: ["CONFIRMED", "PENDING"] }
      },
      include: { student: { select: { id: true, name: true } } },
      orderBy: [{ date: "asc" }, { startTime: "asc" }]
    });
    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch upcoming bookings" });
  }
};
var getMyBookings = async (req, res) => {
  try {
    const studentId = req.user.id;
    const bookings = await prisma.booking.findMany({
      where: { studentId },
      include: {
        tutor: {
          select: {
            id: true,
            user: { select: { id: true, name: true, image: true } },
            bio: true,
            pricePerHour: true
          }
        }
      },
      orderBy: { date: "asc" }
    });
    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};
var getTutorPublicBookings = async (req, res) => {
  let tutorId = req.params.id;
  if (Array.isArray(tutorId)) {
    tutorId = tutorId[0];
  }
  if (!tutorId) {
    return res.status(400).json({ success: false, message: "Tutor ID is required" });
  }
  const bookings = await prisma.booking.findMany({
    where: {
      tutorId,
      status: { in: ["PENDING", "CONFIRMED"] },
      // only blocking ones
      date: { gte: /* @__PURE__ */ new Date() }
    },
    select: {
      id: true,
      date: true,
      startTime: true,
      endTime: true,
      status: true
    },
    orderBy: { date: "asc" }
  });
  res.json({ data: bookings });
};
var bookingController = {
  createBooking: createBooking2,
  getAllBookings: getAllBookings2,
  getBookingById: getBookingById2,
  updateBooking: updateBooking2,
  deleteBooking: deleteBooking2,
  getBookingsByTutor: getBookingsByTutor2,
  getUpcomingBookingsByTutor: getUpcomingBookingsByTutor2,
  getMyBookings,
  getTutorPublicBookings
};

// src/modules/bookings/bookings.routes.ts
var router4 = express4.Router();
router4.get("/tutor/:id/upcoming", auth2("TUTOR" /* TUTOR */), bookingController.getUpcomingBookingsByTutor);
router4.get("/student/me", auth2("STUDENT" /* STUDENT */), bookingController.getMyBookings);
router4.get("/tutor/:tutorId/public", auth2("STUDENT" /* STUDENT */), bookingController.getTutorPublicBookings);
router4.get("/tutor/:id", auth2("TUTOR" /* TUTOR */), bookingController.getBookingsByTutor);
router4.get("/", auth2(), bookingController.getAllBookings);
router4.get("/:id", auth2("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */), bookingController.getBookingById);
router4.post("/", auth2("STUDENT" /* STUDENT */), bookingController.createBooking);
router4.patch("/:id", auth2("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */, "STUDENT" /* STUDENT */), bookingController.updateBooking);
router4.delete("/:id", auth2("ADMIN" /* ADMIN */, "TUTOR" /* TUTOR */), bookingController.deleteBooking);
var bookingRouter = router4;

// src/modules/review/review.routes.ts
import express5 from "express";

// src/modules/review/review.services.ts
var createReview = async (data) => {
  const review = await prisma.review.create({
    data
  });
  const reviews = await prisma.review.findMany({
    where: { tutorId: data.tutorId }
  });
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews;
  await prisma.tutorProfile.update({
    where: { id: data.tutorId },
    data: {
      rating: averageRating,
      totalReviews
    }
  });
  return review;
};
var getReviews = async (tutorId, studentId) => {
  return prisma.review.findMany({
    where: {
      ...tutorId && { tutorId },
      ...studentId && { studentId }
    },
    include: {
      student: true,
      tutor: {
        include: { user: true }
      },
      booking: true
    }
  });
};
var updateReview = async (reviewId, data) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) throw new Error("Review not found");
  const updated = await prisma.review.update({
    where: { id: reviewId },
    data
  });
  const reviews = await prisma.review.findMany({
    where: { tutorId: review.tutorId }
  });
  const totalReviews = reviews.length;
  const averageRating = totalReviews === 0 ? 0 : reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  await prisma.tutorProfile.update({
    where: { id: review.tutorId },
    data: { rating: averageRating }
  });
  return updated;
};
var deleteReview = async (reviewId) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId }
  });
  if (!review) throw new Error("Review not found");
  const tutorId = review.tutorId;
  await prisma.review.delete({
    where: { id: reviewId }
  });
  const remainingReviews = await prisma.review.findMany({
    where: { tutorId }
  });
  const totalReviews = remainingReviews.length;
  const averageRating = totalReviews === 0 ? 0 : remainingReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
  await prisma.tutorProfile.update({
    where: { id: tutorId },
    data: {
      rating: averageRating,
      totalReviews
    }
  });
  return true;
};
var getReviewsByTutor = async (tutorId) => {
  return await prisma.review.findMany({
    where: { tutorId },
    include: { student: true },
    orderBy: { createdAt: "desc" }
  });
};
var reviewServices = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  getReviewsByTutor
};

// src/modules/review/review.controller.ts
var createReview2 = async (req, res) => {
  try {
    const result = await reviewServices.createReview(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create review",
      error: error.message
    });
  }
};
var getReviews2 = async (req, res) => {
  try {
    const { tutorId, studentId } = req.query;
    const reviews = await reviewServices.getReviews(
      tutorId,
      studentId
    );
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var updateReview2 = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReview = await reviewServices.updateReview(id, req.body);
    res.status(200).json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var deleteReview2 = async (req, res) => {
  try {
    const { id } = req.params;
    await reviewServices.deleteReview(id);
    res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getReviewsByTutor2 = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await reviewServices.getReviewsByTutor(id);
    return res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
var reviewController = {
  createReview: createReview2,
  getReviews: getReviews2,
  updateReview: updateReview2,
  deleteReview: deleteReview2,
  getReviewsByTutor: getReviewsByTutor2
};

// src/modules/review/review.routes.ts
var router5 = express5.Router();
router5.get("/admin", auth2("ADMIN" /* ADMIN */), reviewController.getReviews);
router5.get("/tutor/:id", auth2("TUTOR" /* TUTOR */), reviewController.getReviewsByTutor);
router5.get("/", reviewController.getReviews);
router5.post("/", auth2("STUDENT" /* STUDENT */), reviewController.createReview);
router5.patch("/:id", auth2("STUDENT" /* STUDENT */), reviewController.updateReview);
router5.delete("/admin/:id", auth2("ADMIN" /* ADMIN */), reviewController.deleteReview);
router5.delete("/:id", auth2("STUDENT" /* STUDENT */), reviewController.deleteReview);
var reviewRouter = router5;

// src/modules/tutorCategory/tutorCategory.routes.ts
import express6 from "express";

// src/modules/tutorCategory/tutorCategory.services.ts
var addTutorToCategory = async (data) => {
  return prisma.tutorCategory.create({
    data
  });
};
var getTutorCategories = async (tutorId, categoryId) => {
  return prisma.tutorCategory.findMany({
    where: {
      ...tutorId && { tutorId },
      ...categoryId && { categoryId }
    },
    include: {
      tutor: {
        select: {
          id: true,
          bio: true,
          pricePerHour: true,
          experience: true
        }
      },
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};
var removeTutorFromCategory = async (id) => {
  const data = await prisma.tutorCategory.findUnique({
    where: { id }
  });
  if (!data) {
    throw new Error("TutorCategory not found");
  }
  return prisma.tutorCategory.delete({
    where: { id }
  });
};
var tutorCategoryServices = {
  addTutorToCategory,
  getTutorCategories,
  removeTutorFromCategory
};

// src/modules/tutorCategory/tutorCategory.controller.ts
var createTutorCategory = async (req, res) => {
  try {
    const result = await tutorCategoryServices.addTutorToCategory(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getTutorCategories2 = async (req, res) => {
  try {
    const { tutorId, categoryId } = req.query;
    const result = await tutorCategoryServices.getTutorCategories(
      tutorId,
      categoryId
    );
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var deleteTutorCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await tutorCategoryServices.removeTutorFromCategory(id);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var tutorCategoryController = {
  createTutorCategory,
  getTutorCategories: getTutorCategories2,
  deleteTutorCategory
};

// src/modules/tutorCategory/tutorCategory.routes.ts
var router6 = express6.Router();
router6.get("/", tutorCategoryController.getTutorCategories);
router6.post("/", auth2("TUTOR" /* TUTOR */), tutorCategoryController.createTutorCategory);
router6.delete("/:id", auth2("TUTOR" /* TUTOR */), tutorCategoryController.deleteTutorCategory);
var tutorCategoryRouter = router6;

// src/modules/admin/admin.routes.ts
import express7 from "express";

// src/modules/admin/admin.services.ts
var getAllUsers = async () => {
  return prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};
var updateUser = async (userId, data) => {
  return prisma.user.update({
    where: { id: userId },
    data
  });
};
var getAllTutor = async () => {
  return prisma.tutorProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      categories: {
        include: {
          category: true
        }
      }
    }
  });
};
var getAllBookings3 = async () => {
  return prisma.booking.findMany({
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      tutor: {
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};
var createCategory = async (data) => {
  return prisma.category.create({
    data
  });
};
var updateCategory3 = async (categoryId, data) => {
  return prisma.category.update({
    where: { id: categoryId },
    data
  });
};
var getDashboardStats = async () => {
  const totalUsers = await prisma.user.count();
  const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalTutors = await prisma.user.count({ where: { role: "TUTOR" } });
  const totalBookings = await prisma.booking.count();
  const threeDaysAgo = /* @__PURE__ */ new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const newUsers = await prisma.user.findMany({
    where: { createdAt: { gte: threeDaysAgo } },
    orderBy: { createdAt: "desc" }
  });
  return {
    totalUsers,
    totalStudents,
    totalTutors,
    totalBookings,
    newUsers
  };
};
var adminServices = {
  getAllUsers,
  updateUser,
  getAllTutor,
  getAllBookings: getAllBookings3,
  createCategory,
  updateCategory: updateCategory3,
  getDashboardStats
};

// src/modules/admin/admin.controller.ts
var getAllUsers2 = async (req, res) => {
  try {
    const users = await adminServices.getAllUsers();
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var updateUser2 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminServices.updateUser(id, req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getAllTutor2 = async (req, res) => {
  try {
    const staff = await adminServices.getAllTutor();
    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getAllBookings4 = async (req, res) => {
  try {
    const bookings = await adminServices.getAllBookings();
    res.status(200).json({
      success: true,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var createCategory2 = async (req, res) => {
  try {
    const result = await adminServices.createCategory(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var updateCategory4 = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminServices.updateCategory(id, req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
var getDashboardStats2 = async (req, res) => {
  try {
    const stats = await adminServices.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch dashboard stats"
    });
  }
};
var adminController = {
  getAllUsers: getAllUsers2,
  updateUser: updateUser2,
  getAllTutor: getAllTutor2,
  getAllBookings: getAllBookings4,
  createCategory: createCategory2,
  updateCategory: updateCategory4,
  getDashboardStats: getDashboardStats2
};

// src/modules/admin/admin.routes.ts
var router7 = express7.Router();
router7.get("/users", auth2("ADMIN" /* ADMIN */), adminController.getAllUsers);
router7.patch("/users/:id", auth2("ADMIN" /* ADMIN */), adminController.updateUser);
router7.get("/tutor", auth2("ADMIN" /* ADMIN */), adminController.getAllTutor);
router7.get("/bookings", auth2("ADMIN" /* ADMIN */), adminController.getAllBookings);
router7.get("/dashboard", auth2("ADMIN" /* ADMIN */), adminController.getDashboardStats);
router7.post("/categories", auth2("ADMIN" /* ADMIN */), adminController.createCategory);
router7.patch("/categories/:id", auth2("ADMIN" /* ADMIN */), adminController.updateCategory);
var adminRouter = router7;

// src/modules/adminAnalytic/adminAnalytic.routes.ts
import express8 from "express";

// src/modules/adminAnalytic/adminAnalytic.services.ts
var getDashboardData = async () => {
  const totalUsers = await prisma.user.count();
  const totalStaff = await prisma.user.count({
    where: { role: "TUTOR" }
  });
  const totalBookings = await prisma.booking.count();
  const totalCategories = await prisma.category.count();
  return {
    totalUsers,
    totalStaff,
    totalBookings,
    totalCategories
  };
};
var getStats = async () => {
  const bookingStatusStats = await prisma.booking.groupBy({
    by: ["status"],
    _count: {
      status: true
    }
  });
  const userRoleStats = await prisma.user.groupBy({
    by: ["role"],
    _count: {
      role: true
    }
  });
  return {
    bookingStatusStats,
    userRoleStats
  };
};
var adminAnalyticsServices = {
  getDashboardData,
  getStats
};

// src/modules/adminAnalytic/adminAnalytic.controller.ts
var getDashboardData2 = async (req, res) => {
  try {
    const result = await adminAnalyticsServices.getDashboardData();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getStats2 = async (req, res) => {
  try {
    const result = await adminAnalyticsServices.getStats();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var adminAnalyticsController = {
  getDashboardData: getDashboardData2,
  getStats: getStats2
};

// src/modules/adminAnalytic/adminAnalytic.routes.ts
var router8 = express8.Router();
router8.get("/dashboard", auth2("ADMIN" /* ADMIN */), adminAnalyticsController.getDashboardData);
router8.get("/stats", auth2("ADMIN" /* ADMIN */), adminAnalyticsController.getStats);
var adminAnalyticsRouter = router8;

// src/modules/users/user.routes.ts
import express9 from "express";

// src/modules/users/user.services.ts
var getAllUsers3 = async () => {
  return await prisma.user.findMany({
    where: {
      role: { in: ["STUDENT", "TUTOR"] }
    },
    orderBy: { createdAt: "desc" },
    include: {
      tutorProfile: {
        include: {
          bookings: true,
          reviews: true
        }
      }
    }
  });
};
var getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      tutorProfile: {
        include: {
          bookings: true,
          reviews: true
        }
      }
    }
  });
  if (!user) throw new Error("User not found");
  if (user.role === "TUTOR" && user.tutorProfile) {
    const totalReviews = user.tutorProfile.reviews.length;
    const avgRating = totalReviews === 0 ? "0.0" : (user.tutorProfile.reviews.reduce(
      (sum, r) => sum + r.rating,
      0
    ) / totalReviews).toFixed(1);
    return {
      ...user,
      tutorProfile: {
        ...user.tutorProfile,
        totalBookings: user.tutorProfile.bookings.length,
        totalReviews,
        averageRating: avgRating
      }
    };
  }
  return user;
};
var getCurrentUser = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  return user;
};
var updateUserStatus = async (id, status) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  return await prisma.user.update({
    where: { id },
    data: { status }
  });
};
var updateUserProfile = async (id, data) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");
  return await prisma.user.update({
    where: { id },
    data: {
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      image: data.image ?? user.image,
      phone: data.phone ?? user.phone
    }
  });
};
var usersServices = {
  getAllUsers: getAllUsers3,
  getUserById,
  getCurrentUser,
  updateUserStatus,
  updateUserProfile
};

// src/modules/users/user.controller.ts
var getAllUsers4 = async (_req, res) => {
  try {
    const users = await usersServices.getAllUsers();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
var getUserById2 = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await usersServices.getUserById(id);
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var getCurrentUser2 = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found!");
    }
    const result = await usersServices.getCurrentUser(user.id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
var updateUserStatus2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedUser = await usersServices.updateUserStatus(
      id,
      status
    );
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var updateUserProfile2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, image, phone } = req.body;
    const updatedUser = await usersServices.updateUserProfile(id, {
      name,
      email,
      image,
      phone
    });
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
var usersController = {
  getAllUsers: getAllUsers4,
  getUserById: getUserById2,
  getCurrentUser: getCurrentUser2,
  updateUserStatus: updateUserStatus2,
  updateUserProfile: updateUserProfile2
};

// src/modules/users/user.routes.ts
var router9 = express9.Router();
router9.get("/:id", auth2("ADMIN" /* ADMIN */, "STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */), usersController.getUserById);
router9.get("/me", auth2(), usersController.getCurrentUser);
router9.get("/", auth2("ADMIN" /* ADMIN */), usersController.getAllUsers);
router9.patch("/:id/status", auth2("ADMIN" /* ADMIN */), usersController.updateUserStatus);
router9.patch("/:id", auth2("STUDENT" /* STUDENT */, "TUTOR" /* TUTOR */), usersController.updateUserProfile);
var usersRouter = router9;

// src/modules/auth/auth.router.ts
import express10 from "express";

// src/modules/auth/auth.services.ts
var authServices = {
  async getMe(user) {
    if (!user) return null;
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true
      }
    });
    return dbUser;
  },
  async signOut(headers) {
    return await auth.api.signOut({ headers });
  }
};

// src/modules/auth/auth.controller.ts
var getMe = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  const user = await authServices.getMe(req.user);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return res.status(200).json({ success: true, data: user });
};
var signOut = async (req, res) => {
  await authServices.signOut(req.headers);
  return res.status(200).json({ success: true, message: "Logged out successfully" });
};
var authController = {
  getMe,
  signOut
};

// src/modules/auth/auth.router.ts
var router10 = express10.Router();
router10.get("/", auth2(), authController.getMe);
router10.post("/sign-out", auth2(), authController.signOut);
router10.get("/tutor-only", auth2("TUTOR" /* TUTOR */), (req, res) => {
  res.json({ success: true, message: `Hello ${req.user?.name}, you are a tutor!` });
});
var authRouter = router10;

// src/app.ts
var app = express11();
app.use(express11.json());
var allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL
  // Production frontend URL
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed = allowedOrigins.includes(origin) || /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) || /^https:\/\/.*\.vercel\.app$/.test(origin);
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"]
  })
);
app.all("/api/auth/*splat", toNodeHandler(auth));
app.use("/api/tutors", tutorRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/tutor-categories", tutorCategoryRouter);
app.use("/api/admin", adminRouter);
app.use("/api/adminAnalytic", adminAnalyticsRouter);
app.use("/api/users", usersRouter);
app.use("/api/me", authRouter);
app.get("", (req, res) => {
  res.send("Hello world!");
});
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
