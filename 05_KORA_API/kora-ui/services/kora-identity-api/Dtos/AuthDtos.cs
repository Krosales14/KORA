namespace kora_identity_api.Dtos;

public record LoginRequest(string Email, string Password);

public record RegisterRequest(
    string FirstName,
    string LastName,
    string Phone,
    string Email,
    string Password,
    string CategoryId,
    string ProvinceId,
    string CantonId,
    string DistrictId
);

public record RegisterResponse(Guid VerificationId, string PhoneMasked, int ExpiresInMinutes);

public record VerifyOtpRequest(Guid VerificationId, string Code);

// Forgot password (SMS)
public record PasswordResetRequestCreate(string Email);

public record PasswordResetRequestCreateResponse(
    Guid PasswordResetRequestId,
    string PhoneMasked,
    int ExpiresInMinutes
);

public record PasswordResetVerifyRequest(Guid PasswordResetRequestId, string ResetToken);

public record PasswordResetCompleteRequest(Guid PasswordResetRequestId, string ResetToken, string NewPassword);