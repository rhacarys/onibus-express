using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using OnibusExpress.Api.Data;
using OnibusExpress.Api.Models;

var builder = WebApplication.CreateBuilder(args);

const string connectionString = "Data Source=OnibusExpressDb;Mode=Memory;Cache=Shared";
var conexaoSqlite = new SqliteConnection(connectionString);
conexaoSqlite.Open();

// Configuração do Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "OniBus Express API",
            Version = "v1",
            Description = "API de Vendas de Passagens Rodoviárias",
        }
    );
});

builder.Services.AddCors(o =>
    o.AddDefaultPolicy(p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod())
);

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite(connectionString));

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "OniBus Express v1"));
app.UseCors();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
    DbSeeder.Seed(db);
}

var api = app.MapGroup("/api/v1");

api.MapGet(
        "/cidades",
        async (AppDbContext db) =>
        {
            var rotas = await db.Rotas.ToListAsync();
            return Results.Ok(
                new
                {
                    origens = rotas.Select(r => r.Origem).Distinct(),
                    destinos = rotas.Select(r => r.Destino).Distinct(),
                }
            );
        }
    )
    .WithTags("Rotas")
    .WithSummary("Lista todas as origens e destinos disponíveis");

api.MapGet(
        "/viagens",
        async (string origem, string destino, string data, AppDbContext db) =>
        {
            if (!DateTime.TryParse(data, out var dataFiltro))
                return Results.BadRequest();

            var rotas = await db
                .Rotas.Where(r => r.Origem == origem && r.Destino == destino)
                .ToListAsync();
            var rotaIds = rotas.Select(r => r.Id).ToList();

            var viagens = await db
                .Viagens.Where(v => rotaIds.Contains(v.RotaId) && v.Data.Date == dataFiltro.Date)
                .ToListAsync();

            return Results.Ok(
                viagens.Select(v => new ViagemDetalhada
                {
                    Id = v.Id,
                    RotaId = v.RotaId,
                    Data = v.Data,
                    Preco = v.Preco,
                    Capacidade = v.Capacidade,
                    Rota = rotas.First(r => r.Id == v.RotaId),
                    AssentosDisponiveis =
                        v.Capacidade
                        - db.Reservas.Where(res =>
                                res.ViagemId == v.Id && res.Status == "confirmada"
                            )
                            .Count(),
                })
            );
        }
    )
    .WithTags("Viagens")
    .WithSummary("Busca viagens filtrando por origem, destino e data exata");

api.MapGet(
        "/viagens/{id}",
        async (string id, AppDbContext db) =>
        {
            var viagem = await db.Viagens.FindAsync(id);
            if (viagem == null)
                return Results.NotFound();

            return Results.Ok(
                new ViagemDetalhada
                {
                    Id = viagem.Id,
                    RotaId = viagem.RotaId,
                    Data = viagem.Data,
                    Preco = viagem.Preco,
                    Capacidade = viagem.Capacidade,
                    Rota = (await db.Rotas.FindAsync(viagem.RotaId))!,
                    AssentosDisponiveis =
                        viagem.Capacidade
                        - await db
                            .Reservas.Where(r =>
                                r.ViagemId == viagem.Id && r.Status == "confirmada"
                            )
                            .CountAsync(),
                }
            );
        }
    )
    .WithTags("Viagens")
    .WithSummary("Obtém os detalhes de uma viagem específica e mapa de assentos");

api.MapGet(
        "/reservas",
        async (string? viagemId, string? codigoReserva, AppDbContext db) =>
        {
            if (!string.IsNullOrEmpty(codigoReserva))
            {
                var reserva = await db.Reservas.FirstOrDefaultAsync(r =>
                    r.CodigoReserva == codigoReserva.ToUpper()
                );
                return reserva != null
                    ? Results.Ok(new[] { reserva })
                    : Results.Ok(Array.Empty<Reserva>());
            }
            return !string.IsNullOrEmpty(viagemId)
                ? Results.Ok(await db.Reservas.Where(r => r.ViagemId == viagemId).ToListAsync())
                : Results.BadRequest();
        }
    )
    .WithTags("Reservas")
    .WithSummary("Consulta reservas por código verificador ou ID da viagem");

api.MapPost(
        "/reservas",
        async (CriarReservaDto dto, AppDbContext db) =>
        {
            if (
                await db.Reservas.AnyAsync(r =>
                    r.ViagemId == dto.ViagemId
                    && r.Assento == dto.Assento
                    && r.Status == "confirmada"
                )
            )
                return Results.Conflict(new { mensagem = "Assento ocupado" });

            var reserva = new Reserva
            {
                ViagemId = dto.ViagemId,
                Assento = dto.Assento,
                Passageiro = dto.Passageiro,
                CodigoReserva = $"ONB-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
            };
            db.Reservas.Add(reserva);
            await db.SaveChangesAsync();

            return Results.Created(
                $"/api/v1/reservas?codigoReserva={reserva.CodigoReserva}",
                reserva
            );
        }
    )
    .WithTags("Reservas")
    .WithSummary("Cria uma nova reserva validando a concorrência de assentos");

api.MapPatch(
        "/reservas/{id}",
        async (string id, AppDbContext db) =>
        {
            var reserva = await db.Reservas.FindAsync(id);
            if (reserva == null)
                return Results.NotFound();

            reserva.Status = "cancelada";
            await db.SaveChangesAsync();
            return Results.Ok(reserva);
        }
    )
    .WithTags("Reservas")
    .WithSummary("Cancela uma reserva existente alterando seu status");

app.Run();
