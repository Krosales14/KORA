using System.Security.Cryptography;
using System.Text;

namespace kora_identity_api.Repositories;

public static class CryptoCompat
{
    public static byte[] Sha256Salted(byte[] salt, string nvarcharValue)
    {
        var bytes = Encoding.Unicode.GetBytes(nvarcharValue);
        return SHA256.HashData(salt.Concat(bytes).ToArray());
    }

    public static string GenerateOtp6()
        => RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");

    public static string GenerateResetToken()
    {
        // 24 chars alfanumérico (<= 100)
        const string alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        var bytes = RandomNumberGenerator.GetBytes(24);
        var chars = bytes.Select(b => alphabet[b % alphabet.Length]).ToArray();
        return new string(chars);
    }

    public static string NormalizePhoneCR(string phone)
    {
        var digits = new string(phone.Where(char.IsDigit).ToArray());
        if (digits.Length == 8) return $"+506{digits}";
        if (digits.Length == 11 && digits.StartsWith("506")) return $"+{digits}";
        return phone.StartsWith("+") ? phone : $"+{digits}";
    }

    public static string MaskPhone(string e164)
    {
        var digits = new string(e164.Where(char.IsDigit).ToArray());
        if (digits.Length < 4) return e164;
        return $"+{digits[..3]}****{digits[^4..]}";
    }
}