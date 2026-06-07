namespace OnibusExpress.Api.Models;

public class Rota
{
    public string Id { get; set; } = string.Empty;
    public string Origem { get; set; } = string.Empty;
    public string Destino { get; set; } = string.Empty;
    public string DuracaoEstimada { get; set; } = string.Empty;
}
