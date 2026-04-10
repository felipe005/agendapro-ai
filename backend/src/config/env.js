import dotenv from "dotenv";

dotenv.config();

const requiredInProduction = ["CLIENT_URL"];

for (const key of requiredInProduction) {
  if (process.env.NODE_ENV === "production" && !process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  falKey: process.env.FAL_KEY || "",
  demoMode: !process.env.FAL_KEY
};
