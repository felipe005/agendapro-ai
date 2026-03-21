import { companyService } from "../services/companyService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const companyController = {
  getProfile: catchAsync(async (req, res) => {
    const result = await companyService.getProfile(req.user.id);
    res.json(result);
  }),

  updateProfile: catchAsync(async (req, res) => {
    const result = await companyService.updateProfile(req.user.id, req.body);
    res.json(result);
  }),

  updateBusinessHours: catchAsync(async (req, res) => {
    const result = await companyService.updateBusinessHours(req.user.id, req.body.hours);
    res.json(result);
  }),

  getAvailableSlots: catchAsync(async (req, res) => {
    const result = await companyService.getAvailableSlots(req.user.id, req.query.date);
    res.json(result);
  })
};
