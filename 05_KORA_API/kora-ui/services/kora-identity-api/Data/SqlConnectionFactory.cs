using System.Data;
using Microsoft.Data.SqlClient;

namespace kora_identity_api.Data;

public interface IDbConnectionFactory
{
    IDbConnection Create();
}

public sealed class SqlConnectionFactory : IDbConnectionFactory
{
    private readonly string _cs;

    public SqlConnectionFactory(IConfiguration cfg)
        => _cs = cfg.GetConnectionString("KoraDb")
           ?? throw new Exception("Missing connection string: KoraDb");

    public IDbConnection Create() => new SqlConnection(_cs);
}