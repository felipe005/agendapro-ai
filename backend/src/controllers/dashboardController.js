import { dashboardService } from "../services/dashboardService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const dashboardController = {
  summary: catchAsync(async (req, res) => {
    const data = await dashboardService.getSummary(req.user.id);
    res.json(data);
  })
};

