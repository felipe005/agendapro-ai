import { financeService } from "../services/financeService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const financeController = {
  getOverview: catchAsync(async (req, res) => {
    const result = await financeService.getOverview(req.user.id);
    res.json(result);
  })
};
