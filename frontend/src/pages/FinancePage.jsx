import { useEffect, useState } from "react";
import { http } from "../api/http";
import { Panel } from "../components/Panel";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency, formatDateTime } from "../utils/formatters";

export const FinancePage = () => {
  const { token } = useAuth();
  const [data, setData] = useState({
    totals: {
      totalRevenue: 0,
      monthlyRevenue: 0,
      totalClients: 0,
      totalServices: 0,
      completedAppointments: 0
    },
    recentAppointments: [],
    topServices: []
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await http.request("/finance/overview", { token });
        setData(result);
      } catch (requestError) {
        setError(requestError.message);
      }
    };

    load();
  }, [token]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Faturamento total" value={formatCurrency(data.totals.totalRevenue)} hint="Receita acumulada da operação." />
        <StatCard title="Faturamento do mês" value={formatCurrency(data.totals.monthlyRevenue)} hint="Total previsto no mês atual." />
        <StatCard title="Clientes cadastrados" value={data.totals.totalClients} hint="Base ativa de relacionamento." />
        <StatCard title="Serviços ativos" value={data.totals.totalServices} hint="Itens disponíveis no catálogo." />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Movimentações recentes" subtitle="Acompanhe os atendimentos mais recentes com valor e horário.">
          {error && <p className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
          {!data.recentAppointments.length ? (
            <p className="text-slate-400">Ainda não há movimentações financeiras.</p>
          ) : (
            <div className="space-y-3">
              {data.recentAppointments.map((appointment) => (
                <div key={appointment.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-white">{appointment.client.name}</p>
                      <p className="text-sm text-slate-400">{appointment.serviceName}</p>
                      <p className="text-sm text-slate-500">{formatDateTime(appointment.scheduledAt)}</p>
                    </div>
                    <p className="text-lg font-semibold text-brand-200">{formatCurrency(appointment.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel title="Serviços que mais faturam" subtitle="Use esta lista para decidir promoções, combos e foco comercial.">
          {!data.topServices.length ? (
            <p className="text-slate-400">Cadastre serviços e gere vendas para ver este ranking.</p>
          ) : (
            <div className="space-y-3">
              {data.topServices.map((service) => (
                <div key={service.id} className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
                  <p className="font-semibold text-white">{service.name}</p>
                  <p className="text-sm text-slate-400">{service.count} atendimentos</p>
                  <p className="mt-2 text-brand-200">{formatCurrency(service.revenue)}</p>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
};
