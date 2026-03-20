export const StatCard = ({ title, value, hint }) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-panel">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-4 text-4xl font-bold text-white">{value}</p>
      <p className="mt-3 text-sm text-slate-300">{hint}</p>
    </div>
  );
};

