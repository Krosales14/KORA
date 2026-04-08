using System.Data;
using Dapper;
using kora_identity_api.Data;

namespace kora_identity_api.Repositories;

public sealed class UserRepository
{
    private readonly IDbConnectionFactory _db;
    public UserRepository(IDbConnectionFactory db) => _db = db;

    public async Task<(Guid? userId, int resultCode)> RegisterAsync(object p)
    {
        using var cn = _db.Create();

        var dp = new DynamicParameters(p);
        dp.Add("UserId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        dp.Add("ResultCode", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await cn.ExecuteAsync("Security.UspUserRegister", dp, commandType: CommandType.StoredProcedure);

        return (dp.Get<Guid?>("UserId"), dp.Get<int>("ResultCode"));
    }

    public async Task<dynamic?> GetByEmailAsync(string email)
    {
        using var cn = _db.Create();
        return await cn.QueryFirstOrDefaultAsync("Security.UspUserGetByEmail",
            new { Email = email },
            commandType: CommandType.StoredProcedure);
    }
}