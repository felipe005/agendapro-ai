import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { http } from "../api/http";
import { AuthLayout } from "../layouts/AuthLayout";
import { useAuth } from "../hooks/useAuth";

const initialForm = {
  email: "",
  password: ""
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const session = await http.request(endpoint, {
        method: "POST",
        body: JSON.stringify(form)
      });

      saveSession(session);
      navigate("/");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="mx-auto max-w-md">
        <p className="text-sm uppercase tracking-[0.3em] text-brand-300">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </p>
        <h2 className="mt-3 text-4xl font-bold text-white">
          Controle sua agenda e prepare seu negocio para vender mais.
        </h2>
        <p className="mt-4 text-slate-400">
          Entre com seu email ou crie sua conta para comecar.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Senha</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white"
              placeholder="Minimo 6 caracteres"
              required
            />
          </div>

          {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand-500 px-4 py-3 font-semibold text-slate-950 hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Processando..." : mode === "login" ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode((current) => (current === "login" ? "register" : "login"))}
          className="mt-5 text-sm text-slate-300 hover:text-white"
        >
          {mode === "login"
            ? "Ainda nao tem conta? Clique para criar."
            : "Ja tem conta? Clique para entrar."}
        </button>
      </div>
    </AuthLayout>
  );
};

