import { useEffect, useState } from "react";
import { http } from "../api/http";
import { Panel } from "../components/Panel";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency } from "../utils/formatters";

export const InsightsPage = () => {
  const { token } = useAuth();
  const [data, setData] = useState({
    suggestions: [],
    summary: {
      appointments: 0,
      uniqueClients: 0,
      revenue: 0,
      confirmedAppointments: 0
    }
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const result = await http.request("/insights", { token });
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
        <StatCard title="Agendamentos" value={data.summary.appointments} hint="Histórico usado para gerar as recomendações." />
        <StatCard title="Clientes únicos" value={data.summary.uniqueClients} hint="Pessoas diferentes atendidas no sistema." />
        <StatCard title="Receita analisada" value={formatCurrency(data.summary.revenue)} hint="Volume financeiro usado como base." />
        <StatCard title="Confirmados" value={data.summary.confirmedAppointments} hint="Atendimentos confirmados até agora." />
      </section>

      <Panel title="Sugestões para crescer" subtitle="Leituras automáticas do seu desempenho para apoiar decisões do dono da empresa.">
        {error && <p className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}
        <div className="grid gap-4 md:grid-cols-2">
          {data.suggestions.map((suggestion) => (
            <article key={suggestion.title} className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">{suggestion.title}</h3>
                <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-brand-200">
                  Impacto {suggestion.impact}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{suggestion.description}</p>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
};
