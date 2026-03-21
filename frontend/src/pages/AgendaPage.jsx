import { useEffect, useState } from "react";
import { http } from "../api/http";
import { Panel } from "../components/Panel";
import { useAuth } from "../hooks/useAuth";
import { formatDateTime, getTodayInput } from "../utils/formatters";

const initialForm = {
  clientId: "",
  date: getTodayInput(),
  time: "09:00",
  serviceName: "",
  status: "PENDING",
  notes: ""
};

const statusLabels = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  CANCELED: "Cancelado"
};

export const AgendaPage = () => {
  const { token } = useAuth();
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(getTodayInput());
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadClients = async () => {
    try {
      const data = await http.request("/clients", { token });
      setClients(data);
      if (!form.clientId && data.length) {
        setForm((current) => ({ ...current, clientId: data[0].id }));
      }
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

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    loadAppointments(selectedDate);
  }, [selectedDate]);

  const resetForm = () => {
    setEditingId(null);
    setForm((current) => ({
      ...initialForm,
      clientId: clients[0]?.id || "",
      date: selectedDate
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      if (editingId) {
        await http.request(`/appointments/${editingId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(form)
        });
        setMessage("Agendamento atualizado com sucesso.");
      } else {
        await http.request("/appointments", {
          method: "POST",
          token,
          body: JSON.stringify(form)
        });
        setMessage("Agendamento criado com sucesso.");
      }

      resetForm();
      loadAppointments(selectedDate);
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (appointment) => {
    const date = new Date(appointment.scheduledAt);

    setEditingId(appointment.id);
    setForm({
      clientId: appointment.clientId,
      date: date.toISOString().split("T")[0],
      time: date.toISOString().slice(11, 16),
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
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Panel
        title={editingId ? "Editar agendamento" : "Novo agendamento"}
        subtitle="Organize horários, serviços e acompanhe o status de cada atendimento."
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
              onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              required
            />
            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm((current) => ({ ...current, time: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              required
            />
          </div>

          <input
            value={form.serviceName}
            onChange={(e) => setForm((current) => ({ ...current, serviceName: e.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Serviço"
            required
          />

          <select
            value={form.status}
            onChange={(e) => setForm((current) => ({ ...current, status: e.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
          >
            <option value="PENDING">Pendente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="CANCELED">Cancelado</option>
          </select>

          <textarea
            value={form.notes}
            onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Observações opcionais"
          />

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
                    {appointment.notes && <p className="mt-2 text-sm text-slate-400">{appointment.notes}</p>}
                  </div>

                  <div className="flex gap-2">
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
