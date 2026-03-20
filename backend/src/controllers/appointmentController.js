import { appointmentService } from "../services/appointmentService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const appointmentController = {
  create: catchAsync(async (req, res) => {
    const appointment = await appointmentService.create(req.user.id, req.body);
    res.status(201).json(appointment);
  }),

  listByDay: catchAsync(async (req, res) => {
    const appointments = await appointmentService.listByDay(req.user.id, req.query.date);
    res.json(appointments);
  }),

  update: catchAsync(async (req, res) => {
    const appointment = await appointmentService.update(req.user.id, req.params.id, req.body);
    res.json(appointment);
  }),

  cancel: catchAsync(async (req, res) => {
    const appointment = await appointmentService.cancel(req.user.id, req.params.id);
    res.json(appointment);
  })
};

