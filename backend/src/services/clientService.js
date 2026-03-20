import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/ApiError.js";

const validateClientPayload = ({ name, phone }) => {
  if (!name?.trim()) {
    throw new ApiError(400, "O nome do cliente e obrigatorio.");
  }

  if (!phone?.trim()) {
    throw new ApiError(400, "O telefone do cliente e obrigatorio.");
  }
};

export const clientService = {
  async create(userId, data) {
    validateClientPayload(data);

    return prisma.client.create({
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
        notes: data.notes?.trim() || null,
        userId
      }
    });
  },

  async list(userId) {
    return prisma.client.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  },

  async update(userId, clientId, data) {
    validateClientPayload(data);

    const client = await prisma.client.findFirst({
      where: { id: clientId, userId }
    });

    if (!client) {
      throw new ApiError(404, "Cliente nao encontrado.");
    }

    return prisma.client.update({
      where: { id: clientId },
      data: {
        name: data.name.trim(),
        phone: data.phone.trim(),
        notes: data.notes?.trim() || null
      }
    });
  },

  async remove(userId, clientId) {
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId }
    });

    if (!client) {
      throw new ApiError(404, "Cliente nao encontrado.");
    }

    await prisma.client.delete({
      where: { id: clientId }
    });

    return { message: "Cliente removido com sucesso." };
  }
};

