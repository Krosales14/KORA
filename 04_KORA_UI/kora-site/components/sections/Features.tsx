"use client";
import Container from "../ui/Container";
import { motion } from "framer-motion";

const features = [
  {
    title: "Presupuesto automático",
    text: "Genera costos y estructura de obra a partir de parámetros iniciales.",
  },
  {
    title: "Cronograma de obra",
    text: "Organiza fases, etapas y actividades con una lógica consistente.",
  },
  {
    title: "Flujo de caja",
    text: "Visualiza la proyección financiera del proyecto desde el inicio.",
  },
  {
    title: "Lista de materiales",
    text: "Obtén requerimientos claros para compras y abastecimiento.",
  },
  {
    title: "Estructura WBS",
    text: "Construye una base técnica sólida para seguimiento y control.",
  },
  {
    title: "Abastecimiento",
    text: "Conecta planificación y adquisición de materiales en un mismo flujo.",
  },
];

export default function Features() {
  return (
    <section id="producto" className="bg-black py-24 text-white">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Qué genera KORA
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            Todo lo necesario para planificar proyectos constructivos
          </h2>
          <p className="mt-5 text-lg text-slate-300">
            Desde viviendas hasta desarrollos más complejos, KORA estructura la
            información crítica para tomar decisiones con mayor velocidad y claridad.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-7 transition duration-300 hover:border-blue-500/30 hover:bg-white/[0.07]"
            >
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 leading-7 text-slate-400">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}