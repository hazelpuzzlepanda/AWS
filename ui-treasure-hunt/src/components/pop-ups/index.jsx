import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const Modal = ({ open, onClose, onConfirm, title = '', body = '', primaryButtonText = '', secondaryButtonText = '' }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {body && (
        <DialogContent>
          <DialogContentText>{body}</DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        {secondaryButtonText && (
          <Button onClick={onClose} variant="outlined">
            {secondaryButtonText}
          </Button>
        )}
        {primaryButtonText && (
          <Button onClick={onConfirm} color="error" variant="contained">
            {primaryButtonText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
