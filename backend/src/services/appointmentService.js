import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/ApiError.js";
import { getDayRange, getWeekdayFromDate, mergeDateAndTime, timeToMinutes } from "../utils/date.js";
import { whatsappService } from "./whatsappService.js";

const validStatuses = Object.values(AppointmentStatus);
const defaultAppointmentTemplate =
  "Ola, {cliente}. Seu horario para {servico} foi agendado em {data} as {hora}.";

const normalizeStatus = (status) => {
  if (!status) {
    return AppointmentStatus.PENDING;
  }

  const normalized = status.toUpperCase();

  if (!validStatuses.includes(normalized)) {
    throw new ApiError(400, "Status invalido.");
  }

  return normalized;
};

const validatePayload = ({ clientId, date, time, serviceName, serviceId }) => {
  if (!clientId) {
    throw new ApiError(400, "Cliente e obrigatorio.");
  }

  if (!date || !time) {
    throw new ApiError(400, "Data e hora sao obrigatorias.");
  }

  if (!serviceName?.trim() && !serviceId) {
    throw new ApiError(400, "Servico e obrigatorio.");
  }
};

const ensureClientOwnership = async (userId, clientId) => {
  const client = await prisma.client.findFirst({
    where: { id: clientId, userId }
  });

  if (!client) {
    throw new ApiError(404, "Cliente nao encontrado.");
  }
};

const formatDateParts = (date, timezone = "America/Sao_Paulo") => {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    timeZone: timezone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).formatToParts(date);

  const parts = Object.fromEntries(
    formatted
      .filter((item) => item.type !== "literal")
      .map((item) => [item.type, item.value])
  );

  return {
    date: `${parts.day}/${parts.month}/${parts.year}`,
    time: `${parts.hour}:${parts.minute}`
  };
};

const buildAppointmentMessage = ({ template, appointment, user }) => {
  const { date, time } = formatDateParts(appointment.scheduledAt, user.timezone);
  const replacements = {
    "{cliente}": appointment.client.name,
    "{empresa}": user.companyName || user.ownerName || "nossa equipe",
    "{servico}": appointment.serviceName,
    "{data}": date,
    "{hora}": time,
    "{status}": appointment.status,
    "{telefoneEmpresa}": user.businessPhone || "",
    "{observacoes}": appointment.notes || ""
  };

  return Object.entries(replacements).reduce(
    (message, [placeholder, value]) => message.split(placeholder).join(value),
    template?.trim() || defaultAppointmentTemplate
  );
};

export const appointmentService = {
  async create(userId, data) {
    validatePayload(data);
    await ensureClientOwnership(userId, data.clientId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        companyName: true,
        ownerName: true,
        businessPhone: true,
        autoSendAppointmentMessage: true,
        appointmentMessageTemplate: true,
        timezone: true
      }
    });
    const service = data.serviceId
      ? await prisma.service.findFirst({
          where: { id: data.serviceId, userId, isActive: true }
        })
      : null;
    const weekday = getWeekdayFromDate(data.date);
    const businessHour = await prisma.businessHour.findUnique({
      where: {
        userId_weekday: {
          userId,
          weekday
        }
      }
    });

    if (!businessHour?.isOpen) {
      throw new ApiError(400, "A empresa nao atende neste dia.");
    }

    const appointmentTime = timeToMinutes(data.time);
    if (
      appointmentTime < timeToMinutes(businessHour.startTime) ||
      appointmentTime >= timeToMinutes(businessHour.endTime)
    ) {
      throw new ApiError(400, "Horario fora do funcionamento da empresa.");
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId,
        clientId: data.clientId,
        serviceId: service?.id || null,
        serviceName: service?.name || data.serviceName.trim(),
        price: service?.price ?? (data.price !== undefined ? Number(data.price) : null),
        scheduledAt: mergeDateAndTime(data.date, data.time),
        status: normalizeStatus(data.status),
        notes: data.notes?.trim() || null
      },
      include: {
        client: true,
        service: true
      }
    });

    let notification = null;

    if (user?.autoSendAppointmentMessage && appointment.client.phone) {
      const message = buildAppointmentMessage({
        template: user.appointmentMessageTemplate,
        appointment,
        user
      });

      const result = await whatsappService.sendMessage(appointment.client.phone, message);
      notification = {
        ...result,
        message
      };
    }

    return {
      ...appointment,
      notification
    };
  },

  async listByDay(userId, date) {
    const { start, end } = getDayRange(date);

    return prisma.appointment.findMany({
      where: {
        userId,
        scheduledAt: {
          gte: start,
          lte: end
        }
      },
      include: {
        client: true,
        service: true
      },
      orderBy: {
        scheduledAt: "asc"
      }
    });
  },

  async update(userId, appointmentId, data) {
    validatePayload(data);

    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, userId }
    });

    if (!appointment) {
      throw new ApiError(404, "Agendamento nao encontrado.");
    }

    await ensureClientOwnership(userId, data.clientId);
    const service = data.serviceId
      ? await prisma.service.findFirst({
          where: { id: data.serviceId, userId, isActive: true }
        })
      : null;
    const weekday = getWeekdayFromDate(data.date);
    const businessHour = await prisma.businessHour.findUnique({
      where: {
        userId_weekday: {
          userId,
          weekday
        }
      }
    });

    if (!businessHour?.isOpen) {
      throw new ApiError(400, "A empresa nao atende neste dia.");
    }

    const appointmentTime = timeToMinutes(data.time);
    if (
      appointmentTime < timeToMinutes(businessHour.startTime) ||
      appointmentTime >= timeToMinutes(businessHour.endTime)
    ) {
      throw new ApiError(400, "Horario fora do funcionamento da empresa.");
    }

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        clientId: data.clientId,
        serviceId: service?.id || null,
        serviceName: service?.name || data.serviceName.trim(),
        price: service?.price ?? (data.price !== undefined ? Number(data.price) : appointment.price),
        scheduledAt: mergeDateAndTime(data.date, data.time),
        status: normalizeStatus(data.status),
        notes: data.notes?.trim() || null
      },
      include: {
        client: true,
        service: true
      }
    });
  },

  async cancel(userId, appointmentId) {
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, userId }
    });

    if (!appointment) {
      throw new ApiError(404, "Agendamento nao encontrado.");
    }

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.CANCELED
      },
      include: {
        client: true,
        service: true
      }
    });
  },

  async complete(userId, appointmentId) {
    const appointment = await prisma.appointment.findFirst({
      where: { id: appointmentId, userId }
    });

    if (!appointment) {
      throw new ApiError(404, "Agendamento nao encontrado.");
    }

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: AppointmentStatus.COMPLETED
      },
      include: {
        client: true,
        service: true
      }
    });
  }
};
