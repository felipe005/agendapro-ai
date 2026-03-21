import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../prisma/client.js";

const startOfMonth = () => {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
};

export const financeService = {
  async getOverview(userId) {
    const monthStart = startOfMonth();
    const now = new Date();

    const [appointments, totalClients, totalServices, topServices] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          userId,
          status: {
            not: AppointmentStatus.CANCELED
          }
        },
        include: {
          client: true,
          service: true
        },
        orderBy: {
          scheduledAt: "desc"
        }
      }),
      prisma.client.count({ where: { userId } }),
      prisma.service.count({ where: { userId, isActive: true } }),
      prisma.service.findMany({
        where: { userId, isActive: true },
        include: {
          appointments: {
            where: {
              status: {
                not: AppointmentStatus.CANCELED
              }
            }
          }
        }
      })
    ]);

    const totalRevenue = appointments.reduce((sum, appointment) => sum + Number(appointment.price || 0), 0);
    const monthlyAppointments = appointments.filter((appointment) => appointment.scheduledAt >= monthStart);
    const monthlyRevenue = monthlyAppointments.reduce((sum, appointment) => sum + Number(appointment.price || 0), 0);
    const completedToday = appointments.filter((appointment) => appointment.scheduledAt <= now).length;

    return {
      totals: {
        totalRevenue,
        monthlyRevenue,
        totalClients,
        totalServices,
        completedAppointments: completedToday
      },
      recentAppointments: appointments.slice(0, 8).map((appointment) => ({
        ...appointment,
        price: Number(appointment.price || 0)
      })),
      topServices: topServices
        .map((service) => ({
          id: service.id,
          name: service.name,
          revenue: service.appointments.reduce((sum, appointment) => sum + Number(appointment.price || 0), 0),
          count: service.appointments.length
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
    };
  }
};
