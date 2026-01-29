import express from "express"
import { availabiltyController } from "./availability.controller";
import { auth, userRoles } from "../../middleware/auth";

const router = express.Router();

router.get("/", availabiltyController.getAllAvailabilty);
router.get("/:id", availabiltyController.getSingleAvailability);
router.post("/:id", auth(userRoles.TUTOR), availabiltyController.createAvailability);
router.patch("/:id", auth(userRoles.TUTOR), availabiltyController.updateAvailability);
router.delete("/:id", auth(userRoles.TUTOR), availabiltyController.deleteAvailability)

export const availabilityRouter = router;