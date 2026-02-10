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
//     origin: process.env.APP_URL,
//     // origin: "http://localhost:3000",
//     credentials: true,
// }))

// const allowedOrigins = [
//     "https://skillbridge-frontend-tan.vercel.app",
//   "http://localhost:3000",
// ];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     callback(new Error("CORS not allowed"));
//   },
//   credentials: true,
// }));

// const allowedOrigins = [
//   process.env.APP_URL!,  
//   "http://localhost:3000",
// ];

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true,
// }));


app.use(cors({
  origin: "https://skillbridge-frontend-tan.vercel.app",
  credentials: true,
}));



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