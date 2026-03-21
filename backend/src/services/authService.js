import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/ApiError.js";

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  ownerName: user.ownerName,
  companyName: user.companyName,
  businessType: user.businessType,
  businessPhone: user.businessPhone,
  timezone: user.timezone,
  createdAt: user.createdAt
});

const generateToken = (userId) =>
  jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: "7d"
  });

export const authService = {
  async register({ email, password, ownerName, companyName }) {
    if (!email || !password) {
      throw new ApiError(400, "Email e senha sao obrigatorios.");
    }

    if (password.length < 6) {
      throw new ApiError(400, "A senha precisa ter pelo menos 6 caracteres.");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw new ApiError(409, "Ja existe uma conta com este email.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const createdUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          passwordHash,
          ownerName: ownerName?.trim() || null,
          companyName: companyName?.trim() || null
        }
      });

      await tx.businessHour.createMany({
        data: [
          { userId: createdUser.id, weekday: 0, isOpen: false, startTime: "09:00", endTime: "18:00" },
          { userId: createdUser.id, weekday: 1, isOpen: true, startTime: "09:00", endTime: "18:00" },
          { userId: createdUser.id, weekday: 2, isOpen: true, startTime: "09:00", endTime: "18:00" },
          { userId: createdUser.id, weekday: 3, isOpen: true, startTime: "09:00", endTime: "18:00" },
          { userId: createdUser.id, weekday: 4, isOpen: true, startTime: "09:00", endTime: "18:00" },
          { userId: createdUser.id, weekday: 5, isOpen: true, startTime: "09:00", endTime: "18:00" },
          { userId: createdUser.id, weekday: 6, isOpen: true, startTime: "09:00", endTime: "13:00" }
        ]
      });

      return createdUser;
    });

    return {
      token: generateToken(user.id),
      user: sanitizeUser(user)
    };
  },

  async login({ email, password }) {
    if (!email || !password) {
      throw new ApiError(400, "Email e senha sao obrigatorios.");
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      throw new ApiError(401, "Credenciais invalidas.");
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      throw new ApiError(401, "Credenciais invalidas.");
    }

    return {
      token: generateToken(user.id),
      user: sanitizeUser(user)
    };
  }
};
