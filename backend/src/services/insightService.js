import { AppointmentStatus } from "@prisma/client";
import { prisma } from "../prisma/client.js";

export const insightService = {
  async getSuggestions(userId) {
    const [appointments, services, businessHours] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          userId,
          status: {
            not: AppointmentStatus.CANCELED
          }
        },
        include: {
          client: true
        }
      }),
      prisma.service.findMany({
        where: { userId, isActive: true }
      }),
      prisma.businessHour.findMany({
        where: { userId, isOpen: true }
      })
    ]);

    const suggestions = [];
    const revenue = appointments.reduce((sum, item) => sum + Number(item.price || 0), 0);
    const uniqueClients = new Set(appointments.map((item) => item.clientId)).size;
    const confirmedAppointments = appointments.filter((item) => item.status === AppointmentStatus.CONFIRMED).length;

    if (!services.length) {
      suggestions.push({
        title: "Cadastre seus servicos",
        description: "Monte um catalogo com preco e duracao para agilizar o agendamento e medir melhor o faturamento.",
        impact: "alto"
      });
    }

    if (!businessHours.length) {
      suggestions.push({
        title: "Defina horarios de funcionamento",
        description: "Configure os dias e horarios da empresa para evitar agendamentos fora da rotina do negocio.",
        impact: "alto"
      });
    }

    if (appointments.length < 5) {
      suggestions.push({
        title: "Aumente a base de clientes",
        description: "Seu historico ainda esta pequeno. Foque em captar mais clientes e acompanhar retornos para gerar previsibilidade.",
        impact: "medio"
      });
    }

    if (appointments.length >= 5 && confirmedAppointments / appointments.length < 0.5) {
      suggestions.push({
        title: "Melhore a confirmacao dos atendimentos",
        description: "Muitos agendamentos ainda nao estao confirmados. Vale usar lembretes por WhatsApp e confirmacao no dia anterior.",
        impact: "alto"
      });
    }

    if (revenue > 0 && uniqueClients > 0) {
      suggestions.push({
        title: "Invista nos clientes que ja compram",
        description: `Seu negocio ja gerou R$ ${revenue.toFixed(2)} com ${uniqueClients} clientes. Crie ofertas de retorno para elevar o ticket medio.`,
        impact: "medio"
      });
    }

    if (!suggestions.length) {
      suggestions.push({
        title: "Sua operacao esta bem configurada",
        description: "Continue acompanhando caixa, servicos mais vendidos e taxa de confirmacao para crescer com consistencia.",
        impact: "baixo"
      });
    }

    return {
      suggestions,
      summary: {
        appointments: appointments.length,
        uniqueClients,
        revenue,
        confirmedAppointments
      }
    };
  }
};
