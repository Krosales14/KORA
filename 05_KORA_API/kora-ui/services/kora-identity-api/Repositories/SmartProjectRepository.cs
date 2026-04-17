using System.Data;
using Dapper;
using kora_identity_api.Data;
using kora_identity_api.Dtos;
using Microsoft.Data.SqlClient;

namespace kora_identity_api.Repositories;

public sealed class SmartProjectRepository
{
    private readonly IDbConnectionFactory _db;
    public SmartProjectRepository(IDbConnectionFactory db) => _db = db;

    public async Task<ProjectCreateResponse> CreateProjectWithInitialVersionAsync(ProjectCreateRequest req, Guid? ownerUserId, string? createdBy)
    {
        using var cn = _db.Create();

        var dp = new DynamicParameters();
        dp.Add("ProjectName", req.ProjectName);
        dp.Add("ProjectDescription", req.ProjectDescription);
        dp.Add("OwnerUserId", ownerUserId);
        dp.Add("CreatedBy", createdBy);

        dp.Add("ProjectId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        dp.Add("ProjectVersionId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        dp.Add("ProjectCode", dbType: DbType.String, size: 30, direction: ParameterDirection.Output);

        await cn.ExecuteAsync("Projects.UspProjectCreateWithInitialVersion", dp, commandType: CommandType.StoredProcedure);

        return new ProjectCreateResponse(
            dp.Get<Guid>("ProjectId"),
            dp.Get<Guid>("ProjectVersionId"),
            dp.Get<string>("ProjectCode")
        );
    }

    public async Task<ProjectGetResponse?> GetProjectByIdAsync(Guid projectId)
    {
        using var cn = _db.Create();
        using var multi = await cn.QueryMultipleAsync(
            "Projects.UspProjectGetById",
            new { ProjectId = projectId },
            commandType: CommandType.StoredProcedure);

        var project = await multi.ReadFirstOrDefaultAsync<ProjectDto>();
        if (project is null) return null;

        var versions = (await multi.ReadAsync<ProjectVersionDto>()).ToList();
        return new ProjectGetResponse(project, versions);
    }

    public async Task<ProjectVersionCreateResponse> CreateProjectVersionAsync(ProjectVersionCreateRequest req, string? createdBy)
    {
        using var cn = _db.Create();

        var dp = new DynamicParameters();
        dp.Add("ProjectId", req.ProjectId);
        dp.Add("CreatedBy", createdBy);

        dp.Add("ProjectVersionId", dbType: DbType.Guid, direction: ParameterDirection.Output);
        dp.Add("VersionNumber", dbType: DbType.Int32, direction: ParameterDirection.Output);

        await cn.ExecuteAsync("Projects.UspProjectVersionCreate", dp, commandType: CommandType.StoredProcedure);

        return new ProjectVersionCreateResponse(dp.Get<Guid>("ProjectVersionId"), dp.Get<int>("VersionNumber"));
    }

    public async Task<List<ProjectVersionDriverRowDto>> GetProjectVersionDriversAsync(Guid projectVersionId)
    {
        using var cn = _db.Create();
        var rows = await cn.QueryAsync<ProjectVersionDriverRowDto>(
            "Projects.UspProjectVersionDriversGet",
            new { ProjectVersionId = projectVersionId },
            commandType: CommandType.StoredProcedure);

        return rows.ToList();
    }

    public async Task UpsertDriverValuesAsync(ProjectDriverValuesUpsertRequest req, string? capturedBy)
    {
        using var cnSql = (SqlConnection)_db.Create();
        await cnSql.OpenAsync();
        using var tx = await cnSql.BeginTransactionAsync();

        try
        {
            foreach (var v in req.Values)
            {
                await cnSql.ExecuteAsync(
                    "Projects.UspProjectDriverValueUpsert",
                    new
                    {
                        ProjectVersionId = req.ProjectVersionId,
                        DriverDefinitionId = v.DriverDefinitionId,
                        v.TextValue,
                        v.NumericValue,
                        v.BooleanValue,
                        DateValue = v.DateValue?.Date,
                        v.JsonValue,
                        v.SelectedOptionCode,
                        CapturedBy = capturedBy
                    },
                    transaction: tx,
                    commandType: CommandType.StoredProcedure
                );
            }

            await tx.CommitAsync();
        }
        catch
        {
            await tx.RollbackAsync();
            throw;
        }


    }

    public async Task<List<ProjectDto>> ListProjectsAsync(int skip = 0, int take = 200)
    {
        using var cn = _db.Create();
        var rows = await cn.QueryAsync<ProjectDto>(
            "Projects.UspProjectList",
            new { Skip = skip, Take = take },
            commandType: CommandType.StoredProcedure);

        return rows.ToList();
    }

    public async Task<List<ProjectVersionDto>> ListProjectVersionsAsync(Guid? projectId = null, int skip = 0, int take = 200)
    {
        using var cn = _db.Create();
        var rows = await cn.QueryAsync<ProjectVersionDto>(
            "Projects.UspProjectVersionList",
            new { ProjectId = projectId, Skip = skip, Take = take },
            commandType: CommandType.StoredProcedure);

        return rows.ToList();
    }

    public async Task<List<dynamic>> ListProjectDriverValuesAsync(Guid? projectVersionId = null, int skip = 0, int take = 300)
    {
        using var cn = _db.Create();
        var rows = await cn.QueryAsync(
            "Projects.UspProjectDriverValuesList",
            new { ProjectVersionId = projectVersionId, Skip = skip, Take = take },
            commandType: CommandType.StoredProcedure);

        return rows.ToList();
    }
}
