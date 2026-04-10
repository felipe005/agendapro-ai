import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || "",
  falKey: process.env.FAL_KEY || "",
  demoMode: !process.env.FAL_KEY,
  nodeEnv: process.env.NODE_ENV || "development"
};
