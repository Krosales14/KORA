import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  Sparkles,
  Calculator,
  ClipboardList,
  User,
  HelpCircle,
  LogOut,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Phone,
  ArrowLeft,
} from "lucide-react";

import CreateProjectWizard from "./modules/kora-smart/CreateProjectWizard";

/**
 * KORA — UI Prototype (DEMO)
 * - Login
 * - Registro (Form + OTP por SMS demo)
 * - Home post-login
 * - KORA Smart Wizard (demo)
 */

// ==================
// Catálogo GEO (demo) — Provincia -> Cantón -> Distrito
// ==================
type Province = { id: string; name: string };
type Canton = { id: string; provinceId: string; name: string };
type District = { id: string; cantonId: string; name: string };

const PROVINCES: Province[] = [
  { id: "SJ", name: "San José" },
  { id: "A", name: "Alajuela" },
  { id: "C", name: "Cartago" },
  { id: "H", name: "Heredia" },
  { id: "G", name: "Guanacaste" },
  { id: "P", name: "Puntarenas" },
  { id: "L", name: "Limón" },
];

const CANTONS: Canton[] = [
  // San José
  { id: "SJ-SA", provinceId: "SJ", name: "Santa Ana" },
  { id: "SJ-ES", provinceId: "SJ", name: "Escazú" },
  { id: "SJ-SJ", provinceId: "SJ", name: "San José" },

  // Alajuela
  { id: "A-A", provinceId: "A", name: "Alajuela" },
  { id: "A-SC", provinceId: "A", name: "San Carlos" },

  // Heredia
  { id: "H-H", provinceId: "H", name: "Heredia" },

  // Cartago
  { id: "C-C", provinceId: "C", name: "Cartago" },

  // Guanacaste
  { id: "G-LIB", provinceId: "G", name: "Liberia" },

  // Puntarenas
  { id: "P-P", provinceId: "P", name: "Puntarenas" },

  // Limón
  { id: "L-L", provinceId: "L", name: "Limón" },
];

const DISTRICTS: District[] = [
  // Santa Ana
  { id: "SJ-SA-SA", cantonId: "SJ-SA", name: "Santa Ana" },
  { id: "SJ-SA-SAL", cantonId: "SJ-SA", name: "Salitral" },
  { id: "SJ-SA-PIE", cantonId: "SJ-SA", name: "Piedades" },
  { id: "SJ-SA-BRA", cantonId: "SJ-SA", name: "Brasil" },

  // Escazú
  { id: "SJ-ES-ES", cantonId: "SJ-ES", name: "Escazú" },
  { id: "SJ-ES-SAN", cantonId: "SJ-ES", name: "San Antonio" },
  { id: "SJ-ES-SRA", cantonId: "SJ-ES", name: "San Rafael" },

  // Alajuela
  { id: "A-A-A", cantonId: "A-A", name: "Alajuela" },
  { id: "A-A-SJ", cantonId: "A-A", name: "San José" },

  // Heredia
  { id: "H-H-H", cantonId: "H-H", name: "Heredia" },
];

function getCantonsByProvince(provinceId: string) {
  return CANTONS.filter((c) => c.provinceId === provinceId);
}
function getDistrictsByCanton(cantonId: string) {
  return DISTRICTS.filter((d) => d.cantonId === cantonId);
}

type Route = "login" | "register" | "home" | "smart";

const MARKET_URL = "https://app.base44.com/apps/697d1f9fdb2ee04450026056/editor/preview";

