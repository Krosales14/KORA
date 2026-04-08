import Container from "../ui/Container";

export default function AffordableConstruction() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Construcción asequible
            </p>

            <h2 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
              Hacemos posible construir más y mejor mediante un sistema más justo,
              eficiente y accesible
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              En KORA entendemos la asequibilidad no como una presión artificial
              sobre el precio, sino como el resultado natural de una operación mejor
              diseñada. Reducir costo sin rediseñar el sistema debilita márgenes y
              sostenibilidad. Rediseñar el sistema genera eficiencia real.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold">Lo superficial</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Bajar precios sin transformar el proceso erosiona márgenes,
                  aumenta presión comercial y genera competencia destructiva.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5">
                <h3 className="text-lg font-semibold">Lo estructural</h3>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  Diseñar mejor reduce desperdicio, incertidumbre, fricción e
                  intermediación innecesaria.
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-semibold">
                  En KORA la asequibilidad surge porque
                </h3>

                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-300">
                  <li>• Hay mejor información.</li>
                  <li>• Hay menor fricción.</li>
                  <li>• Hay planificación predictiva.</li>
                  <li>• Hay trazabilidad.</li>
                  <li>• Hay eficiencia logística.</li>
                </ul>
              </div>

              <p className="max-w-2xl text-base leading-7 text-slate-400">
                No competimos bajando el precio artificialmente. Competimos bajando
                el costo sistémico. Y cuando el costo sistémico baja, proveedores,
                constructores y proyectos se fortalecen al mismo tiempo.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-blue-950/30">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
              <img
                src="/images/affordable-construction.jpg"
                alt="Construcción asequible con tecnología y eficiencia"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}