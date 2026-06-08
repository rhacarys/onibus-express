import type { Reserva, Rota, ViagemDetalhada } from "@/types";
import { http, HttpResponse } from "msw";

const rotas: Rota[] = [
  { id: "1", origem: "Barueri", destino: "Campinas", duracaoEstimada: "01:30" },
  { id: "2", origem: "Campinas", destino: "Barueri", duracaoEstimada: "01:30" },
  { id: "3", origem: "Barueri", destino: "Sorocaba", duracaoEstimada: "01:15" },
  { id: "4", origem: "Sorocaba", destino: "Barueri", duracaoEstimada: "01:15" },
  { id: "5", origem: "Barueri", destino: "Campinas", duracaoEstimada: "01:30" },
  { id: "6", origem: "Campinas", destino: "Barueri", duracaoEstimada: "01:30" },
];

const viagensTemplate = [
  { id: "101", rotaId: "1", horaPartida: "06:00:00Z", preco: 45.0, capacidade: 46 },
  { id: "102", rotaId: "2", horaPartida: "09:30:00Z", preco: 45.0, capacidade: 46 },
  { id: "103", rotaId: "3", horaPartida: "13:00:00Z", preco: 38.5, capacidade: 46 },
  { id: "104", rotaId: "4", horaPartida: "16:15:00Z", preco: 38.5, capacidade: 46 },
  { id: "105", rotaId: "5", horaPartida: "20:00:00Z", preco: 53.0, capacidade: 42 },
  { id: "106", rotaId: "6", horaPartida: "23:30:00Z", preco: 53.0, capacidade: 42 },
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
    const data = url.searchParams.get("data");

    const resultado: ViagemDetalhada[] = viagensTemplate
      .map((v) => {
        const rotaCompleta = rotas.find((r) => r.id === v.rotaId)!;
        const dataSimulada = data ? `${data}T${v.horaPartida}` : `2026-06-03T${v.horaPartida}`;

        const assentosOcupadosCount = reservas.filter((r) => r.viagemId === v.id && r.status === "confirmada").length;

        return {
          id: v.id,
          rotaId: v.rotaId,
          preco: v.preco,
          capacidade: v.capacidade,
          assentosDisponiveis: v.capacidade - assentosOcupadosCount,
          data: dataSimulada,
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
    const assentosOcupadosCount = reservas.filter((r) => r.viagemId === id && r.status === "confirmada").length;

    return HttpResponse.json({
      id: template.id,
      rotaId: template.rotaId,
      preco: template.preco,
      capacidade: template.capacidade,
      assentosDisponiveis: template.capacidade - assentosOcupadosCount,
      data: `2026-06-15T${template.horaPartida}`,
      rota,
    });
  }),

  // GET /api/v1/reservas
  http.get("/api/v1/reservas", ({ request }) => {
    const url = new URL(request.url);
    const viagemId = url.searchParams.get("viagemId");
    const codigoReserva = url.searchParams.get("codigoReserva");

    if (codigoReserva) {
      const filtrado = reservas.filter((r) => r.codigoReserva === codigoReserva.toUpperCase());
      return HttpResponse.json(filtrado);
    }

    const filtrado = reservas.filter((r) => r.viagemId === viagemId);
    return HttpResponse.json(filtrado);
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

  // PATCH /api/v1/reservas/:id
  http.patch("/api/v1/reservas/:id", async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as { status: "confirmada" | "cancelada" };

    const index = reservas.findIndex((r) => r.id === id);
    if (index === -1) return new HttpResponse(null, { status: 404 });

    reservas[index] = { ...reservas[index], status: body.status };
    return HttpResponse.json(reservas[index]);
  }),
];
