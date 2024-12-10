import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'nome', headerName: 'Nome', width: 200 },
  { field: 'biografia', headerName: 'Biografia', width: 300 },
];

export default function Autores() {
  const [rows, setRows] = useState([]); // Dados dos autores
  const [filteredRows, setFilteredRows] = useState([]); // Dados filtrados
  const [open, setOpen] = useState(false); // Controle do modal
  const [formData, setFormData] = useState({ id: null, nome: '', biografia: '' }); // Dados do formulário
  const [search, setSearch] = useState(''); // Texto da pesquisa

  // Fetch inicial dos dados
  useEffect(() => {
    const url = 'http://localhost:1337/api/autors/';
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();
        const formattedData = data.data.map((item) => ({
          id: item.id,
          nome: item.nome,
          biografia: item.biografia,
        }));
        setRows(formattedData);
        setFilteredRows(formattedData);
      } catch (error) {
        console.error('Erro ao buscar dados:', error.message);
      }
    };

    fetchData();
  }, []);

  // Atualizar a lista filtrada ao digitar na pesquisa
  useEffect(() => {
    setFilteredRows(
      rows.filter((row) =>
        row.nome.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, rows]);

  // Abrir o modal
  const handleOpen = (row = { id: null, nome: '', biografia: '' }) => {
    setFormData(row);
    setOpen(true);
  };

  // Fechar o modal
  const handleClose = () => {
    setOpen(false);
    setFormData({ id: null, nome: '', biografia: '' });
  };

  // Submeter o formulário
  const handleSubmit = async () => {
    const url = formData.id
      ? `http://localhost:1337/api/autors/${formData.id}`
      : 'http://localhost:1337/api/autors/';
    const method = formData.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { nome: formData.nome, biografia: formData.biografia } }),
      });

      if (response.ok) {
        const result = await response.json();
        if (method === 'POST') {
          setRows((prev) => [...prev, { id: result.data.id, ...formData }]);
        } else {
          setRows((prev) =>
            prev.map((row) => (row.id === formData.id ? formData : row))
          );
        }
        handleClose();
      } else {
        console.error('Erro ao salvar autor');
      }
    } catch (error) {
      console.error('Erro ao processar requisição:', error.message);
    }
  };

  // Excluir autor do banco de dados
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:1337/api/autors/${id}`, { method: 'DELETE' });

      if (response.ok) {
        setRows((prev) => prev.filter((row) => row.id !== id));
      } else {
        console.error('Erro ao excluir o autor');
      }
    } catch (error) {
      console.error('Erro ao processar exclusão:', error.message);
    }
  };

  return (
    <div>
      <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
        <TextField
          label="Pesquisar Autor"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" onClick={() => handleOpen()}>
          Novo Autor
        </Button>
      </Stack>
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredRows}
          columns={[
            ...columns,
            {
              field: 'actions',
              headerName: 'Ações',
              sortable: false,
              renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpen(params.row)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleDelete(params.row.id)}
                  >
                    Excluir
                  </Button>
                </Stack>
              ),
              width: 200,
            },
          ]}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>

      {/* Modal para criar/editar */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{formData.id ? 'Editar Autor' : 'Novo Autor'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Nome"
            fullWidth
            margin="dense"
            value={formData.nome}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, nome: e.target.value }))
            }
          />
          <TextField
            label="Biografia"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            value={formData.biografia}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, biografia: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
