import { Button } from "@mui/material";
import { memo } from "react";

interface AssentoItemProps {
  numero: number;
  isOcupado: boolean;
  isSelecionado: boolean;
  onSelect: (numero: number) => void;
}

export const AssentoItem = memo(
  function AssentoItem({ numero, isOcupado, isSelecionado, onSelect }: AssentoItemProps) {
    let statusAcessibilidade = "Livre";
    if (isOcupado) statusAcessibilidade = "Ocupado";
    if (isSelecionado) statusAcessibilidade = "Selecionado";

    return (
      <Button
        aria-label={`Poltrona ${numero}, ${statusAcessibilidade}`}
        aria-pressed={isSelecionado}
        variant={isSelecionado ? "contained" : "outlined"}
        color={isOcupado ? "inherit" : isSelecionado ? "primary" : "success"}
        disabled={isOcupado}
        onClick={() => onSelect(numero)}
        sx={{ minWidth: "45px", height: "55px", fontWeight: "bold" }}
      >
        {numero}
      </Button>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.isOcupado === nextProps.isOcupado && prevProps.isSelecionado === nextProps.isSelecionado;
  },
);
