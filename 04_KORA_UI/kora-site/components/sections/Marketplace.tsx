import Container from "../ui/Container";

export default function Marketplace() {
  return (
    <section id="marketplace" className="bg-black py-24 text-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="order-2 lg:order-1 rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-blue-950/30">
            <img
              src="/images/logistics.jpg"
              alt="Logística y abastecimiento de materiales"
              className="rounded-2xl object-cover"
            />
          </div>

          <div className="order-1 lg:order-2">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Marketplace y abastecimiento
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              De la planificación a la compra de materiales
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              KORA no solo estructura requerimientos. También prepara el camino para
              conectar materiales, proveedores, logística y abastecimiento dentro del
              mismo ecosistema.
            </p>

            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                Requerimientos de materiales más claros
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                Mejor coordinación entre planeación y compra
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                Base para trazabilidad y entregas más eficientes
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}