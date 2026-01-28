import express, { Request, Response } from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { tutorRouter } from "./modules/tutor/tutor.routes";
import { categoryRouter } from "./modules/categories/categories.routes";
import { availabilityRouter } from "./modules/availability/availability.routes";
import { bookingRouter } from "./modules/bookings/bookings.routes";
import { reviewRouter } from "./modules/review/review.routes";


const app = express();
app.use(express.json());

app.use(cors({
    origin: process.env.APP_URL,
    credentials: true
}))

// better auth 
app.all("/api/auth/*splat", toNodeHandler(auth));

app.use("/api/tutors", tutorRouter);

app.use("/api/categories", categoryRouter);

app.use("/api/availability", availabilityRouter);

app.use("/api/bookings", bookingRouter);

app.use("/api/reviews", reviewRouter);

app.get("/", (req : Request, res: Response)=>{
    res.send("Hello world!");
});


export default app;