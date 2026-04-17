export type DriverOption = {
  driverDefinitionOptionId: string;
  driverDefinitionId: string;
  driverCode: string;
  optionCode: string;
  optionName: string;
  optionDescription?: string | null;
  numericEquivalent?: number | null;
  displayOrder: number;
  isDefault: boolean;
};

export type ProjectCreateRequest = {
  projectName: string;
  projectDescription?: string | null;
};

export type ProjectCreateResponse = {
  projectId: string;
  projectVersionId: string;
  projectCode: string;
};

export type ProjectDriverValueUpsert = {
  driverDefinitionId: string;
  textValue?: string | null;
  numericValue?: number | null;
  booleanValue?: boolean | null;
  dateValue?: string | null; // yyyy-mm-dd
  jsonValue?: string | null;

  // IMPORTANTE: para dropdown guardamos el CODE, no un Id
  selectedOptionCode?: string | null;
};

export type ProjectDriverValuesUpsertRequest = {
  projectVersionId: string;
  values: ProjectDriverValueUpsert[];
};

/**
 * Esto viene del endpoint:
 * GET /api/project-versions/{id}/drivers
 * (catálogo + valores actuales si existen)
 */
export type ProjectVersionDriverRow = {
  driverGroupCode: string;
  driverGroupName: string;
  driverGroupDescription?: string | null;
  driverGroupDisplayOrder: number;

  driverDefinitionId: string;
  driverCode: string;
  driverName: string;
  driverDescription?: string | null;

  dataType: "number" | "text" | "boolean" | "date" | "option" | "json";
  inputControlType: "textbox" | "textarea" | "number" | "dropdown" | "radio" | "checkbox" | "date" | "json";
  unitOfMeasureCode?: string | null;

  isRequired: boolean;
  allowsDecimals: boolean;

  minNumericValue?: number | null;
  maxNumericValue?: number | null;
  minTextLength?: number | null;
  maxTextLength?: number | null;

  defaultTextValue?: string | null;
  defaultNumericValue?: number | null;
  defaultBooleanValue?: boolean | null;

  affectsBudget: boolean;
  affectsSchedule: boolean;
  affectsCashFlow: boolean;
  affectsSupplyPlan: boolean;

  driverDisplayOrder: number;

  // valores capturados (si existen)
  textValue?: string | null;
  numericValue?: number | null;
  booleanValue?: boolean | null;
  dateValue?: string | null;
  jsonValue?: string | null;
  selectedOptionCode?: string | null;
  selectedOptionName?: string | null;
};