import { useEffect, useState } from "react";
import { http } from "../api/http";
import { Panel } from "../components/Panel";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency, formatDateTime } from "../utils/formatters";

export const DashboardPage = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState({
    todayAppointments: 0,
    upcomingAppointments: [],
    activeClients: 0,
    monthlyRevenue: 0
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await http.request("/dashboard/summary", { token });
        setSummary(data);
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    fetchSummary();
  }, [token]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2">
        <StatCard
          title="Atendimentos do dia"
          value={summary.todayAppointments}
          hint="Sua operação diária em um olhar rápido."
        />
        <StatCard
          title="Próximos agendamentos"
          value={summary.upcomingAppointments.length}
          hint="Os 5 próximos horários ativos aparecem abaixo."
        />
        <StatCard
          title="Clientes ativos"
          value={summary.activeClients}
          hint="Quantidade total de clientes cadastrados na base."
        />
        <StatCard
          title="Faturamento do mês"
          value={formatCurrency(summary.monthlyRevenue)}
          hint="Total previsto a partir dos agendamentos não cancelados."
        />
      </section>

      <Panel
        title="Próximos atendimentos"
        subtitle="Acompanhe o que vem a seguir para manter a agenda fluindo."
      >
        {error && <p className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}

        {!summary.upcomingAppointments.length ? (
          <p className="text-slate-400">Nenhum agendamento futuro por enquanto.</p>
        ) : (
          <div className="space-y-3">
            {summary.upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{appointment.client.name}</p>
                    <p className="text-sm text-slate-400">{appointment.serviceName}</p>
                  </div>
                  <div className="text-sm text-slate-300">{formatDateTime(appointment.scheduledAt)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
};
