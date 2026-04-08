"use client";

import { motion } from "framer-motion";
import Container from "../ui/Container";
import Button from "../ui/Button";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black text-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        poster="/images/hero-fallback.jpg"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.25),transparent_35%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/70 to-black" />

      <Container className="relative z-10 flex min-h-screen items-center pt-36 md:pt-40">
        <div className="grid w-full items-center gap-14 lg:grid-cols-2">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6 inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1 text-sm text-blue-200"
            >
              Planificación inteligente para construcción y vivienda
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="max-w-3xl text-4xl font-bold leading-tight md:text-6xl"
            >
              Planifica, presupuesta y abastece tu obra en minutos
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg leading-8 text-slate-300"
            >
              KORA transforma parámetros iniciales del proyecto en presupuesto,
              cronograma, flujo de caja, estructura WBS, materiales y planificación
              de abastecimiento.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button href="#cta">Solicitar demo gratis</Button>
              <Button href="#como-funciona" variant="secondary">
                Ver cómo funciona
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-10 grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-3"
            >
              <div className="min-h-[120px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-xl font-bold leading-tight">Presupuesto</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  Automático y estructurado
                </div>
              </div>

              <div className="min-h-[120px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-xl font-bold leading-tight">Cronograma de obra</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  Fases, etapas y actividades
                </div>
              </div>

              <div className="min-h-[120px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-xl font-bold leading-tight">Plan de abastecimiento</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  Materiales, compras y abastecimiento
                </div>
              </div>

              <div className="min-h-[120px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-xl font-bold leading-tight">EDT</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  Estructura de desglose de trabajo
                </div>
              </div>

              <div className="min-h-[120px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-xl font-bold leading-tight">Flujo de caja</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  Proyección financiera del proyecto
                </div>
              </div>

              <div className="min-h-[120px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <div className="text-xl font-bold leading-tight">Control de obra</div>
                <div className="mt-2 text-sm leading-6 text-slate-400">
                  Seguimiento y control de ejecución
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-blue-950/40 backdrop-blur-md">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-cover"
                  poster="/images/hero-fallback.jpg"
                >
                  <source src="/videos/hero.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}