export default function KoraPrototype() {
  const [route, setRoute] = useState<Route>("login");
  const [displayName, setDisplayName] = useState("Rodrigo");

  const isAuthed = route === "home" || route === "smart";

  return (
    <div className="min-h-screen w-full bg-[#070B18] text-white">
      <Background />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <KoraLogo />
        </div>

        <div className="flex items-center gap-3">
          {isAuthed ? (
            <>
              <nav className="hidden items-center gap-6 text-sm text-white/80 md:flex">
                <a
                  href={MARKET_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 transition hover:text-white"
                >
                  Market
                </a>

                {/* ✅ Smart ahora navega */}
                <button
                  type="button"
                  onClick={() => setRoute("smart")}
                  className="flex items-center gap-2 transition hover:text-white"
                >
                  Smart
                </button>

                <NavItem>Cálculo</NavItem>
                <NavItem>Mis Proyectos</NavItem>
                <NavItem icon={<HelpCircle className="h-4 w-4" />}>Soporte</NavItem>
              </nav>

              <div className="flex items-center gap-2">
                {/* Back solo en wizard */}
                {route === "smart" && (
                  <IconButton title="Volver" onClick={() => setRoute("home")}>
                    <ArrowLeft className="h-4 w-4" />
                  </IconButton>
                )}

                <IconButton title="Perfil">
                  <User className="h-4 w-4" />
                </IconButton>

                <IconButton
                  title="Cerrar sesión"
                  onClick={() => {
                    setRoute("login");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                </IconButton>
              </div>
            </>
          ) : (
            <>
              <TopPillButton onClick={() => setRoute("login")}>Ingresar</TopPillButton>
              <TopPillButton variant="primary" onClick={() => setRoute("register")}>
                Crear cuenta
              </TopPillButton>
            </>
          )}
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16">
        {route === "login" ? (
          <LoginScreen
            onSignedIn={(name) => {
              setDisplayName(name || "Rodrigo");
              setRoute("home");
            }}
            onGoRegister={() => setRoute("register")}
          />
        ) : route === "register" ? (
          <RegisterScreen
            onCancel={() => setRoute("login")}
            onCompleted={(fullName) => {
              setDisplayName(fullName);
              alert("Registro completado ✅. Ahora podés iniciar sesión.");
              setRoute("login");
            }}
          />
        ) : route === "smart" ? (
          <CreateProjectWizard onExit={() => setRoute("home")} />
        ) : (
          <HomeScreen
            userName={displayName}
            onGoSmart={() => setRoute("smart")}
          />
        )}

        {/* Dev switch */}
        <div className="mt-10 flex items-center justify-center">
          <button
            onClick={() =>
              setRoute((r) => (r === "login" ? "register" : r === "register" ? "home" : r === "home" ? "smart" : "login"))
            }
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur hover:bg-white/10"
            type="button"
          >
            Alternar pantalla (demo)
          </button>
        </div>
      </main>
    </div>
  );
}

function LoginScreen({
  onSignedIn,
  onGoRegister,
}: {
  onSignedIn: (name: string) => void;
  onGoRegister: () => void;
}) {
  const [email, setEmail] = useState("rodrigo@kora.com");
  const [password, setPassword] = useState("Font2026");
  const [show, setShow] = useState(false);

  const heroTitle = "Comprá materiales y planificá tu obra en minutos.";
  const heroSub =
    "KORA te ayuda a cotizar, calcular y comprar materiales con entrega en sitio y compras por etapas.";

  return (
    <section className="grid items-start gap-10 pt-10 md:grid-cols-12 md:pt-16">
      {/* Hero */}
      <div className="md:col-span-7">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
        >
          {heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/70"
        >
          {heroSub}
        </motion.p>

        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton onClick={() => onSignedIn("Rodrigo")}>Ingresar</PrimaryButton>
          <SecondaryButton onClick={onGoRegister}>Crear cuenta</SecondaryButton>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <MiniFeature icon={<Sparkles className="h-4 w-4" />} title="Smart" desc="Presupuesto, cronograma, flujo y plan de compras." />
          <MiniFeature icon={<Calculator className="h-4 w-4" />} title="Cálculo" desc="Cálculo rápido de materiales por actividad." />
          <MiniFeature icon={<ShoppingCart className="h-4 w-4" />} title="Market" desc="Marketplace de materiales de construcción." />
          <MiniFeature icon={<ClipboardList className="h-4 w-4" />} title="Proyectos" desc="Gestión simple de cada obra creada." />
        </div>
      </div>

      {/* Auth card */}
      <div className="md:col-span-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-white/70">Acceso</div>
              <div className="mt-1 text-xl font-semibold">Iniciar sesión</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
              <Lock className="h-5 w-5 text-white/80" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <Field label="Correo" icon={<Mail className="h-4 w-4" />}>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@empresa.com"
                className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
              />
            </Field>

            <Field label="Contraseña" icon={<Lock className="h-4 w-4" />}>
              <div className="flex w-full items-center gap-2">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={show ? "text" : "password"}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                />
                <button
                  onClick={() => setShow((s) => !s)}
                  className="rounded-lg p-1 text-white/60 hover:bg-white/5 hover:text-white"
                  aria-label={show ? "Ocultar" : "Mostrar"}
                  type="button"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            <div className="flex items-center justify-between pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-white/60">
                <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5" />
                Recordarme
              </label>
              <button className="text-xs text-white/70 hover:text-white" type="button">
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-3">
            <PrimaryButton
              onClick={() => {
                const name = email.split("@")[0] || "Rodrigo";
                onSignedIn(capitalize(name));
              }}
            >
              Ingresar
            </PrimaryButton>

            <button
              onClick={() => alert("Demo: SSO (OIDC) lo conectamos luego")}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur hover:bg-white/10"
              type="button"
            >
              Continuar con SSO
            </button>

            <button
              onClick={onGoRegister}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 backdrop-blur hover:bg-white/10"
              type="button"
            >
              Crear cuenta
            </button>
          </div>

          <div className="mt-4 text-center text-xs text-white/50">
            Al ingresar aceptás nuestros términos y políticas.
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * RegisterScreen (DEMO)
 * - Paso 1: Formulario
 * - Paso 2: Código SMS (OTP) simulado
 */
function RegisterScreen({
  onCancel,
  onCompleted,
}: {
  onCancel: () => void;
  onCompleted: (fullName: string) => void;
}) {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);

  // OTP demo
  const [otpSent, setOtpSent] = useState<string>("");
  const [otpInput, setOtpInput] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    category: "Constructor",
    provinceId: "SJ",
    cantonId: "",
    districtName: "",
  });

  const cantons = getCantonsByProvince(form.provinceId);
  const districts = form.cantonId ? getDistrictsByCanton(form.cantonId) : [];

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const onProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setForm((p) => ({ ...p, provinceId, cantonId: "", districtName: "" }));
  };

  const onCantonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cantonId = e.target.value;
    setForm((p) => ({ ...p, cantonId, districtName: "" }));
  };

  const sendOtpDemo = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setOtpSent(code);
    alert(`DEMO SMS: Código enviado al celular ${form.phone || "(sin celular)"}: ${code}`);
  };

  const continueToOtp = async () => {
    if (!form.firstName || !form.lastName || !form.phone || !form.email || !form.password) {
      alert("Completá: Nombre, Apellidos, Celular, Email y Password.");
      return;
    }
    if (!form.cantonId || !form.districtName) {
      alert("Seleccioná Provincia, Cantón y Distrito.");
      return;
    }

    setLoading(true);
    try {
      sendOtpDemo();
      setStep("otp");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpDemo = async () => {
    if (!otpInput.trim()) {
      alert("Ingresá el código enviado por SMS.");
      return;
    }
    setLoading(true);
    try {
      if (otpInput.trim() !== otpSent) {
        alert("Código inválido (demo). Revisá el código que te salió en el alert.");
        return;
      }
      onCompleted(`${form.firstName} ${form.lastName}`.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="pt-10 md:pt-14">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold">{step === "form" ? "Crear cuenta" : "Verificación por SMS"}</div>
            <div className="mt-2 text-sm text-white/70">
              {step === "form"
                ? "Registrá tu usuario para ingresar a KORA."
                : "Ingresá el código enviado al celular registrado para completar el registro."}
            </div>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            demo • OTP simulado
          </div>
        </div>

        {step === "form" ? (
          <>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Field label="Nombre" icon={<User className="h-4 w-4" />}>
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-white/40" value={form.firstName} onChange={set("firstName")} />
              </Field>

              <Field label="Apellidos" icon={<User className="h-4 w-4" />}>
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-white/40" value={form.lastName} onChange={set("lastName")} />
              </Field>

              <Field label="Email" icon={<Mail className="h-4 w-4" />}>
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-white/40" value={form.email} onChange={set("email")} />
              </Field>

              <Field label="Password" icon={<Lock className="h-4 w-4" />}>
                <input type="password" className="w-full bg-transparent text-sm outline-none placeholder:text-white/40" value={form.password} onChange={set("password")} />
              </Field>

              <Field label="Celular" icon={<Phone className="h-4 w-4" />}>
                <input className="w-full bg-transparent text-sm outline-none placeholder:text-white/40" value={form.phone} onChange={set("phone")} placeholder="88887777" />
              </Field>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
                <div className="mb-1 text-xs text-white/60">Categoría</div>
                <select className="w-full bg-transparent text-sm outline-none" value={form.category} onChange={set("category")}>
                  {["Desarrollador", "Constructor", "Consultor", "Diseñador", "Inversionista", "Propietario"].map((c) => (
                    <option key={c} value={c} className="text-black">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
                <div className="mb-1 text-xs text-white/60">Provincia</div>
                <select className="w-full bg-transparent text-sm outline-none" value={form.provinceId} onChange={onProvinceChange}>
                  {PROVINCES.map((p) => (
                    <option key={p.id} value={p.id} className="text-black">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
                <div className="mb-1 text-xs text-white/60">Cantón</div>
                <select className="w-full bg-transparent text-sm outline-none" value={form.cantonId} onChange={onCantonChange}>
                  <option value="" className="text-black">
                    Seleccioná un cantón
                  </option>
                  {cantons.map((c) => (
                    <option key={c.id} value={c.id} className="text-black">
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
                <div className="mb-1 text-xs text-white/60">Distrito</div>
                <select
                  className="w-full bg-transparent text-sm outline-none"
                  value={form.districtName}
                  onChange={(e) => setForm((p) => ({ ...p, districtName: e.target.value }))}
                  disabled={!form.cantonId}
                >
                  <option value="" className="text-black">
                    {form.cantonId ? "Seleccioná un distrito" : "Primero seleccioná un cantón"}
                  </option>
                  {districts.map((d) => (
                    <option key={d.id} value={d.name} className="text-black">
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <PrimaryButton onClick={continueToOtp}>{loading ? "Procesando..." : "Continuar"}</PrimaryButton>
              <SecondaryButton onClick={onCancel}>Cancelar</SecondaryButton>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 max-w-md">
              <Field label="Código SMS" icon={<Lock className="h-4 w-4" />}>
                <input
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="Ej: 123456"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/40"
                />
              </Field>

              <div className="mt-4 flex flex-wrap gap-3">
                <PrimaryButton onClick={verifyOtpDemo}>{loading ? "Verificando..." : "Verificar"}</PrimaryButton>
                <SecondaryButton onClick={() => sendOtpDemo()}>Reenviar</SecondaryButton>
                <SecondaryButton onClick={() => setStep("form")}>Volver</SecondaryButton>
              </div>

              <div className="mt-3 text-xs text-white/60">
                Demo: el código se muestra en un <b>alert</b>. En producción se envía por SMS.
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

type ModuleCard = {
  title: string;
  desc: string;
  cta: string;
  icon: React.ReactNode;
  accent: string;
  url?: string;
  onClick?: () => void;
};

function HomeScreen({
  userName,
  onGoSmart,
}: {
  userName: string;
  onGoSmart: () => void;
}) {
  const modules = useMemo<ModuleCard[]>(
    () => [
      {
        title: "KORA Market",
        desc: "Marketplace de materiales de construcción.",
        cta: "Ir a Market",
        icon: <ShoppingCart className="h-5 w-5" />,
        accent: "from-[#2EE6A6]/25 to-[#3B82F6]/10",
        url: MARKET_URL,
      },
      {
        title: "KORA Smart",
        desc: "Motor inteligente que convierte datos básicos de la obra en: presupuesto, cronograma, flujo y plan de compras.",
        cta: "Cotizar mi obra",
        icon: <Sparkles className="h-5 w-5" />,
        accent: "from-[#A3FF5A]/25 to-[#2EE6A6]/10",
        onClick: onGoSmart,
      },
      {
        title: "KORA Custom",
        desc: "Cálculo directo de materiales por actividad constructiva.",
        cta: "Calcular materiales",
        icon: <Calculator className="h-5 w-5" />,
        accent: "from-[#60A5FA]/25 to-[#2EE6A6]/10",
        onClick: () => alert("Demo: KORA Custom (pendiente)"),
      },
      {
        title: "Mis Proyectos",
        desc: "Gestión simple de cada obra creada por el usuario.",
        cta: "Ver mis proyectos",
        icon: <ClipboardList className="h-5 w-5" />,
        accent: "from-[#94A3B8]/25 to-[#60A5FA]/10",
        onClick: () => alert("Demo: Mis Proyectos (pendiente)"),
      },
    ],
    [onGoSmart]
  );

  return (
    <section className="pt-10 md:pt-14">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
          ¡Bienvenido, <span className="text-white">{userName}</span>!
        </h2>
        <p className="mt-4 text-white/70">Seleccioná una función para continuar:</p>
      </motion.div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {modules.map((m, idx) => (
          <motion.div
            key={m.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.06 * idx }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_18px_55px_rgba(0,0,0,0.5)] backdrop-blur-xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${m.accent} opacity-90`} aria-hidden />
            <div className="absolute inset-0 opacity-40" aria-hidden>
              <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            </div>

            <div className="relative p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                  <div className="text-white/90">{m.icon}</div>
                </div>
                <div className="min-w-0">
                  <div className="text-xl font-semibold tracking-tight md:text-2xl">{m.title}</div>
                  <div className="mt-2 text-sm leading-relaxed text-white/75">{m.desc}</div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => {
                    if (m.onClick) return m.onClick();
                    if (m.url) return window.open(m.url, "_blank", "noreferrer");
                    alert(`Navegar a: ${m.title}`);
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white/90 backdrop-blur transition hover:bg-white/15 group-hover:shadow-[0_10px_35px_rgba(46,230,166,0.12)]"
                  type="button"
                >
                  {m.cta}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_15%_15%,rgba(59,130,246,0.28),transparent_60%),radial-gradient(900px_circle_at_80%_30%,rgba(46,230,166,0.22),transparent_55%),radial-gradient(1100px_circle_at_50%_110%,rgba(163,255,90,0.12),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_50%_40%,transparent_30%,rgba(0,0,0,0.65)_80%)]" />
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

function KoraLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center">
        <div className="absolute -top-2 left-[34px] flex gap-2">
          <span className="h-4 w-4 rounded-md bg-[#2EE6A6] shadow-[0_10px_25px_rgba(46,230,166,0.35)]" />
          <span className="h-4 w-4 rounded-md bg-[#A3FF5A] shadow-[0_10px_25px_rgba(163,255,90,0.25)]" />
        </div>
        <div className="text-xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">K</span>
          <span className="bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">O</span>
          <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">R</span>
          <span className="bg-gradient-to-r from-white to-white bg-clip-text text-transparent">A</span>
        </div>
      </div>
    </div>
  );
}

function TopPillButton({
  children,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary";
}) {
  return (
    <button
      onClick={onClick}
      className={
        variant === "primary"
          ? "rounded-full bg-gradient-to-r from-[#2EE6A6] to-[#3B82F6] px-4 py-2 text-sm font-medium text-[#081022] shadow-[0_16px_40px_rgba(59,130,246,0.22)] hover:brightness-110"
          : "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur hover:bg-white/10"
      }
      type="button"
    >
      {children}
    </button>
  );
}

function NavItem({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <a
      href="#"
      onClick={(e) => e.preventDefault()}
      className="flex items-center gap-2 transition hover:text-white"
    >
      {icon}
      {children}
    </a>
  );
}

function IconButton({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 backdrop-blur hover:bg-white/10"
      type="button"
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl bg-gradient-to-r from-[#2EE6A6] to-[#3B82F6] px-5 py-3 text-sm font-semibold text-[#071021] shadow-[0_18px_60px_rgba(46,230,166,0.16)] transition hover:brightness-110"
      type="button"
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/85 backdrop-blur transition hover:bg-white/10"
      type="button"
    >
      {children}
    </button>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-white/60">{label}</div>
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
        <div className="text-white/60">{icon}</div>
        {children}
      </div>
    </label>
  );
}

function MiniFeature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
          {icon}
        </div>
        <div className="font-medium">{title}</div>
      </div>
      <div className="mt-2 text-xs leading-relaxed text-white/60">{desc}</div>
    </div>
  );
}

function capitalize(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}