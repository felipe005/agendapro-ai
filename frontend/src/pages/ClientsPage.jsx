import { useEffect, useState } from "react";
import { http } from "../api/http";
import { Panel } from "../components/Panel";
import { useAuth } from "../hooks/useAuth";

const initialForm = {
  name: "",
  phone: "",
  notes: ""
};

export const ClientsPage = () => {
  const { token } = useAuth();
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadClients = async () => {
    try {
      const data = await http.request("/clients", { token });
      setClients(data);
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await http.request(`/clients/${editingId}`, {
          method: "PUT",
          token,
          body: JSON.stringify(form)
        });
        setMessage("Cliente atualizado com sucesso.");
      } else {
        await http.request("/clients", {
          method: "POST",
          token,
          body: JSON.stringify(form)
        });
        setMessage("Cliente criado com sucesso.");
      }

      resetForm();
      loadClients();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setForm({
      name: client.name,
      phone: client.phone,
      notes: client.notes || ""
    });
  };

  const handleDelete = async (id) => {
    try {
      await http.request(`/clients/${id}`, {
        method: "DELETE",
        token
      });
      setMessage("Cliente removido com sucesso.");
      loadClients();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <Panel
        title={editingId ? "Editar cliente" : "Novo cliente"}
        subtitle="Cadastre clientes para organizar retorno, observacoes e contatos."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={form.name}
            onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Nome do cliente"
            required
          />
          <input
            value={form.phone}
            onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))}
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Telefone / WhatsApp"
            required
          />
          <textarea
            value={form.notes}
            onChange={(e) => setForm((current) => ({ ...current, notes: e.target.value }))}
            className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white"
            placeholder="Observacoes importantes"
          />

          {message && <p className="rounded-2xl bg-brand-500/10 p-4 text-sm text-brand-200">{message}</p>}
          {error && <p className="rounded-2xl bg-red-500/10 p-4 text-sm text-red-200">{error}</p>}

          <div className="flex gap-3">
            <button className="rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 hover:bg-brand-400">
              {editingId ? "Salvar alteracoes" : "Criar cliente"}
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

      <Panel title="Base de clientes" subtitle="Clientes cadastrados no seu negocio.">
        <div className="space-y-3">
          {!clients.length ? (
            <p className="text-slate-400">Nenhum cliente cadastrado ainda.</p>
          ) : (
            clients.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl border border-white/10 bg-slate-950/70 p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white">{client.name}</p>
                    <p className="text-sm text-slate-300">{client.phone}</p>
                    {client.notes && <p className="mt-2 text-sm text-slate-400">{client.notes}</p>}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(client)}
                      className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-slate-200 hover:text-white"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="rounded-2xl border border-red-500/30 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10"
                    >
                      Deletar
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
