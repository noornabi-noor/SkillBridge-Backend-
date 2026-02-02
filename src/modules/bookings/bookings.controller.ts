import { Request, Response } from "express";
import { bookingServices } from "./bookings.services";

// const createBooking = async (req: Request, res: Response) => {
//   try {
//     const studentId = req.user!.id;

//     const result = await bookingServices.createBooking(
//       studentId,
//       req.body,
//     );

//     res.status(201).json({
//       success: true,
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

const createBooking = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.id;

    const result = await bookingServices.createBooking(studentId, {
      tutorId: req.body.tutorId,
      date: new Date(req.body.date),  // convert string to Date
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const result = await bookingServices.getAllBookings();

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await bookingServices.getBookingById(id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await bookingServices.updateBooking(id as string, req.body);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await bookingServices.deleteBooking(id as string);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookingsByTutor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const bookings = await bookingServices.getBookingsByTutor(id as string);

    return res.status(200).json({ success: true, data: bookings });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUpcomingBookingsByTutor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // tutorProfileId

    const bookings = await bookingServices.getUpcomingBookingsByTutor(
      id as string,
    );

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getBookingsByTutor,
  getUpcomingBookingsByTutor,
};
