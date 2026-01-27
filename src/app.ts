import express, { Request, Response } from "express"
import cors from "cors"
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { tutorRouter } from "./modules/tutor/tutor.routes";
import { categoryRouter } from "./modules/categories/categories.routes";


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

app.get("/", (req : Request, res: Response)=>{
    res.send("Hello world!");
});


export default app;