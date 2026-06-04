import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

interface CancelarReservaDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function CancelarReservaDialog({ open, onClose, onConfirm }: CancelarReservaDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Confirmar Cancelamento</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Tem certeza que deseja cancelar esta passagem? Esta ação não poderá ser desfeita.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Voltar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
          Confirmar Cancelamento
        </Button>
      </DialogActions>
    </Dialog>
  );
}
