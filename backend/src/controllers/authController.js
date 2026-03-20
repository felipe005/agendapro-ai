import { authService } from "../services/authService.js";
import { catchAsync } from "../utils/catchAsync.js";

export const authController = {
  register: catchAsync(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  }),

  login: catchAsync(async (req, res) => {
    const result = await authService.login(req.body);
    res.json(result);
  }),

  me: catchAsync(async (req, res) => {
    res.json({ user: req.user });
  })
};

