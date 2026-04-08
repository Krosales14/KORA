using System.Data;
using Dapper;
using kora_identity_api.Data;

namespace kora_identity_api.Repositories;

public sealed class CatalogRepository
{
    private readonly IDbConnectionFactory _db;
    public CatalogRepository(IDbConnectionFactory db) => _db = db;

    public async Task<IEnumerable<dynamic>> CategoryListAsync()
    {
        using var cn = _db.Create();
        return await cn.QueryAsync("Catalogs.UspCategoryList", commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<dynamic>> ProvinceListAsync()
    {
        using var cn = _db.Create();
        return await cn.QueryAsync("Location.UspProvinceList", commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<dynamic>> CantonListByProvinceAsync(string provinceId)
    {
        using var cn = _db.Create();
        return await cn.QueryAsync("Location.UspCantonListByProvince",
            new { ProvinceId = provinceId },
            commandType: CommandType.StoredProcedure);
    }

    public async Task<IEnumerable<dynamic>> DistrictListByCantonAsync(string provinceId, string cantonId)
    {
        using var cn = _db.Create();
        return await cn.QueryAsync("Location.UspDistrictListByCanton",
            new { ProvinceId = provinceId, CantonId = cantonId },
            commandType: CommandType.StoredProcedure);
    }
}