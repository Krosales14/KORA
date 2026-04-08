using System.Data;
using Dapper;
using kora_identity_api.Data;

namespace kora_identity_api.Repositories;

public sealed class PasswordResetRepository
{
    private readonly IDbConnectionFactory _db;
    public PasswordResetRepository(IDbConnectionFactory db) => _db = db;

    public async Task<(Guid? requestId, int resultCode)> CreateAsync(string email, byte[] salt, byte[] tokenHash, DateTime expiresAtUtc)
    {
        using var cn = _db.Create();

        var dp = new DynamicParameters();
        dp.Add("Email", email);
        dp.Add("Salt", salt, DbType.Binary, size: 16);
        dp.Add("ResetTokenHash", tokenHash, DbType.Binary, size: 32);
        dp.Add("ExpiresAtUtc", expiresAtUtc);

        dp.Add("PasswordResetRequestId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        dp.Add("ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await cn.ExecuteAsync("Security.UspPasswordResetRequestCreate", dp, commandType: CommandType.StoredProcedure);
        return (dp.Get<Guid?>("PasswordResetRequestId"), dp.Get<int>("ResultCode"));
    }

    public async Task<int> VerifyAsync(Guid requestId, string token)
    {
        using var cn = _db.Create();

        var dp = new DynamicParameters();
        dp.Add("PasswordResetRequestId", requestId);
        dp.Add("ResetToken", token);
        dp.Add("ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await cn.ExecuteAsync("Security.UspPasswordResetRequestVerify", dp, commandType: CommandType.StoredProcedure);
        return dp.Get<int>("ResultCode");
    }

    public async Task<int> CompleteAsync(Guid requestId, string token, string newPasswordHash)
    {
        using var cn = _db.Create();

        var dp = new DynamicParameters();
        dp.Add("PasswordResetRequestId", requestId);
        dp.Add("ResetToken", token);
        dp.Add("NewPasswordHash", newPasswordHash);
        dp.Add("ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await cn.ExecuteAsync("Security.UspPasswordResetComplete", dp, commandType: CommandType.StoredProcedure);
        return dp.Get<int>("ResultCode");
    }
}