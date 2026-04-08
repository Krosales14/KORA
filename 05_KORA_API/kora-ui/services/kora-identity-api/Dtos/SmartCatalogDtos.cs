namespace kora_identity_api.Dtos;

public record DriverGroupDto(
    Guid DriverGroupId,
    string DriverGroupCode,
    string DriverGroupName,
    string? DriverGroupDescription,
    int DisplayOrder
);

public record DriverDefinitionDto(
    Guid DriverDefinitionId,
    Guid DriverGroupId,
    string DriverGroupCode,
    string DriverGroupName,
    string? DriverGroupDescription,
    int DriverGroupDisplayOrder,

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
    bool IsActive
);

public record DriverOptionDto(
    Guid DriverDefinitionOptionId,
    Guid DriverDefinitionId,
    string DriverCode,
    string OptionCode,
    string OptionName,
    string? OptionDescription,
    decimal? NumericEquivalent,
    int DisplayOrder,
    bool IsDefault
);
