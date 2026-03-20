export const AuthLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-white/10 bg-slate-950/70 shadow-panel backdrop-blur lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-gradient-to-br from-brand-500 via-brand-700 to-slate-950 p-10 text-slate-950 lg:flex lg:flex-col lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em]">AgendaPro AI</p>
            <h1 className="mt-6 max-w-md text-5xl font-black leading-tight">
              Organize o salao, encante clientes e prepare a base para automacao.
            </h1>
          </div>

          <div className="max-w-md rounded-3xl bg-black/20 p-6 text-slate-100">
            <p className="text-sm">
              Um sistema pensado para negocio real: atendimento do dia, clientes recorrentes e agenda pronta para crescer com SaaS.
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-10">{children}</div>
      </div>
    </div>
  );
};

