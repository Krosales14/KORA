using BCrypt.Net;
using kora_identity_api.Dtos;
using kora_identity_api.Repositories;

namespace kora_identity_api.Services;

public sealed class AuthService
{
    private readonly UserRepository _users;
    private readonly OtpRepository _otp;
    private readonly PasswordResetRepository _reset;
    private readonly JwtTokenService _jwt;
    private readonly ISmsSender _sms;

    public AuthService(UserRepository users, OtpRepository otp, PasswordResetRepository reset, JwtTokenService jwt, ISmsSender sms)
    {
        _users = users;
        _otp = otp;
        _reset = reset;
        _jwt = jwt;
        _sms = sms;
    }

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest req)
    {
        var phoneE164 = CryptoCompat.NormalizePhoneCR(req.Phone);
        var passHash = BCrypt.Net.BCrypt.HashPassword(req.Password);

        var (userId, rc) = await _users.RegisterAsync(new
        {
            FirstName = req.FirstName.Trim(),
            LastName = req.LastName.Trim(),
            PhoneE164 = phoneE164,
            Email = req.Email.Trim(),
            PasswordHash = passHash,
            CategoryId = req.CategoryId,
            ProvinceId = req.ProvinceId,
            CantonId = req.CantonId,
            DistrictId = req.DistrictId
        });

        if (rc == 1) throw new InvalidOperationException("Email ya existe.");
        if (rc == 2) throw new InvalidOperationException("Categoría inválida.");
        if (rc == 3) throw new InvalidOperationException("Ubicación inválida.");
        if (rc != 0 || userId is null) throw new InvalidOperationException("Error registrando usuario.");

        var otp = CryptoCompat.GenerateOtp6();
        var salt = System.Security.Cryptography.RandomNumberGenerator.GetBytes(16);
        var hash = CryptoCompat.Sha256Salted(salt, otp);

        await _otp.UpsertAsync(userId.Value, phoneE164, salt, hash, DateTime.UtcNow.AddMinutes(10));

        await _sms.SendAsync(phoneE164, $"KORA: tu código de verificación es {otp}. Expira en 10 minutos.");

        return new RegisterResponse(userId.Value, CryptoCompat.MaskPhone(phoneE164), 10);
    }

    public async Task VerifyOtpAsync(VerifyOtpRequest req)
    {
        var rc = await _otp.VerifyAsync(req.VerificationId, req.Code);

        if (rc == 0) return;

        throw rc switch
        {
            1 => new InvalidOperationException("Código inválido."),
            2 => new InvalidOperationException("Código expirado."),
            3 => new InvalidOperationException("Demasiados intentos."),
            4 => new InvalidOperationException("No existe verificación."),
            _ => new InvalidOperationException("Error verificando OTP.")
        };
    }

    public async Task<object> LoginAsync(LoginRequest req)
    {
        var u = await _users.GetByEmailAsync(req.Email.Trim());
        if (u is null) throw new UnauthorizedAccessException();

        if ((bool)u.IsActive == false) throw new UnauthorizedAccessException();
        if ((bool)u.IsVerified == false) throw new UnauthorizedAccessException();

        if (!BCrypt.Net.BCrypt.Verify(req.Password, (string)u.PasswordHash))
            throw new UnauthorizedAccessException();

        var fullName = $"{(string)u.FirstName} {(string)u.LastName}".Trim();
        var token = _jwt.CreateToken((string)u.Email, fullName);

        return new
        {
            accessToken = token,
            user = new
            {
                email = (string)u.Email,
                firstName = (string)u.FirstName,
                lastName = (string)u.LastName,
                name = fullName
            }
        };
    }

    // Forgot password (SMS)
    public async Task<PasswordResetRequestCreateResponse?> CreatePasswordResetAsync(string email)
    {
        // Best practice: NO revelar si existe o no. Para demo, devolvemos requestId si existe.
        var u = await _users.GetByEmailAsync(email.Trim());
        if (u is null) return null;
        if ((bool)u.IsActive == false) return null;

        var phone = (string)u.PhoneE164;

        var token = CryptoCompat.GenerateResetToken(); // se manda por SMS
        var salt = System.Security.Cryptography.RandomNumberGenerator.GetBytes(16);
        var tokenHash = CryptoCompat.Sha256Salted(salt, token);

        var (reqId, rc) = await _reset.CreateAsync(email.Trim(), salt, tokenHash, DateTime.UtcNow.AddMinutes(15));
        if (rc != 0 || reqId is null) return null;

        await _sms.SendAsync(phone, $"KORA: tu código para restablecer contraseña es {token}. Expira en 15 minutos.");

        return new PasswordResetRequestCreateResponse(reqId.Value, CryptoCompat.MaskPhone(phone), 15);
    }

    public async Task VerifyPasswordResetAsync(Guid requestId, string token)
    {
        var rc = await _reset.VerifyAsync(requestId, token);
        if (rc == 0) return;

        throw rc switch
        {
            1 => new InvalidOperationException("Token inválido."),
            2 => new InvalidOperationException("Token expirado."),
            3 => new InvalidOperationException("Demasiados intentos."),
            4 => new InvalidOperationException("Solicitud no existe."),
            5 => new InvalidOperationException("Solicitud ya usada."),
            _ => new InvalidOperationException("Error verificando solicitud.")
        };
    }

    public async Task CompletePasswordResetAsync(Guid requestId, string token, string newPassword)
    {
        var newHash = BCrypt.Net.BCrypt.HashPassword(newPassword);

        var rc = await _reset.CompleteAsync(requestId, token, newHash);
        if (rc == 0) return;

        throw rc switch
        {
            1 => new InvalidOperationException("Token inválido."),
            2 => new InvalidOperationException("Token expirado."),
            3 => new InvalidOperationException("Demasiados intentos."),
            4 => new InvalidOperationException("Solicitud no existe."),
            5 => new InvalidOperationException("Solicitud ya usada."),
            _ => new InvalidOperationException("Error completando restablecimiento.")
        };
    }
}