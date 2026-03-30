import { useEffect, useState } from "react";
import { http } from "../api/http";
import { Panel } from "../components/Panel";
import { useAuth } from "../hooks/useAuth";
import { weekdayLabels } from "../utils/formatters";

const emptyProfile = {
  ownerName: "",
  companyName: "",
  businessType: "",
  businessPhone: "",
  autoSendAppointmentMessage: false,
  appointmentMessageTemplate: "",
  timezone: "America/Sao_Paulo"
};

export const CompanyPage = () => {
  const { token, user, saveSession } = useAuth();
  const [profile, setProfile] = useState(emptyProfile);
  const [hours, setHours] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const data = await http.request("/company", { token });
      setProfile({
        ownerName: data.profile.ownerName || "",
        companyName: data.profile.companyName || "",
        businessType: data.profile.businessType || "",
        businessPhone: data.profile.businessPhone || "",
        autoSendAppointmentMessage: Boolean(data.profile.autoSendAppointmentMessage),
        appointmentMessageTemplate: data.profile.appointmentMessageTemplate || "",
        timezone: data.profile.timezone || "America/Sao_Paulo"
      });
      setHours(data.businessHours);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = await http.request("/company", {
        method: "PUT",
        token,
        body: JSON.stringify(profile)
      });
      saveSession({ token, user: { ...user, ...data.profile } });
      setMessage("Dados da empresa atualizados com sucesso.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const handleHoursSave = async () => {
    setMessage("");
    setError("");

    try {
      const data = await http.request("/company/hours", {
        method: "PUT",
        token,
        body: JSON.stringify({ hours })
      });
      setHours(data.businessHours);
      setMessage("Horários de funcionamento atualizados.");
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="space-y-6">
      <Panel title="Perfil da empresa" subtitle="Defina os dados principais que vão guiar o restante da operação.">
        <form onSubmit={handleProfileSave} className="grid gap-4 md:grid-cols-2">
          <input
            value={profile.ownerName}
            onChange={(e) => setProfile((current) => ({ ...current, ownerName: e.target.value }))}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Nome do responsável"
          />
          <input
            value={profile.companyName}
            onChange={(e) => setProfile((current) => ({ ...current, companyName: e.target.value }))}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Nome da empresa"
          />
          <input
            value={profile.businessType}
            onChange={(e) => setProfile((current) => ({ ...current, businessType: e.target.value }))}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Tipo de negócio"
          />
          <input
            value={profile.businessPhone}
            onChange={(e) => setProfile((current) => ({ ...current, businessPhone: e.target.value }))}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Telefone / WhatsApp"
          />

          <div className="md:col-span-2 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-base font-semibold text-white">Mensagem automatica de confirmacao</p>
                <p className="mt-1 text-sm text-slate-400">
                  Quando ativada, o sistema monta essa mensagem assim que um novo agendamento e criado.
                </p>
              </div>

              <label className="flex items-center gap-3 text-sm text-slate-200">
                <input
                  type="checkbox"
                  checked={profile.autoSendAppointmentMessage}
                  onChange={(e) =>
                    setProfile((current) => ({
                      ...current,
                      autoSendAppointmentMessage: e.target.checked
                    }))
                  }
                />
                Ativar envio automatico
              </label>
            </div>

            <textarea
              value={profile.appointmentMessageTemplate}
              onChange={(e) =>
                setProfile((current) => ({
                  ...current,
                  appointmentMessageTemplate: e.target.value
                }))
              }
              className="mt-4 min-h-32 w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Ex.: Ola, {cliente}. Seu horario para {servico} ficou marcado em {data} as {hora}."
            />

            <p className="mt-3 text-xs leading-6 text-slate-400">
              Variaveis disponiveis: {"{cliente}"}, {"{empresa}"}, {"{servico}"}, {"{data}"}, {"{hora}"},{" "}
              {"{status}"}, {"{telefoneEmpresa}"} e {"{observacoes}"}.
            </p>
          </div>

          <div className="md:col-span-2 flex gap-3">
            <button className="rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 hover:bg-brand-400">
              Salvar perfil
            </button>
            {message && <p className="self-center text-sm text-brand-200">{message}</p>}
            {error && <p className="self-center text-sm text-red-200">{error}</p>}
          </div>
        </form>
      </Panel>

      <Panel title="Horários de funcionamento" subtitle="Liberte apenas os horários em que a empresa realmente atende.">
        {!hours.length && (
          <p className="mb-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-100">
            Os 7 dias ainda nao foram carregados. Atualize a pagina ou salve novamente o perfil da empresa.
          </p>
        )}

        <div className="space-y-3">
          {hours.map((item, index) => (
            <div
              key={item.weekday}
              className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-4 md:grid-cols-[180px_120px_1fr_1fr]"
            >
              <div className="font-medium text-white">{weekdayLabels[item.weekday]}</div>
              <label className="flex items-center gap-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={item.isOpen}
                  onChange={(e) =>
                    setHours((current) =>
                      current.map((hour, hourIndex) =>
                        hourIndex === index ? { ...hour, isOpen: e.target.checked } : hour
                      )
                    )
                  }
                />
                Aberto
              </label>
              <input
                type="time"
                value={item.startTime}
                disabled={!item.isOpen}
                onChange={(e) =>
                  setHours((current) =>
                    current.map((hour, hourIndex) =>
                      hourIndex === index ? { ...hour, startTime: e.target.value } : hour
                    )
                  )
                }
                className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              />
              <input
                type="time"
                value={item.endTime}
                disabled={!item.isOpen}
                onChange={(e) =>
                  setHours((current) =>
                    current.map((hour, hourIndex) =>
                      hourIndex === index ? { ...hour, endTime: e.target.value } : hour
                    )
                  )
                }
                className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              />
            </div>
          ))}
        </div>

        <div className="mt-5">
          <button
            onClick={handleHoursSave}
            className="rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 hover:bg-brand-400"
          >
            Salvar horários
          </button>
        </div>
      </Panel>
    </div>
  );
};
