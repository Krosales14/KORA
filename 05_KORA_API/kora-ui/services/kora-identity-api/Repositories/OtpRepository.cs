using System.Data;
using Dapper;
using kora_identity_api.Data;

namespace kora_identity_api.Repositories;

public sealed class OtpRepository
{
    private readonly IDbConnectionFactory _db;
    public OtpRepository(IDbConnectionFactory db) => _db = db;

    public async Task UpsertAsync(Guid verificationId, string phoneE164, byte[] salt, byte[] codeHash, DateTime expiresAtUtc)
    {
        using var cn = _db.Create();
        await cn.ExecuteAsync("Security.UspOtpUpsert",
            new { VerificationId = verificationId, PhoneE164 = phoneE164, Salt = salt, CodeHash = codeHash, ExpiresAtUtc = expiresAtUtc },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<int> VerifyAsync(Guid verificationId, string code)
    {
        using var cn = _db.Create();
        var dp = new DynamicParameters();
        dp.Add("VerificationId", verificationId);
        dp.Add("Code", code);
        dp.Add("ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await cn.ExecuteAsync("Security.UspOtpVerify", dp, commandType: CommandType.StoredProcedure);
        return dp.Get<int>("ResultCode");
    }
}