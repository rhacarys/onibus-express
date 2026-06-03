import type { Reserva, Rota, ViagemDetalhada } from "@/types";
import { http, HttpResponse } from "msw";

const rotas: Rota[] = [
  { id: "1", origem: "Barueri", destino: "Campinas", duracaoEstimada: "01:30" },
  { id: "2", origem: "Campinas", destino: "Barueri", duracaoEstimada: "01:30" },
  { id: "3", origem: "Barueri", destino: "Sorocaba", duracaoEstimada: "01:15" },
  { id: "4", origem: "Sorocaba", destino: "Barueri", duracaoEstimada: "01:15" },
  { id: "5", origem: "Campinas", destino: "Sorocaba", duracaoEstimada: "01:45" },
  { id: "6", origem: "Sorocaba", destino: "Campinas", duracaoEstimada: "01:45" },
];

const viagensTemplate = [
  { id: "101", rotaId: "1", horaPartida: "06:00:00Z", preco: 45.0, capacidade: 46 },
  { id: "102", rotaId: "2", horaPartida: "09:30:00Z", preco: 45.0, capacidade: 46 },
  { id: "103", rotaId: "3", horaPartida: "13:00:00Z", preco: 38.5, capacidade: 46 },
  { id: "104", rotaId: "4", horaPartida: "16:15:00Z", preco: 38.5, capacidade: 46 },
  { id: "105", rotaId: "5", horaPartida: "19:00:00Z", preco: 52.0, capacidade: 46 },
  { id: "106", rotaId: "6", horaPartida: "21:45:00Z", preco: 52.0, capacidade: 46 },
];

const reservas: Reserva[] = [];

export const handlers = [
  // GET /api/v1/cidades
  http.get("/api/v1/cidades", () => {
    return HttpResponse.json({
      origens: ["Barueri", "Campinas", "Sorocaba"],
      destinos: ["Barueri", "Campinas", "Sorocaba"],
    });
  }),

  // GET /api/v1/viagens
  http.get("/api/v1/viagens", ({ request }) => {
    const url = new URL(request.url);
    const origem = url.searchParams.get("origem")?.toLowerCase();
    const destino = url.searchParams.get("destino")?.toLowerCase();
    const dataPartida = url.searchParams.get("dataPartida"); // Formato YYYY-MM-DD

    const resultado: ViagemDetalhada[] = viagensTemplate
      .map((v) => {
        const rotaCompleta = rotas.find((r) => r.id === v.rotaId)!;
        // Injeta dinamicamente o dia buscado na string de partida para simular o comportamento diário
        const dataPartidaSimulada = dataPartida ? `${dataPartida}T${v.horaPartida}` : `2026-06-03T${v.horaPartida}`;

        return {
          id: v.id,
          rotaId: v.rotaId,
          preco: v.preco,
          capacidade: v.capacidade,
          assentosDisponiveis: v.capacidade - reservas.filter((r) => r.viagemId === v.id).length,
          dataPartida: dataPartidaSimulada,
          rota: rotaCompleta,
        };
      })
      .filter((v) => {
        const matchOrigem = origem ? v.rota.origem.toLowerCase() === origem : true;
        const matchDestino = destino ? v.rota.destino.toLowerCase() === destino : true;
        return matchOrigem && matchDestino;
      });

    return HttpResponse.json(resultado);
  }),

  // GET /api/v1/viagens/:id
  http.get("/api/v1/viagens/:id", ({ params }) => {
    const { id } = params;
    const template = viagensTemplate.find((v) => v.id === id);
    if (!template) return new HttpResponse(null, { status: 404 });

    const rota = rotas.find((r) => r.id === template.rotaId)!;
    return HttpResponse.json({
      id: template.id,
      rotaId: template.rotaId,
      preco: template.preco,
      capacidade: template.capacidade,
      assentosDisponiveis: template.capacidade - reservas.filter((r) => r.viagemId === id).length,
      dataPartida: `2026-06-15T${template.horaPartida}`,
      rota,
    });
  }),

  // GET /api/v1/reservas
  http.get("/api/v1/reservas", ({ request }) => {
    const url = new URL(request.url);
    const viagemId = url.searchParams.get("viagemId");
    const resultado = reservas.filter((r) => r.viagemId === viagemId);
    return HttpResponse.json(resultado);
  }),

  // POST /api/v1/reservas
  http.post("/api/v1/reservas", async ({ request }) => {
    const body = (await request.json()) as Omit<Reserva, "id" | "status" | "codigoReserva">;
    const novaReserva: Reserva = {
      id: crypto.randomUUID(),
      ...body,
      status: "confirmada",
      codigoReserva: `ONB-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    };
    reservas.push(novaReserva);
    return HttpResponse.json(novaReserva, { status: 201 });
  }),
];
