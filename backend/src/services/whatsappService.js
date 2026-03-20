import { env } from "../config/env.js";

export const whatsappService = {
  async sendMessage(phone, message) {
    if (env.whatsappProvider === "disabled") {
      return {
        success: false,
        provider: "disabled",
        phone,
        message,
        note: "Integracao WhatsApp ainda nao configurada."
      };
    }

    return {
      success: false,
      provider: env.whatsappProvider,
      phone,
      message,
      note: "Estrutura pronta para integrar com Z-API, Twilio ou outro provedor."
    };
  }
};

