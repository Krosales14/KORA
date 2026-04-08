import Container from "../ui/Container";

export default function HowItWorks() {
  const steps = [
    "Definís los parámetros del proyecto.",
    "KORA genera la estructura constructiva.",
    "Se calculan actividades, recursos y materiales.",
    "Obtienes presupuesto, cronograma y flujo de caja.",
  ];

  return (
    <section id="como-funciona" className="bg-slate-950 py-24 text-white">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Cómo funciona
            </p>
            <h2 className="text-3xl font-bold md:text-4xl">
              De una idea inicial a una obra completamente estructurada
            </h2>

            <div className="mt-8 space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold">
                    {index + 1}
                  </div>
                  <p className="pt-2 text-slate-300">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-blue-950/30">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="rounded-2xl object-cover"
            >
              <source src="/videos/how-it-works.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </Container>
    </section>
  );
}