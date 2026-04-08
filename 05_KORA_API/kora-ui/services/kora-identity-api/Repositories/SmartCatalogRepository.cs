using System.Data;
using Dapper;
using kora_identity_api.Data;
using kora_identity_api.Dtos;

namespace kora_identity_api.Repositories;

public sealed class SmartCatalogRepository
{
    private readonly IDbConnectionFactory _db;
    public SmartCatalogRepository(IDbConnectionFactory db) => _db = db;

    public async Task<List<DriverGroupDto>> GetDriverGroupsAsync()
    {
        using var cn = _db.Create();
        var rows = await cn.QueryAsync<DriverGroupDto>(
            "Catalogs.UspDriverGroupList",
            commandType: CommandType.StoredProcedure);
        return rows.ToList();
    }

    public async Task<List<DriverDefinitionDto>> GetDriversAsync()
    {
        using var cn = _db.Create();
        var rows = await cn.QueryAsync<DriverDefinitionDto>(
            "Catalogs.UspDriverDefinitionList",
            commandType: CommandType.StoredProcedure);
        return rows.ToList();
    }

    public async Task<List<DriverOptionDto>> GetDriverOptionsAsync()
    {
        using var cn = _db.Create();
        var rows = await cn.QueryAsync<DriverOptionDto>(
            "Catalogs.UspDriverOptionList",
            commandType: CommandType.StoredProcedure);
        return rows.ToList();
    }
}
