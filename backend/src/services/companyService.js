import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/ApiError.js";
import { getWeekdayFromDate, minutesToTime, timeToMinutes } from "../utils/date.js";

const weekdayNames = [
  "Domingo",
  "Segunda-feira",
  "Terca-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sabado"
];

const sanitizeBusinessHour = (item) => ({
  ...item,
  weekdayLabel: weekdayNames[item.weekday]
});

const normalizeHours = (hours = []) =>
  hours
    .map((item) => ({
      weekday: Number(item.weekday),
      isOpen: Boolean(item.isOpen),
      startTime: item.startTime || "09:00",
      endTime: item.endTime || "18:00"
    }))
    .sort((a, b) => a.weekday - b.weekday);

const validateTimeRange = (item) => {
  if (!Number.isInteger(item.weekday) || item.weekday < 0 || item.weekday > 6) {
    throw new ApiError(400, "Dia da semana invalido.");
  }

  if (!item.isOpen) {
    return;
  }

  if (!item.startTime || !item.endTime) {
    throw new ApiError(400, "Horario inicial e final sao obrigatorios.");
  }

  if (timeToMinutes(item.endTime) <= timeToMinutes(item.startTime)) {
    throw new ApiError(400, "O horario final precisa ser maior que o inicial.");
  }
};

export const companyService = {
  async getProfile(userId) {
    const [user, services, businessHours] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          ownerName: true,
          companyName: true,
          businessType: true,
          businessPhone: true,
          timezone: true
        }
      }),
      prisma.service.findMany({
        where: { userId, isActive: true },
        orderBy: [{ price: "asc" }, { name: "asc" }]
      }),
      prisma.businessHour.findMany({
        where: { userId },
        orderBy: { weekday: "asc" }
      })
    ]);

    return {
      profile: user,
      services: services.map((service) => ({
        ...service,
        price: Number(service.price)
      })),
      businessHours: businessHours.map(sanitizeBusinessHour)
    };
  },

  async updateProfile(userId, data) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ownerName: data.ownerName?.trim() || null,
        companyName: data.companyName?.trim() || null,
        businessType: data.businessType?.trim() || null,
        businessPhone: data.businessPhone?.trim() || null,
        timezone: data.timezone?.trim() || "America/Sao_Paulo"
      },
      select: {
        id: true,
        email: true,
        ownerName: true,
        companyName: true,
        businessType: true,
        businessPhone: true,
        timezone: true
      }
    });

    return { profile: user };
  },

  async updateBusinessHours(userId, hours) {
    const normalized = normalizeHours(hours);

    if (normalized.length !== 7) {
      throw new ApiError(400, "Configure os 7 dias da semana.");
    }

    normalized.forEach(validateTimeRange);

    await prisma.$transaction(
      normalized.map((item) =>
        prisma.businessHour.upsert({
          where: {
            userId_weekday: {
              userId,
              weekday: item.weekday
            }
          },
          create: {
            userId,
            weekday: item.weekday,
            isOpen: item.isOpen,
            startTime: item.startTime,
            endTime: item.endTime
          },
          update: {
            isOpen: item.isOpen,
            startTime: item.startTime,
            endTime: item.endTime
          }
        })
      )
    );

    const updated = await prisma.businessHour.findMany({
      where: { userId },
      orderBy: { weekday: "asc" }
    });

    return {
      businessHours: updated.map(sanitizeBusinessHour)
    };
  },

  async getAvailableSlots(userId, date) {
    const weekday = getWeekdayFromDate(date);
    const [businessHour, services, appointments] = await Promise.all([
      prisma.businessHour.findUnique({
        where: {
          userId_weekday: {
            userId,
            weekday
          }
        }
      }),
      prisma.service.findMany({
        where: { userId, isActive: true },
        orderBy: { name: "asc" }
      }),
      prisma.appointment.findMany({
        where: {
          userId,
          scheduledAt: {
            gte: new Date(`${date}T00:00:00`),
            lte: new Date(`${date}T23:59:59`)
          },
          status: {
            not: "CANCELED"
          }
        },
        orderBy: { scheduledAt: "asc" }
      })
    ]);

    if (!businessHour?.isOpen) {
      return { slots: [], businessHour: businessHour ? sanitizeBusinessHour(businessHour) : null, services };
    }

    const start = timeToMinutes(businessHour.startTime);
    const end = timeToMinutes(businessHour.endTime);
    const occupied = new Set(appointments.map((appointment) => minutesToTime(appointment.scheduledAt.getHours() * 60 + appointment.scheduledAt.getMinutes())));
    const slots = [];

    for (let cursor = start; cursor < end; cursor += 30) {
      const time = minutesToTime(cursor);

      if (!occupied.has(time)) {
        slots.push(time);
      }
    }

    return {
      slots,
      businessHour: sanitizeBusinessHour(businessHour),
      services: services.map((service) => ({
        ...service,
        price: Number(service.price)
      }))
    };
  }
};
