using System.Text;
using kora_identity_api.Data;
using kora_identity_api.Dtos;
using kora_identity_api.Repositories;
using kora_identity_api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("dev-cors", p =>
        p.WithOrigins("http://localhost:5173")
         .AllowAnyHeader()
         .AllowAnyMethod());
});

// =========================
// DI
// =========================
builder.Services.AddSingleton<IDbConnectionFactory, SqlConnectionFactory>();

// Identity / Users
builder.Services.AddSingleton<CatalogRepository>();
builder.Services.AddSingleton<UserRepository>();
builder.Services.AddSingleton<OtpRepository>();
builder.Services.AddSingleton<PasswordResetRepository>();
builder.Services.AddSingleton<JwtTokenService>();
builder.Services.AddSingleton<ISmsSender, ConsoleSmsSender>(); // DEV
builder.Services.AddSingleton<AuthService>();

// KORA Smart
builder.Services.AddSingleton<SmartCatalogRepository>();
builder.Services.AddSingleton<SmartProjectRepository>();

// =========================
// JWT
// =========================
var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new Exception("Missing Jwt:Key");
var issuer = builder.Configuration["Jwt:Issuer"] ?? "kora-identity";
var audience = builder.Configuration["Jwt:Audience"] ?? "kora-web";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(o =>
  {
      o.TokenValidationParameters = new TokenValidationParameters
      {
          ValidateIssuer = true,
          ValidIssuer = issuer,
          ValidateAudience = true,
          ValidAudience = audience,
          ValidateIssuerSigningKey = true,
          IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
          ValidateLifetime = true,
          ClockSkew = TimeSpan.FromMinutes(1)
      };
  });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors("dev-cors");
app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthentication();
app.UseAuthorization();

// =========================
// Catalog/Location (existente)
// =========================
app.MapGet("/catalog/categories", async (CatalogRepository r) => await r.CategoryListAsync());
app.MapGet("/geo/provinces", async (CatalogRepository r) => await r.ProvinceListAsync());
app.MapGet("/geo/cantons", async (string provinceId, CatalogRepository r) => await r.CantonListByProvinceAsync(provinceId));
app.MapGet("/geo/districts", async (string provinceId, string cantonId, CatalogRepository r) => await r.DistrictListByCantonAsync(provinceId, cantonId));

// =========================
// Auth (existente)
// =========================
app.MapPost("/auth/register", async (RegisterRequest req, AuthService auth) =>
{
    try { return Results.Ok(await auth.RegisterAsync(req)); }
    catch (InvalidOperationException ex) { return Results.BadRequest(new { message = ex.Message }); }
});

app.MapPost("/auth/verify", async (VerifyOtpRequest req, AuthService auth) =>
{
    try { await auth.VerifyOtpAsync(req); return Results.Ok(new { status = "verified" }); }
    catch (InvalidOperationException ex) { return Results.BadRequest(new { message = ex.Message }); }
});

app.MapPost("/auth/login", async (LoginRequest req, AuthService auth) =>
{
    try { return Results.Ok(await auth.LoginAsync(req)); }
    catch { return Results.Unauthorized(); }
});

// Forgot password (SMS)
app.MapPost("/auth/password-reset/request", async (PasswordResetRequestCreate req, AuthService auth) =>
{
    var result = await auth.CreatePasswordResetAsync(req.Email);

    // Respuesta genérica si no existe (evita enumeración)
    if (result is null)
        return Results.Ok(new { status = "ok" });

    return Results.Ok(result);
});

app.MapPost("/auth/password-reset/verify", async (PasswordResetVerifyRequest req, AuthService auth) =>
{
    try { await auth.VerifyPasswordResetAsync(req.PasswordResetRequestId, req.ResetToken); return Results.Ok(new { status = "valid" }); }
    catch (InvalidOperationException ex) { return Results.BadRequest(new { message = ex.Message }); }
});

app.MapPost("/auth/password-reset/complete", async (PasswordResetCompleteRequest req, AuthService auth) =>
{
    try { await auth.CompletePasswordResetAsync(req.PasswordResetRequestId, req.ResetToken, req.NewPassword); return Results.Ok(new { status = "ok" }); }
    catch (InvalidOperationException ex) { return Results.BadRequest(new { message = ex.Message }); }
});

// =========================
// KORA Smart  →  /api/*
// =========================
var api = app.MapGroup("/api");

// Catalog Drivers
api.MapGet("/catalog/driver-groups", async (SmartCatalogRepository r) =>
{
    var rows = await r.GetDriverGroupsAsync();
    return Results.Ok(rows);
});

api.MapGet("/catalog/drivers", async (SmartCatalogRepository r) =>
{
    var rows = await r.GetDriversAsync();
    return Results.Ok(rows);
});

api.MapGet("/catalog/driver-options", async (SmartCatalogRepository r) =>
{
    var rows = await r.GetDriverOptionsAsync();
    return Results.Ok(rows);
});

// Projects
api.MapPost("/projects", async (ProjectCreateRequest req, SmartProjectRepository r) =>
{
    if (string.IsNullOrWhiteSpace(req.ProjectName))
        return Results.BadRequest(new { message = "ProjectName requerido." });

    var created = await r.CreateProjectWithInitialVersionAsync(req, ownerUserId: null, createdBy: "kora-ui");
    return Results.Ok(created);
});

api.MapGet("/projects/{id:guid}", async (Guid id, SmartProjectRepository r) =>
{
    var result = await r.GetProjectByIdAsync(id);
    return result is null ? Results.NotFound() : Results.Ok(result);
});

// Versions
api.MapPost("/project-versions", async (ProjectVersionCreateRequest req, SmartProjectRepository r) =>
{
    var created = await r.CreateProjectVersionAsync(req, createdBy: "kora-ui");
    return Results.Ok(created);
});

api.MapGet("/project-versions/{id:guid}/drivers", async (Guid id, SmartProjectRepository r) =>
{
    var rows = await r.GetProjectVersionDriversAsync(id);
    return Results.Ok(rows);
});

// Driver values (POST + PUT)
api.MapPost("/project-driver-values", async (ProjectDriverValuesUpsertRequest req, SmartProjectRepository r) =>
{
    await r.UpsertDriverValuesAsync(req, capturedBy: "kora-ui");
    return Results.Ok(new { status = "ok" });
});

api.MapPut("/project-driver-values", async (ProjectDriverValuesUpsertRequest req, SmartProjectRepository r) =>
{
    await r.UpsertDriverValuesAsync(req, capturedBy: "kora-ui");
    return Results.Ok(new { status = "ok" });
});

// Health
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();