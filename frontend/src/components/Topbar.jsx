import { useAuth } from "../hooks/useAuth";

export const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-panel backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-brand-300">Painel operacional</p>
        <h2 className="text-2xl font-semibold text-white">
          {user?.companyName ? user.companyName : `Bem-vindo, ${user?.email}`}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {user?.ownerName ? `Gestão de ${user.ownerName}` : user?.email}
        </p>
      </div>

      <button
        onClick={logout}
        className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 hover:border-brand-400 hover:text-white"
      >
        Sair
      </button>
    </header>
  );
};
