import { NavLink } from "react-router-dom";

const linkClass = ({ isActive }) =>
  `rounded-2xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

export const Sidebar = () => {
  return (
    <aside className="w-full rounded-3xl border border-white/10 bg-slate-900/70 p-4 shadow-panel backdrop-blur xl:w-72">
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-brand-400 to-brand-700 p-5 text-slate-950">
        <p className="text-sm font-semibold uppercase tracking-[0.3em]">AgendaPro AI</p>
        <h1 className="mt-3 text-2xl font-bold">Seu salao mais organizado e pronto para crescer.</h1>
      </div>

      <nav className="flex flex-col gap-2">
        <NavLink className={linkClass} to="/">
          Dashboard
        </NavLink>
        <NavLink className={linkClass} to="/clientes">
          Clientes
        </NavLink>
        <NavLink className={linkClass} to="/agenda">
          Agenda
        </NavLink>
      </nav>
    </aside>
  );
};

