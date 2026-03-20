import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/ApiError.js";
import { getDayRange, mergeDateAndTime } from "../utils/date.js";

const validStatuses = Object.values(AppointmentStatus);

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

const validatePayload = ({ clientId, date, time, serviceName }) => {
  if (!clientId) {
    throw new ApiError(400, "Cliente e obrigatorio.");
  }

  if (!date || !time) {
    throw new ApiError(400, "Data e hora sao obrigatorias.");
  }

  if (!serviceName?.trim()) {
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

export const appointmentService = {
  async create(userId, data) {
    validatePayload(data);
    await ensureClientOwnership(userId, data.clientId);

    return prisma.appointment.create({
      data: {
        userId,
        clientId: data.clientId,
        serviceName: data.serviceName.trim(),
        scheduledAt: mergeDateAndTime(data.date, data.time),
        status: normalizeStatus(data.status),
        notes: data.notes?.trim() || null
      },
      include: {
        client: true
      }
    });
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
        client: true
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

    return prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        clientId: data.clientId,
        serviceName: data.serviceName.trim(),
        scheduledAt: mergeDateAndTime(data.date, data.time),
        status: normalizeStatus(data.status),
        notes: data.notes?.trim() || null
      },
      include: {
        client: true
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
        client: true
      }
    });
  }
};

