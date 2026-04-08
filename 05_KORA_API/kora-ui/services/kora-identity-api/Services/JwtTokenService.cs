using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace kora_identity_api.Services;

public sealed class JwtTokenService
{
    private readonly string _key;
    private readonly string _issuer;
    private readonly string _audience;

    public JwtTokenService(IConfiguration cfg)
    {
        _key = cfg["Jwt:Key"] ?? throw new Exception("Missing Jwt:Key");
        _issuer = cfg["Jwt:Issuer"] ?? "kora-identity";
        _audience = cfg["Jwt:Audience"] ?? "kora-web";
    }

    public string CreateToken(string email, string fullName)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_key));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Email, email),
            new("name", fullName)
        };

        var token = new JwtSecurityToken(_issuer, _audience, claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}