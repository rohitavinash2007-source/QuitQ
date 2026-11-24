using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuitQ.Api.Data;
using QuitQ.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Services to the container
builder.Services.AddControllers();

// 2. Configure Entity Framework Core (SQL Server with automatic In-Memory fallback)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
    ?? "Server=(localdb)\\mssqllocaldb;Database=QuitQDb;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True";

bool useSqlServer = false;
try
{
    using var testConn = new Microsoft.Data.SqlClient.SqlConnection(connectionString);
    testConn.Open();
    useSqlServer = true;
    Console.WriteLine("[QuitQ] Connected to Microsoft SQL Server successfully.");
}
catch
{
    Console.WriteLine("[QuitQ] SQL Server not detected on local port. Using In-Memory Provider for API operations.");
}

builder.Services.AddDbContext<QuitQDbContext>(options =>
{
    if (useSqlServer)
    {
        options.UseSqlServer(connectionString, sqlOptions =>
        {
            sqlOptions.EnableRetryOnFailure(3, TimeSpan.FromSeconds(5), null);
        });
    }
    else
    {
        options.UseInMemoryDatabase("QuitQDb");
    }
});

// 3. Register Custom Application Services
builder.Services.AddScoped<IPasswordHasher, PasswordHasher>();
builder.Services.AddScoped<IJwtService, JwtService>();

// 4. Configure JWT Authentication
var secretKey = builder.Configuration["JwtSettings:Secret"] ?? "QuitQ_Ultra_Secret_Key_For_Jwt_Authentication_Hexaware_Case_Study_2026_Secure_Key";
var issuer = builder.Configuration["JwtSettings:Issuer"] ?? "QuitQ.Api";
var audience = builder.Configuration["JwtSettings:Audience"] ?? "QuitQ.Client";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

// 5. Configure CORS (allow all localhost origins & credentials)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllLocalhost", policy =>
    {
        policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// 6. Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 7. Auto-create database & Seed initial mock data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<QuitQDbContext>();
        var hasher = services.GetRequiredService<IPasswordHasher>();
        DbInitializer.Initialize(context, hasher);
        Console.WriteLine("[QuitQ] Database initialized and seeded with mock data successfully.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[QuitQ Database Init Error] {ex.Message}");
    }
}

// 8. Configure HTTP Pipeline
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "QuitQ API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAllLocalhost");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
