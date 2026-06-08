namespace OnibusExpress.Api.Models;

public class Viagem
{
    public string Id { get; set; } = string.Empty;
    public string RotaId { get; set; } = string.Empty;
    public DateTime Data { get; set; }
    public decimal Preco { get; set; }
    public int Capacidade { get; set; }
    public int AssentosDisponiveis { get; set; }
}

public class ViagemDetalhada : Viagem
{
    public Rota Rota { get; set; } = new();
}
