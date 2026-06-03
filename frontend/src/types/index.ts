import { z } from "zod";

// TODO: melhorar a validação do CPF com .refine()
const cpfRegex = /^\d{11}$/;

export const RotaSchema = z.object({
  id: z.string(),
  origem: z.string(),
  destino: z.string(),
  duracaoEstimada: z.string(),
});

export const ViagemSchema = z.object({
  id: z.string(),
  rotaId: z.string(),
  dataPartida: z.string().datetime(),
  preco: z.number().positive(),
  capacidade: z.number().int().positive(),
  assentosDisponiveis: z.number().int().nonnegative(),
});

export const ViagemDetalhadaSchema = ViagemSchema.extend({
  rota: RotaSchema,
});

export const PassageiroSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().regex(cpfRegex, "CPF deve conter 11 dígitos numéricos"),
  email: z.string().email("E-mail inválido"),
  dataNascimento: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data de nascimento inválida",
  }),
});

export const ReservaSchema = z.object({
  id: z.string(),
  viagemId: z.string(),
  passageiro: PassageiroSchema,
  assento: z.number().int().positive(),
  status: z.enum(["confirmada", "cancelada"]),
  codigoReserva: z.string(),
});

export const CriarReservaDTOSchema = ReservaSchema.omit({
  id: true,
  status: true,
  codigoReserva: true,
});

export type Rota = z.infer<typeof RotaSchema>;
export type Viagem = z.infer<typeof ViagemSchema>;
export type ViagemDetalhada = z.infer<typeof ViagemDetalhadaSchema>;
export type Passageiro = z.infer<typeof PassageiroSchema>;
export type Reserva = z.infer<typeof ReservaSchema>;
export type CriarReservaDTO = z.infer<typeof CriarReservaDTOSchema>;
