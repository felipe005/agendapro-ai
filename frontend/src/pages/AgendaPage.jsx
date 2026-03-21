import { useEffect, useState } from "react";
import { http } from "../api/http";
import { Panel } from "../components/Panel";
import { useAuth } from "../hooks/useAuth";
import {
  formatCurrency,
  formatDateTime,
  getTodayInput,
  toDateInputValue,
  toTimeInputValue
} from "../utils/formatters";

const initialForm = {
  clientId: "",
  date: getTodayInput(),
  time: "09:00",
  serviceId: "",
  serviceName: "",
  status: "PENDING",
  notes: ""
};

const statusLabels = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  COMPLETED: "Atendida",
  CANCELED: "Cancelado"
};

export const AgendaPage = () => {
  const { token } = useAuth();
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [businessHour, setBusinessHour] = useState(null);
  const [selectedDate, setSelectedDate] = useState(getTodayInput());
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const selectedService = services.find((service) => service.id === form.serviceId);

  const loadBase = async () => {
    try {
      const [clientsData, servicesData] = await Promise.all([
        http.request("/clients", { token }),
        http.request("/services", { token })
      ]);

      setClients(clientsData);
      setServices(servicesData.filter((service) => service.isActive));

      setForm((current) => ({
        ...current,
        clientId: current.clientId || clientsData[0]?.id || "",
        serviceId: current.serviceId || servicesData.find((service) => service.isActive)?.id || ""
      }));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const loadAppointments = async (date) => {
    try {
      const data = await http.request(`/appointments?date=${date}`, { token });
      setAppointments(data);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const loadAvailability = async (date) => {
    try {
      const data = await http.request(`/company/availability?date=${date}`, { token });
      setAvailableSlots(data.slots || []);
      setBusinessHour(data.businessHour);

      setForm((current) => {
        const nextTime = editingId
          ? current.time
          : data.slots?.includes(current.time)
            ? current.time
            : data.slots?.[0] || "";

        return {
          ...current,
          time: nextTime
        };
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadBase();
  }, []);

  useEffect(() => {
    loadAppointments(selectedDate);
    loadAvailability(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (selectedService) {
      setForm((current) => ({
        ...current,
        serviceName: selectedService.name
      }));
    }
  }, [form.serviceId, selectedService]);

  const resetForm = () => {
    setEditingId(null);
    setForm({
      ...initialForm,
      clientId: clients[0]?.id || "",
      serviceId: services[0]?.id || "",
      serviceName: services[0]?.name || "",
      date: selectedDate,
      time: availableSlots[0] || ""
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        price: selectedService?.price ?? undefined
      };

      if (editingId) {
        await http.request(`/appointments/${editingId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(payload)
        });
        setMessage("Agendamento atualizado com sucesso.");
      } else {
        await http.request("/appointments", {
          method: "POST",
          token,
          body: JSON.stringify(payload)
        });
        setMessage("Agendamento criado com sucesso.");
      }

      resetForm();
      loadAppointments(selectedDate);
      loadAvailability(selectedDate);
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);
    setForm({
      clientId: appointment.clientId,
      date: toDateInputValue(appointment.scheduledAt),
      time: toTimeInputValue(appointment.scheduledAt),
      serviceId: appointment.serviceId || "",
      serviceName: appointment.serviceName,
      status: appointment.status,
      notes: appointment.notes || ""
    });
  };

  const handleCancel = async (id) => {
    try {
      await http.request(`/appointments/${id}/cancel`, {
        method: "PATCH",
        token
      });
      setMessage("Agendamento cancelado.");
      loadAppointments(selectedDate);
      loadAvailability(selectedDate);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      await http.request(`/appointments/${id}/complete`, {
        method: "PATCH",
        token
      });
      setMessage("Atendimento marcado como concluído.");
      loadAppointments(selectedDate);
      loadAvailability(selectedDate);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[440px_1fr]">
      <Panel
        title={editingId ? "Editar agendamento" : "Novo agendamento"}
        subtitle="Escolha o serviço, respeite o horário da empresa e acompanhe cada atendimento."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={form.clientId}
            onChange={(e) => setForm((current) => ({ ...current, clientId: e.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            required
          >
            <option value="">Selecione um cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="date"
              value={form.date}
              onChange={(e) => {
                const date = e.target.value;
                setSelectedDate(date);
                setForm((current) => ({ ...current, date }));
              }}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              required
            />

            <select
              value={form.time}
              onChange={(e) => setForm((current) => ({ ...current, time: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              required
              disabled={!availableSlots.length && !editingId}
            >
              <option value="">{businessHour?.isOpen ? "Selecione um horário" : "Empresa fechada"}</option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <select
            value={form.serviceId}
            onChange={(e) => {
              const service = services.find((item) => item.id === e.target.value);
              setForm((current) => ({
                ...current,
                serviceId: e.target.value,
                serviceName: service?.name || ""
              }));
            }}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            required
          >
            <option value="">Selecione um serviço</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} · {formatCurrency(service.price)} · {service.durationMin} min
              </option>
            ))}
          </select>

          <select
            value={form.status}
            onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="COMPLETED">Atendida</option>
            <option value="CANCELED">Cancelado</option>
          </select>

          <textarea
            value={form.notes}
            onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Observações opcionais"
          />

          {selectedService && (
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-sm text-slate-300">
              <p className="font-semibold text-white">{selectedService.name}</p>
              <p className="mt-1">Valor: {formatCurrency(selectedService.price)}</p>
              <p>Duração: {selectedService.durationMin} min</p>
              {selectedService.description && <p className="mt-1 text-slate-400">{selectedService.description}</p>}
            </div>
          )}

          {businessHour && (
            <p className="text-sm text-slate-400">
              Horário disponível no dia:{" "}
              {businessHour.isOpen ? `${businessHour.startTime} às ${businessHour.endTime}` : "empresa fechada"}
            </p>
          )}

          {message && <p className="rounded-2xl bg-brand-500/10 p-4 text-sm text-brand-200">{message}</p>}
          {error && <p className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}

          <div className="flex gap-3">
            <button className="rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 hover:bg-brand-400">
              {editingId ? "Salvar alterações" : "Criar agendamento"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200 hover:text-white"
              >
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </Panel>

      <Panel
        title="Agenda do dia"
        subtitle="Veja os horários da data escolhida e gerencie rapidamente."
        action={
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setForm((current) => ({ ...current, date: e.target.value }));
            }}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          />
        }
      >
        {!appointments.length ? (
          <p className="text-slate-400">Nenhum agendamento nesta data.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold text-white">{appointment.client.name}</p>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                        {statusLabels[appointment.status]}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">{appointment.serviceName}</p>
                    <p className="text-sm text-slate-400">{formatDateTime(appointment.scheduledAt)}</p>
                    <p className="text-sm text-brand-200">{formatCurrency(appointment.price)}</p>
                    {appointment.notes && <p className="mt-2 text-sm text-slate-400">{appointment.notes}</p>}
                  </div>

                  <div className="flex gap-2">
                    {appointment.status !== "COMPLETED" && appointment.status !== "CANCELED" && (
                      <button
                        onClick={() => handleComplete(appointment.id)}
                        className="rounded-2xl border border-brand-500/30 px-4 py-2 text-sm text-brand-200 hover:bg-brand-500/10"
                      >
                        Atendida
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(appointment)}
                      className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="rounded-2xl border border-red-500/30 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
};
