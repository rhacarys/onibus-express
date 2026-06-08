using Microsoft.EntityFrameworkCore;
using OnibusExpress.Api.Models;

namespace OnibusExpress.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options) { }

    public DbSet<Rota> Rotas { get; set; }
    public DbSet<Viagem> Viagens { get; set; }
    public DbSet<Reserva> Reservas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Reserva>().ComplexProperty(r => r.Passageiro);

        // Popula apenas as Rotas.
        modelBuilder
            .Entity<Rota>()
            .HasData(
                new Rota
                {
                    Id = "1",
                    Origem = "Barueri",
                    Destino = "Campinas",
                    DuracaoEstimada = "01:30",
                },
                new Rota
                {
                    Id = "2",
                    Origem = "Campinas",
                    Destino = "Barueri",
                    DuracaoEstimada = "01:30",
                },
                new Rota
                {
                    Id = "3",
                    Origem = "Barueri",
                    Destino = "Sorocaba",
                    DuracaoEstimada = "01:15",
                },
                new Rota
                {
                    Id = "4",
                    Origem = "Sorocaba",
                    Destino = "Barueri",
                    DuracaoEstimada = "01:15",
                }
            );
    }
}
