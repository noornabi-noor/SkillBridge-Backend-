import express from "express"
import { availabiltyController } from "./availability.controller";

const router = express.Router();

router.get("/", availabiltyController.getAllAvailabilty);
router.get("/:id", availabiltyController.getSingleAvailability);
router.post("/:id", availabiltyController.createAvailability);
router.patch("/:id", availabiltyController.updateAvailability);
router.delete("/:id", availabiltyController.deleteAvailability)

export const availabilityRouter = router;