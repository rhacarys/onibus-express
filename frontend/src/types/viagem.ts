import { z } from "zod";

export const RotaSchema = z.object({
  id: z.string(),
  origem: z.string(),
  destino: z.string(),
  duracaoEstimada: z.string(),
});

export const ViagemSchema = z.object({
  id: z.string(),
  rotaId: z.string(),
  dataPartida: z.iso.datetime(),
  preco: z.number().positive(),
  capacidade: z.number().int().positive(),
  assentosDisponiveis: z.number().int().nonnegative(),
});

export const ViagemDetalhadaSchema = ViagemSchema.extend({
  rota: RotaSchema,
});

export type Rota = z.infer<typeof RotaSchema>;
export type Viagem = z.infer<typeof ViagemSchema>;
export type ViagemDetalhada = z.infer<typeof ViagemDetalhadaSchema>;
