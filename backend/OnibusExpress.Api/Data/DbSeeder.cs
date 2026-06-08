using OnibusExpress.Api.Models;

namespace OnibusExpress.Api.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext db)
    {
        db.Database.EnsureCreated();

        if (db.Viagens.Any())
            return;

        var hoje = DateTime.Today;
        var contadorId = 200;

        // Gera viagens dinamicamente para os próximos 7 dias
        for (int i = 1; i <= 7; i++)
        {
            var dataAlvo = hoje.AddDays(i);

            // Opção 1: Rota 1 (Barueri x Campinas) na parte da manhã
            db.Viagens.Add(
                new Viagem
                {
                    Id = (contadorId++).ToString(),
                    RotaId = "1",
                    Data = dataAlvo.AddHours(7).AddMinutes(30), // 07:30h
                    Preco = 45.00m,
                    Capacidade = 46,
                }
            );

            // Opção 2: Rota 2 (Campinas x Barueri) na parte da tarde
            db.Viagens.Add(
                new Viagem
                {
                    Id = (contadorId++).ToString(),
                    RotaId = "2",
                    Data = dataAlvo.AddHours(14).AddMinutes(0), // 14:00h
                    Preco = 45.00m,
                    Capacidade = 46,
                }
            );

            // Opção 3: Rota 3 (Barueri x Sorocaba) à noite (Disponível em dias alternados)
            if (i % 2 == 0)
            {
                db.Viagens.Add(
                    new Viagem
                    {
                        Id = (contadorId++).ToString(),
                        RotaId = "3",
                        Data = dataAlvo.AddHours(19).AddMinutes(15), // 19:15h
                        Preco = 53.00m,
                        Capacidade = 42,
                    }
                );
            }
        }
        db.SaveChanges();
    }
}
