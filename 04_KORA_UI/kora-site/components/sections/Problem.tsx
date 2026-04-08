import Container from "../ui/Container";

export default function Problem() {
  return (
    <section className="bg-black py-24 text-white">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              El problema
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              La planificación de obras sigue dependiendo de Excel y procesos manuales
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              Muchas decisiones críticas todavía se construyen en hojas dispersas,
              cronogramas manuales y cálculos aislados. Eso genera retrabajo, poca
              trazabilidad y una débil conexión entre presupuesto, materiales y ejecución.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold">Información fragmentada</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Presupuesto, cronograma y compras viven en herramientas separadas.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="font-semibold">Errores manuales</h3>
                <p className="mt-2 text-sm text-slate-400">
                  Cambios en una parte del proyecto no siempre se reflejan en todo lo demás.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-950 p-8">
            <div className="grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="text-sm text-slate-400">Antes</div>
                <div className="mt-2 text-xl font-semibold">Excel + procesos sueltos</div>
              </div>
              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
                <div className="text-sm text-blue-200">Con KORA</div>
                <div className="mt-2 text-xl font-semibold">
                  Una sola estructura para planificar, costear y abastecer
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}