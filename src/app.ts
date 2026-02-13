import express, { Request, Response } from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { tutorRouter } from "./modules/tutor/tutor.routes";
import { categoryRouter } from "./modules/categories/categories.routes";
import { availabilityRouter } from "./modules/availability/availability.routes";
import { bookingRouter } from "./modules/bookings/bookings.routes";
import { reviewRouter } from "./modules/review/review.routes";
import { tutorCategoryRouter } from "./modules/tutorCategory/tutorCategory.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { adminAnalyticsRouter } from "./modules/adminAnalytic/adminAnalytic.routes";
import { usersRouter } from "./modules/users/user.routes";
import { authRouter } from "./modules/auth/auth.router";

const app = express();
app.use(express.json());

// app.use(cors({
//   origin: "https://skillbridge-frontend-tan.vercel.app",
//   // origin: "http://localhost:3000",
//   credentials: true,
// }));

// Configure CORS to allow both production and Vercel preview deployments

const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  process.env.PROD_APP_URL, // Production frontend URL
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      // Check if origin is in allowedOrigins or matches Vercel preview pattern
      const isAllowed =
        allowedOrigins.includes(origin) ||
        /^https:\/\/next-blog-client.*\.vercel\.app$/.test(origin) ||
        /^https:\/\/.*\.vercel\.app$/.test(origin); 

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["Set-Cookie"],

  }),

);

// better auth 
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

app.get("", (req : Request, res: Response)=>{
    res.send("Hello world!");
});

export default app;