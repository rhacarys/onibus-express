import { z } from "zod";

export const BuscaFormSchema = z.object({
  origem: z.string().min(1, "Origem é obrigatória"),
  destino: z.string().min(1, "Destino é obrigatório"),
  dataIda: z.string().min(1, "Data de ida é obrigatória"),
});

export type BuscaFormInput = z.infer<typeof BuscaFormSchema>;
