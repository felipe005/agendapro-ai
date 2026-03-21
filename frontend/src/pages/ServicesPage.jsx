import { useEffect, useState } from "react";
import { http } from "../api/http";
import { Panel } from "../components/Panel";
import { useAuth } from "../hooks/useAuth";
import { formatCurrency } from "../utils/formatters";

const initialForm = {
  name: "",
  price: "",
  durationMin: 60,
  description: "",
  isActive: true
};

export const ServicesPage = () => {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadServices = async () => {
    try {
      const data = await http.request("/services", { token });
      setServices(data);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        durationMin: Number(form.durationMin)
      };

      if (editingId) {
        await http.request(`/services/${editingId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(payload)
        });
        setMessage("Serviço atualizado com sucesso.");
      } else {
        await http.request("/services", {
          method: "POST",
          token,
          body: JSON.stringify(payload)
        });
        setMessage("Serviço criado com sucesso.");
      }

      resetForm();
      loadServices();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm({
      name: service.name,
      price: service.price,
      durationMin: service.durationMin,
      description: service.description || "",
      isActive: service.isActive
    });
  };

  const handleDelete = async (id) => {
    try {
      await http.request(`/services/${id}`, {
        method: "DELETE",
        token
      });
      setMessage("Serviço desativado com sucesso.");
      loadServices();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Panel
        title={editingId ? "Editar serviço" : "Novo serviço"}
        subtitle="Monte seu catálogo com valor, duração e descrição."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={form.name}
            onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Ex.: Corte feminino"
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm((current) => ({ ...current, price: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              placeholder="Valor"
              required
            />
            <input
              type="number"
              min="15"
              step="15"
              value={form.durationMin}
              onChange={(e) => setForm((current) => ({ ...current, durationMin: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
              placeholder="Duração em minutos"
              required
            />
          </div>
          <textarea
            value={form.description}
            onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Descrição do serviço"
          />

          {message && <p className="rounded-2xl bg-brand-500/10 p-4 text-sm text-brand-200">{message}</p>}
          {error && <p className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}

          <div className="flex gap-3">
            <button className="rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 hover:bg-brand-400">
              {editingId ? "Salvar alterações" : "Criar serviço"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl border border-white/10 px-4 py-3 text-slate-200 hover:text-white"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </Panel>

      <Panel title="Catálogo de serviços" subtitle="Veja o que sua empresa vende e quanto cada item rende.">
        <div className="space-y-3">
          {!services.length ? (
            <p className="text-slate-400">Nenhum serviço cadastrado ainda.</p>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-semibold text-white">{service.name}</p>
                      {!service.isActive && (
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
                          Inativo
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-300">
                      {formatCurrency(service.price)} · {service.durationMin} min
                    </p>
                    {service.description && <p className="mt-2 text-sm text-slate-400">{service.description}</p>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="rounded-2xl border border-red-500/30 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10"
                    >
                      Desativar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Panel>
    </div>
  );
};
