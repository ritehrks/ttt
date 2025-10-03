import React, { useState } from 'react';
import {
  Fab,
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Divider,
} from '@mui/material';
import { UploadFile as UploadFileIcon, Close as CloseIcon } from '@mui/icons-material';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export const DataUploader: React.FC = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Fab
        variant="extended"
        color="primary"
        aria-label="upload data"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          borderRadius: '16px',
          boxShadow: '0 6px 14px rgba(0,0,0,0.25)',
          textTransform: 'none',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 18px rgba(0,0,0,0.3)',
          },
        }}
      >
        <UploadFileIcon sx={{ mr: 1 }} />
        Upload Data
      </Fab>


      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="data-upload-modal-title"
      >
        <Paper sx={modalStyle}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography id="data-upload-modal-title" variant="h6" component="h2">
              Upload Water Quality Data
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box component="form" noValidate autoComplete="off">
            <TextField fullWidth label="Location ID" margin="normal" />
            <TextField fullWidth label="Date of Sample" type="date" InputLabelProps={{ shrink: true }} margin="normal" />
            <TextField fullWidth label="HMPI Value" type="number" margin="normal" />
            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              Upload CSV File
              <input type="file" hidden accept=".csv" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Submit Data
            </Button>
          </Box>
        </Paper>
      </Modal>
    </>
  );
};