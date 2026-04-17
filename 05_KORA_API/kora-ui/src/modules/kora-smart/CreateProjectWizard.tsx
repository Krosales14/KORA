import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, Check } from "lucide-react";
import { koraSmartApi } from "../../api/koraSmartApi";
import type {
  DriverOption,
  ProjectCreateResponse,
  ProjectDriverValueUpsert,
  ProjectVersionDriverRow,
} from "../../api/types/koraSmart";

type Step =
  | { kind: "general" }
  | { kind: "group"; groupCode: string; title: string; subtitle?: string | null }
  | { kind: "summary" };

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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-white/60">{label}</div>
      <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur">
        {children}
      </div>
    </label>
  );
}

export default function CreateProjectWizard({ onExit }: { onExit: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>("");
  const [notice, setNotice] = useState<string>("");

  const [projectName, setProjectName] = useState("Demo KORA Smart 1");
  const [projectDescription, setProjectDescription] = useState("Prueba wizard");

  const [created, setCreated] = useState<ProjectCreateResponse | null>(null);

  const [options, setOptions] = useState<DriverOption[]>([]);
  const [rows, setRows] = useState<ProjectVersionDriverRow[]>([]);
  const [values, setValues] = useState<Record<string, ProjectDriverValueUpsert>>({});

  const [stepIndex, setStepIndex] = useState(0);

  // ✅ grupos ya guardados -> habilitan click en sidebar
  const [savedGroups, setSavedGroups] = useState<Record<string, boolean>>({});

  // Cargar opciones (dropdown)
  useEffect(() => {
    (async () => {
      try {
        const opts = await koraSmartApi.getDriverOptions();
        setOptions(opts);
      } catch (e: any) {
        console.warn(e?.message ?? e);
      }
    })();
  }, []);

  const optionsByDriver = useMemo(() => {
    const m = new Map<string, DriverOption[]>();
    for (const o of options) {
      m.set(o.driverDefinitionId, [...(m.get(o.driverDefinitionId) ?? []), o]);
    }
    for (const [k, list] of m.entries()) {
      m.set(k, [...list].sort((a, b) => a.displayOrder - b.displayOrder));
    }
    return m;
  }, [options]);

  const groups = useMemo(() => {
    const m = new Map<string, { code: string; name: string; desc?: string | null; order: number }>();
    for (const r of rows) {
      if (!m.has(r.driverGroupCode)) {
        m.set(r.driverGroupCode, {
          code: r.driverGroupCode,
          name: r.driverGroupName,
          desc: r.driverGroupDescription,
          order: r.driverGroupDisplayOrder,
        });
      }
    }
    return [...m.values()].sort((a, b) => a.order - b.order);
  }, [rows]);

  const allGroupsSaved = useMemo(() => {
    if (!groups.length) return false;
    return groups.every((g) => Boolean(savedGroups[g.code]));
  }, [groups, savedGroups]);

  const steps: Step[] = useMemo(() => {
    const s: Step[] = [{ kind: "general" }];
    for (const g of groups) s.push({ kind: "group", groupCode: g.code, title: g.name, subtitle: g.desc });
    s.push({ kind: "summary" });
    return s;
  }, [groups]);

  const step = steps[stepIndex];

  function setValue(driverDefinitionId: string, patch: Partial<ProjectDriverValueUpsert>) {
    setNotice("");
    setValues((prev) => ({
      ...prev,
      [driverDefinitionId]: {
        driverDefinitionId,
        ...(prev[driverDefinitionId] ?? { driverDefinitionId }),
        ...patch,
      },
    }));
  }

  async function loadDrivers(versionId: string) {
    const data = await koraSmartApi.getProjectVersionDrivers(versionId);
    const ordered = [...data].sort(
      (a, b) => a.driverGroupDisplayOrder - b.driverGroupDisplayOrder || a.driverDisplayOrder - b.driverDisplayOrder
    );
    setRows(ordered);

    const next: Record<string, ProjectDriverValueUpsert> = {};
    for (const r of ordered) {
      next[r.driverDefinitionId] = {
        driverDefinitionId: r.driverDefinitionId,
        textValue: r.textValue ?? r.defaultTextValue ?? null,
        numericValue: r.numericValue ?? r.defaultNumericValue ?? null,
        booleanValue: r.booleanValue ?? r.defaultBooleanValue ?? null,
        dateValue: r.dateValue ?? null,
        jsonValue: r.jsonValue ?? null,
        selectedOptionCode: r.selectedOptionCode ?? null,
      };
    }
    setValues(next);
  }

  function validateGeneral(): string | null {
    if (!projectName.trim()) return "Nombre del proyecto requerido.";
    return null;
  }

  function validateGroup(groupCode: string): string | null {
    const ds = rows.filter((r) => r.driverGroupCode === groupCode);
    for (const d of ds) {
      if (!d.isRequired) continue;

      const v = values[d.driverDefinitionId];
      if (!v) return `Campo requerido: ${d.driverName}`;

      if (d.dataType === "option" && !v.selectedOptionCode) return `Campo requerido: ${d.driverName}`;
      if (d.dataType === "number" && v.numericValue == null) return `Campo requerido: ${d.driverName}`;
      if (d.dataType === "text" && !(v.textValue ?? "").trim()) return `Campo requerido: ${d.driverName}`;
      if (d.dataType === "date" && !v.dateValue) return `Campo requerido: ${d.driverName}`;
      if (d.dataType === "boolean" && v.booleanValue == null) return `Campo requerido: ${d.driverName}`;
      if (d.dataType === "json" && !(v.jsonValue ?? "").trim()) return `Campo requerido: ${d.driverName}`;
    }
    return null;
  }

  // ✅ Guardar sin avanzar (y marcar el paso como "guardado")
  async function saveCurrentGroup(groupCode: string) {
    setError("");
    setNotice("");

    if (!created) {
      setError("Primero debés crear el proyecto.");
      return false;
    }

    const err = validateGroup(groupCode);
    if (err) {
      setError(err);
      return false;
    }

    const groupDrivers = rows
      .filter((r) => r.driverGroupCode === groupCode)
      .sort((a, b) => a.driverDisplayOrder - b.driverDisplayOrder);

    const payload = groupDrivers
      .map((d) => values[d.driverDefinitionId])
      .filter(Boolean) as ProjectDriverValueUpsert[];

    setBusy(true);
    try {
      await koraSmartApi.upsertDriverValues({
        projectVersionId: created.projectVersionId,
        values: payload,
      });

      setSavedGroups((prev) => ({ ...prev, [groupCode]: true }));
      setNotice("Guardado ✅");
      return true;
    } catch (e: any) {
      setError(e?.message ?? "Error guardando drivers");
      return false;
    } finally {
      setBusy(false);
    }
  }

  // ✅ Ir a paso (solo pasos guardados se pueden abrir como botón)
  function goToStep(targetIndex: number) {
    setError("");
    setNotice("");

    const target = steps[targetIndex];
    if (!target) return;

    if (!created && targetIndex > 0) {
      setError("Primero debés crear el proyecto.");
      return;
    }

    if (target.kind === "group") {
      const isSaved = Boolean(savedGroups[target.groupCode]);
      const isCurrent = targetIndex === stepIndex;
      if (!isSaved && !isCurrent) {
        setError("Ese paso aún no está guardado. Guardalo primero avanzando secuencialmente.");
        return;
      }
    }

    if (target.kind === "summary" && !allGroupsSaved) {
      setError("Para ver el Resumen necesitás guardar todas las etapas.");
      return;
    }

    setStepIndex(targetIndex);
  }

  async function next() {
    setError("");
    setNotice("");
    if (!step) return;

    if (step.kind === "general") {
      // ✅ si ya existe, solo continuar al paso 1 real
      if (created) {
        setStepIndex(1);
        return;
      }

      const err = validateGeneral();
      if (err) return setError(err);

      setBusy(true);
      try {
        const res = await koraSmartApi.createProject({
          projectName: projectName.trim(),
          projectDescription: projectDescription.trim() || null,
        });
        setCreated(res);

        // reset guardados por si re-crea proyecto (demo)
        setSavedGroups({});
        setNotice("");

        await loadDrivers(res.projectVersionId);

        // Ir al primer grupo
        setStepIndex(1);
      } catch (e: any) {
        setError(e?.message ?? "Error creando proyecto");
      } finally {
        setBusy(false);
      }
      return;
    }

    if (step.kind === "group") {
      const ok = await saveCurrentGroup(step.groupCode);
      if (!ok) return;

      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
      return;
    }

    if (step.kind === "summary") {
      alert("Listo ✅ En la siguiente etapa conectamos Presupuesto/Cronograma/Abastecimiento.");
    }
  }

  function back() {
    setError("");
    setNotice("");
    setStepIndex((i) => Math.max(0, i - 1));
  }

  const progress = Math.round(((stepIndex + 1) / Math.max(steps.length, 1)) * 100);

  return (
    <div className="min-h-screen w-full bg-[#070B18] text-white">
      <Background />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-10">
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xl font-semibold tracking-tight">KORA Smart · Wizard de Drivers</div>
              <div className="mt-2 text-sm text-white/70">
                {created ? (
                  <>
                    <span className="text-white/90">{created.projectCode}</span>
                    <span className="text-white/50"> · {created.projectVersionId}</span>
                  </>
                ) : (
                  "Creá el proyecto y capturá drivers técnicos por etapas."
                )}
              </div>
            </div>

            <div className="min-w-[260px]">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Progreso</span>
                <span>
                  {stepIndex + 1}/{steps.length}
                </span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-[#2EE6A6] to-[#3B82F6]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <button
              onClick={onExit}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
              type="button"
            >
              Volver
            </button>
          </div>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <Card>
              <div className="text-sm font-semibold text-white/90">Pasos</div>
              <div className="mt-3 space-y-2">
                {steps.map((s, idx) => {
                  const active = idx === stepIndex;

                  const title =
                    s.kind === "general" ? "Datos generales" : s.kind === "summary" ? "Resumen" : s.title;

                  const isDone =
                    s.kind === "general"
                      ? Boolean(created)
                      : s.kind === "group"
                      ? Boolean(savedGroups[s.groupCode])
                      : allGroupsSaved;

                  const disabled =
                    !created && idx > 0
                      ? true
                      : s.kind === "group"
                      ? !(savedGroups[s.groupCode] || active) // ✅ solo guardados o el actual
                      : s.kind === "summary"
                      ? !allGroupsSaved
                      : false;

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={disabled}
                      onClick={() => goToStep(idx)}
                      className={[
                        "w-full text-left flex items-center gap-3 rounded-2xl border px-3 py-2 transition",
                        active ? "border-white/20 bg-white/10" : "border-white/10 bg-white/5",
                        disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-white/10",
                      ].join(" ")}
                    >
                      <div
                        className={[
                          "flex h-7 w-7 items-center justify-center rounded-xl",
                          isDone
                            ? "bg-[#2EE6A6] text-[#071021]"
                            : active
                            ? "bg-white/10 text-white"
                            : "bg-white/5 text-white/70",
                        ].join(" ")}
                      >
                        {isDone ? <Check className="h-4 w-4" /> : <span className="text-xs">{idx + 1}</span>}
                      </div>
                      <div className="truncate text-sm text-white/80">{title}</div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-9"
          >
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">
                    {step.kind === "general"
                      ? "Datos generales"
                      : step.kind === "summary"
                      ? "Resumen"
                      : step.title}
                  </div>
                  {step.kind === "group" && step.subtitle ? (
                    <div className="mt-1 text-sm text-white/60">{step.subtitle}</div>
                  ) : null}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={back}
                    disabled={busy || stepIndex === 0}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10 disabled:opacity-60"
                    type="button"
                  >
                    <ChevronLeft className="h-4 w-4" /> Atrás
                  </button>

                  {/* ✅ Guardar sin avanzar (solo en grupos) */}
                  {step.kind === "group" ? (
                    <button
                      onClick={() => saveCurrentGroup(step.groupCode)}
                      disabled={busy}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10 disabled:opacity-60"
                      type="button"
                    >
                      Guardar
                    </button>
                  ) : null}

                  <button
                    onClick={next}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2EE6A6] to-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-[#071021] hover:brightness-110 disabled:opacity-60"
                    type="button"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4" />}
                    {step.kind === "general"
                      ? created
                        ? "Continuar"
                        : "Crear proyecto"
                      : step.kind === "summary"
                      ? "Finalizar"
                      : "Guardar y continuar"}
                  </button>
                </div>
              </div>

              {error ? (
                <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              {notice ? (
                <div className="mt-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                  {notice}
                </div>
              ) : null}

              <div className="mt-6">
                {step.kind === "general" ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nombre del proyecto">
                      <input
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Ej: Casa Santa Ana"
                        disabled={Boolean(created)}
                        className="w-full bg-transparent text-sm outline-none placeholder:text-white/40 disabled:opacity-70"
                      />
                    </Field>

                    <Field label="Descripción (opcional)">
                      <input
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Ej: Residencial 2 niveles"
                        disabled={Boolean(created)}
                        className="w-full bg-transparent text-sm outline-none placeholder:text-white/40 disabled:opacity-70"
                      />
                    </Field>

                    {created ? (
                      <div className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/75">
                        <div>
                          <span className="text-white/90">ProjectCode:</span> {created.projectCode}
                        </div>
                        <div>
                          <span className="text-white/90">ProjectId:</span> {created.projectId}
                        </div>
                        <div>
                          <span className="text-white/90">ProjectVersionId:</span> {created.projectVersionId}
                        </div>
                        <div className="mt-1">
                          <span className="text-white/90">Drivers:</span> {rows.length}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : step.kind === "group" ? (
                  <GroupForm
                    groupCode={step.groupCode}
                    rows={rows}
                    optionsByDriver={optionsByDriver}
                    values={values}
                    setValue={setValue}
                  />
                ) : (
                  <Summary created={created} rows={rows} values={values} />
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function GroupForm({
  groupCode,
  rows,
  optionsByDriver,
  values,
  setValue,
}: {
  groupCode: string;
  rows: ProjectVersionDriverRow[];
  optionsByDriver: Map<string, DriverOption[]>;
  values: Record<string, ProjectDriverValueUpsert>;
  setValue: (driverDefinitionId: string, patch: Partial<ProjectDriverValueUpsert>) => void;
}) {
  const drivers = useMemo(
    () =>
      rows
        .filter((r) => r.driverGroupCode === groupCode)
        .sort((a, b) => a.driverDisplayOrder - b.driverDisplayOrder),
    [rows, groupCode]
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {drivers.map((d) => {
        const v = values[d.driverDefinitionId] ?? { driverDefinitionId: d.driverDefinitionId };
        const unit = d.unitOfMeasureCode ? ` (${d.unitOfMeasureCode})` : "";
        const req = d.isRequired ? " *" : "";
        const label = `${d.driverName}${req}${unit}`;

        if (d.dataType === "option" || d.inputControlType === "dropdown") {
          const opts = optionsByDriver.get(d.driverDefinitionId) ?? [];
          return (
            <div key={d.driverDefinitionId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">{d.driverCode}</div>
              <div className="mt-1 text-sm font-medium text-white/90">{label}</div>
              {d.driverDescription ? <div className="mt-1 text-xs text-white/55">{d.driverDescription}</div> : null}
              <div className="mt-3">
                <select
                  value={v.selectedOptionCode ?? ""}
                  onChange={(e) => setValue(d.driverDefinitionId, { selectedOptionCode: e.target.value || null })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none"
                >
                  <option value="" className="text-black">
                    Seleccionar…
                  </option>
                  {opts.map((o) => (
                    <option key={o.driverDefinitionOptionId} value={o.optionCode} className="text-black">
                      {o.optionName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          );
        }

        if (d.dataType === "number" || d.inputControlType === "number") {
          return (
            <div key={d.driverDefinitionId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">{d.driverCode}</div>
              <div className="mt-1 text-sm font-medium text-white/90">{label}</div>
              {d.driverDescription ? <div className="mt-1 text-xs text-white/55">{d.driverDescription}</div> : null}
              <div className="mt-3">
                <input
                  type="number"
                  step={d.allowsDecimals ? "0.01" : "1"}
                  value={v.numericValue ?? ""}
                  onChange={(e) =>
                    setValue(d.driverDefinitionId, {
                      numericValue: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none"
                />
              </div>
            </div>
          );
        }

        if (d.dataType === "boolean" || d.inputControlType === "checkbox") {
          return (
            <div key={d.driverDefinitionId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs text-white/60">{d.driverCode}</div>
                  <div className="mt-1 text-sm font-medium text-white/90">{label}</div>
                  {d.driverDescription ? <div className="mt-1 text-xs text-white/55">{d.driverDescription}</div> : null}
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(v.booleanValue)}
                  onChange={(e) => setValue(d.driverDefinitionId, { booleanValue: e.target.checked })}
                  className="mt-2 h-5 w-5 rounded border-white/20 bg-white/10"
                />
              </div>
            </div>
          );
        }

        if (d.dataType === "date" || d.inputControlType === "date") {
          return (
            <div key={d.driverDefinitionId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">{d.driverCode}</div>
              <div className="mt-1 text-sm font-medium text-white/90">{label}</div>
              {d.driverDescription ? <div className="mt-1 text-xs text-white/55">{d.driverDescription}</div> : null}
              <div className="mt-3">
                <input
                  type="date"
                  value={(v.dateValue ?? "").substring(0, 10)}
                  onChange={(e) => setValue(d.driverDefinitionId, { dateValue: e.target.value || null })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none"
                />
              </div>
            </div>
          );
        }

        if (d.dataType === "json" || d.inputControlType === "json") {
          return (
            <div key={d.driverDefinitionId} className="md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="text-xs text-white/60">{d.driverCode}</div>
              <div className="mt-1 text-sm font-medium text-white/90">{label}</div>
              {d.driverDescription ? <div className="mt-1 text-xs text-white/55">{d.driverDescription}</div> : null}
              <div className="mt-3">
                <textarea
                  rows={6}
                  value={v.jsonValue ?? ""}
                  onChange={(e) => setValue(d.driverDefinitionId, { jsonValue: e.target.value || null })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none"
                />
              </div>
            </div>
          );
        }

        const isTextarea = d.inputControlType === "textarea";
        return (
          <div
            key={d.driverDefinitionId}
            className={
              isTextarea
                ? "md:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4"
                : "rounded-2xl border border-white/10 bg-white/5 p-4"
            }
          >
            <div className="text-xs text-white/60">{d.driverCode}</div>
            <div className="mt-1 text-sm font-medium text-white/90">{label}</div>
            {d.driverDescription ? <div className="mt-1 text-xs text-white/55">{d.driverDescription}</div> : null}
            <div className="mt-3">
              {isTextarea ? (
                <textarea
                  rows={4}
                  value={v.textValue ?? ""}
                  onChange={(e) => setValue(d.driverDefinitionId, { textValue: e.target.value || null })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none"
                />
              ) : (
                <input
                  value={v.textValue ?? ""}
                  onChange={(e) => setValue(d.driverDefinitionId, { textValue: e.target.value || null })}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Summary({
  created,
  rows,
  values,
}: {
  created: ProjectCreateResponse | null;
  rows: ProjectVersionDriverRow[];
  values: Record<string, ProjectDriverValueUpsert>;
}) {
  const ordered = useMemo(
    () =>
      [...rows].sort(
        (a, b) => a.driverGroupDisplayOrder - b.driverGroupDisplayOrder || a.driverDisplayOrder - b.driverDisplayOrder
      ),
    [rows]
  );

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
        <div>
          ProjectCode: <span className="text-white">{created?.projectCode ?? "—"}</span>
        </div>
        <div className="mt-1 text-white/60">ProjectId: {created?.projectId ?? "—"}</div>
        <div className="text-white/60">ProjectVersionId: {created?.projectVersionId ?? "—"}</div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-semibold">Valores capturados</div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {ordered.map((d) => {
            const v = values[d.driverDefinitionId];

            const display =
              v?.selectedOptionCode ??
              (v?.numericValue != null ? String(v.numericValue) : null) ??
              (v?.textValue ? v.textValue : null) ??
              (v?.booleanValue != null ? (v.booleanValue ? "Sí" : "No") : null) ??
              (v?.dateValue ? v.dateValue : null) ??
              (v?.jsonValue ? v.jsonValue : null) ??
              "—";

            return (
              <div key={d.driverDefinitionId} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/60">{d.driverGroupName}</div>
                <div className="mt-1 text-sm font-medium">{d.driverName}</div>
                <div className="mt-2 text-sm text-white/75 break-words">{display}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}