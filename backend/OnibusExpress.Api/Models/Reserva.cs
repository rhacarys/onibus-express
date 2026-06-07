namespace OnibusExpress.Api.Models;

public class Reserva
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string ViagemId { get; set; } = string.Empty;
    public int Assento { get; set; }
    public Passageiro Passageiro { get; set; } = new();
    public string Status { get; set; } = "confirmada";
    public string CodigoReserva { get; set; } = string.Empty;
}

// DTO para a criação da reserva
public class CriarReservaDto
{
    public string ViagemId { get; set; } = string.Empty;
    public int Assento { get; set; }
    public Passageiro Passageiro { get; set; } = new();
}
