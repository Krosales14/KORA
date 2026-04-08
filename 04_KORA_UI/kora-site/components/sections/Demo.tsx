import Container from "../ui/Container";

export default function Demo() {
  return (
    <section className="bg-slate-950 py-24 text-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Demostración del producto
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              Visualiza cronograma, materiales y desempeño financiero en una sola experiencia
            </h2>
            <p className="mt-6 text-lg leading-8 text-slate-300">
              KORA presenta una visión más conectada del proyecto, permitiendo entender
              cómo se relacionan tiempos, costos, materiales y abastecimiento.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-blue-950/30">
            <video autoPlay loop muted playsInline className="rounded-2xl object-cover">
              <source src="/videos/dashboard.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </Container>
    </section>
  );
}