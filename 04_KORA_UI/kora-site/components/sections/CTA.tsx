import Container from "../ui/Container";
import Button from "../ui/Button";

export default function CTA() {
  return (
    <section id="cta" className="bg-slate-950 py-24 text-white">
      <Container>
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-950 p-10 text-center shadow-2xl shadow-blue-950/30 md:p-16">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Solicitar demo
          </p>
          <h2 className="mx-auto max-w-3xl text-3xl font-bold md:text-5xl">
            Convierte parámetros iniciales en una obra completamente planificada
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            KORA está diseñado para proyectos de vivienda, desarrollos y obras que
            necesitan mayor velocidad, claridad y control desde el inicio.
          </p>

          <div className="mt-8 flex justify-center">
            <Button href="#">Solicitar demo</Button>
          </div>
        </div>
      </Container>
    </section>
  );
}