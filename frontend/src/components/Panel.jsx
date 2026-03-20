export const Panel = ({ title, subtitle, action, children }) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-panel">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
};

