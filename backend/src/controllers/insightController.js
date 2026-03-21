import { insightService } from "../services/insightService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const insightController = {
  list: catchAsync(async (req, res) => {
    const result = await insightService.getSuggestions(req.user.id);
    res.json(result);
  })
};
