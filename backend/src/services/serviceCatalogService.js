import { prisma } from "../prisma/client.js";
import { ApiError } from "../utils/ApiError.js";

const serialize = (service) => ({
  ...service,
  price: Number(service.price)
});

const normalizePayload = (data) => {
  const name = data.name?.trim();
  const price = Number(data.price);
  const durationMin = Number(data.durationMin || 60);

  if (!name) {
    throw new ApiError(400, "Nome do servico e obrigatorio.");
  }

  if (!Number.isFinite(price) || price < 0) {
    throw new ApiError(400, "Preco invalido.");
  }

  if (!Number.isInteger(durationMin) || durationMin <= 0) {
    throw new ApiError(400, "Duracao invalida.");
  }

  return {
    name,
    price,
    durationMin,
    description: data.description?.trim() || null,
    isActive: data.isActive ?? true
  };
};

export const serviceCatalogService = {
  async list(userId) {
    const services = await prisma.service.findMany({
      where: { userId },
      orderBy: [{ isActive: "desc" }, { name: "asc" }]
    });

    return services.map(serialize);
  },

  async create(userId, data) {
    const payload = normalizePayload(data);
    const service = await prisma.service.create({
      data: {
        userId,
        ...payload
      }
    });

    return serialize(service);
  },

  async update(userId, serviceId, data) {
    const existing = await prisma.service.findFirst({
      where: { id: serviceId, userId }
    });

    if (!existing) {
      throw new ApiError(404, "Servico nao encontrado.");
    }

    const payload = normalizePayload(data);
    const service = await prisma.service.update({
      where: { id: serviceId },
      data: payload
    });

    return serialize(service);
  },

  async remove(userId, serviceId) {
    const existing = await prisma.service.findFirst({
      where: { id: serviceId, userId }
    });

    if (!existing) {
      throw new ApiError(404, "Servico nao encontrado.");
    }

    await prisma.service.update({
      where: { id: serviceId },
      data: { isActive: false }
    });

    return { success: true };
  }
};
