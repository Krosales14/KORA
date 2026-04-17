import type {
  DriverOption,
  ProjectCreateRequest,
  ProjectCreateResponse,
  ProjectDriverValuesUpsertRequest,
  ProjectVersionDriverRow,
} from "./types/koraSmart";

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let message = `HTTP ${res.status}`;
    try {
      const json = text ? JSON.parse(text) : null;
      message = json?.message ?? json?.error ?? message;
    } catch {
      if (text) message = text;
    }
    throw new Error(message);
  }

  return res.json();
}

export const koraSmartApi = {
  getDriverOptions: () => http<DriverOption[]>("/api/catalog/driver-options"),

  createProject: (req: ProjectCreateRequest) =>
    http<ProjectCreateResponse>("/api/projects", {
      method: "POST",
      body: JSON.stringify(req),
    }),

  getProjectVersionDrivers: (projectVersionId: string) =>
    http<ProjectVersionDriverRow[]>(`/api/project-versions/${projectVersionId}/drivers`),

  upsertDriverValues: (req: ProjectDriverValuesUpsertRequest) =>
    http<{ status: string }>("/api/project-driver-values", {
      method: "PUT",
      body: JSON.stringify(req),
    }),
};