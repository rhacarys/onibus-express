import { validarCPF } from "@/utils/cpfValidator";
import { z } from "zod";

export const PassageiroSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z
    .string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 11, "CPF deve conter 11 dígitos")
    .refine(validarCPF, "CPF inválido"),
  email: z.email("E-mail inválido"),
  dataNascimento: z.iso.date("Data de nascimento inválida"),
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

export type Passageiro = z.infer<typeof PassageiroSchema>;
export type Reserva = z.infer<typeof ReservaSchema>;
export type CriarReservaDTO = z.infer<typeof CriarReservaDTOSchema>;
