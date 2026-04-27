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
import { paymentRouter } from "./modules/payments/payment.routes";
import errorHandler from "./middleware/globalErrorHandler";
import { notFound } from "./middleware/notFound";

const app = express();

// Stripe webhook must be before express.json() for raw body access
app.use("/api/v1/payments/webhook", express.raw({ type: "application/json" }));

// Move express.json() after better-auth handler to avoid issues
// app.use(express.json()); // Removed from here

const allowedOrigins = [
  process.env.APP_URL || "http://localhost:3000",
  "http://localhost:4000",
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

// Mount express json middleware before Better Auth handler
app.use(express.json());

// better auth 
app.all("/api/auth/*path", toNodeHandler(auth));

app.use("/api/v1/tutors", tutorRouter);

app.use("/api/v1/categories", categoryRouter);

app.use("/api/v1/availability", availabilityRouter);

app.use("/api/v1/bookings", bookingRouter);

app.use("/api/v1/reviews", reviewRouter);

app.use("/api/v1/tutor-categories", tutorCategoryRouter);

app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/adminAnalytic", adminAnalyticsRouter);

app.use("/api/v1/users", usersRouter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/payments", paymentRouter);

app.get("/", (req : Request, res: Response)=>{
    res.send("Hello world!");
});

// global error handler
app.use(errorHandler);
// not found
app.use(notFound);

export default app;