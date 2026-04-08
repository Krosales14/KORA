namespace kora_identity_api.Dtos;

public record ProjectCreateRequest(string ProjectName, string? ProjectDescription);

public record ProjectCreateResponse(Guid ProjectId, Guid ProjectVersionId, string ProjectCode);

public record ProjectVersionCreateRequest(Guid ProjectId);

public record ProjectVersionCreateResponse(Guid ProjectVersionId, int VersionNumber);

public record ProjectDriverValueUpsertDto(
    Guid DriverDefinitionId,
    string? TextValue,
    decimal? NumericValue,
    bool? BooleanValue,
    DateTime? DateValue,
    string? JsonValue,
    string? SelectedOptionCode
);

public record ProjectDriverValuesUpsertRequest(
    Guid ProjectVersionId,
    List<ProjectDriverValueUpsertDto> Values
);

public record ProjectDto(
    Guid ProjectId,
    string ProjectCode,
    string ProjectName,
    string? ProjectDescription,
    Guid? OwnerUserId,
    string StatusCode,
    string CurrencyCode,
    string? Notes,
    DateTime CreatedAt,
    string? CreatedBy,
    DateTime? UpdatedAt,
    string? UpdatedBy,
    bool IsActive
);

public record ProjectVersionDto(
    Guid ProjectVersionId,
    Guid ProjectId,
    int VersionNumber,
    string? VersionName,
    bool IsCurrent,
    string VersionStatusCode,
    string? ChangeSummary,
    string? CalculationNotes,
    DateTime CreatedAt,
    string? CreatedBy,
    DateTime? UpdatedAt,
    string? UpdatedBy,
    bool IsActive
);

public record ProjectGetResponse(ProjectDto Project, List<ProjectVersionDto> Versions);

public record ProjectVersionDriverRowDto(
    string DriverGroupCode,
    string DriverGroupName,
    string? DriverGroupDescription,
    int DriverGroupDisplayOrder,

    Guid DriverDefinitionId,
    string DriverCode,
    string DriverName,
    string? DriverDescription,
    string DataType,
    string InputControlType,
    string? UnitOfMeasureCode,

    bool IsRequired,
    bool AllowsDecimals,
    decimal? MinNumericValue,
    decimal? MaxNumericValue,
    int? MinTextLength,
    int? MaxTextLength,

    string? DefaultTextValue,
    decimal? DefaultNumericValue,
    bool? DefaultBooleanValue,

    bool AffectsBudget,
    bool AffectsSchedule,
    bool AffectsCashFlow,
    bool AffectsSupplyPlan,

    int DriverDisplayOrder,

    string? TextValue,
    decimal? NumericValue,
    bool? BooleanValue,
    DateTime? DateValue,
    string? JsonValue,
    string? SelectedOptionCode,
    string? SelectedOptionName
);
