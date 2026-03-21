import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import { getDayRange } from "../utils/date.js";

export const dashboardService = {
  async getSummary(userId) {
    const { start, end } = getDayRange();
    const now = new Date();

    const [todayAppointments, upcomingAppointments, activeClients, monthlyAppointments] = await Promise.all([
      prisma.appointment.count({
        where: {
          userId,
          scheduledAt: {
            gte: start,
            lte: end
          },
          status: {
            not: AppointmentStatus.CANCELED
          }
        }
      }),
      prisma.appointment.findMany({
        where: {
          userId,
          scheduledAt: {
            gte: now
          },
          status: {
            not: AppointmentStatus.CANCELED
          }
        },
        include: {
          client: true,
          service: true
        },
        orderBy: {
          scheduledAt: "asc"
        },
        take: 5
      }),
      prisma.client.count({
        where: { userId }
      }),
      prisma.appointment.findMany({
        where: {
          userId,
          scheduledAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), 1)
          },
          status: {
            not: AppointmentStatus.CANCELED
          }
        }
      })
    ]);

    const monthlyRevenue = monthlyAppointments.reduce(
      (sum, appointment) => sum + Number(appointment.price || 0),
      0
    );

    return {
      todayAppointments,
      upcomingAppointments,
      activeClients,
      monthlyRevenue
    };
  }
};
