import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export default function Autores() {
  const [rows, setRows] = useState([]); // Dados dos autores
  const [formData, setFormData] = useState({ nome: '', biografia: '' }); // Dados do formulário
  const [deleteId, setDeleteId] = useState(''); // ID para deletar
  const [updateData, setUpdateData] = useState({ id: '', nome: '', biografia: '' }); // Dados para atualização

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'biografia', headerName: 'Biografia', width: 300 },
  ];

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
      } catch (error) {
        console.error('Erro ao buscar dados:', error.message);
      }
    };

    fetchData();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = 'http://localhost:1337/api/autors/';
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      });

      if (response.ok) {
        const result = await response.json();
        setRows((prev) => [
          ...prev,
          { id: result.data.id, nome: formData.nome, biografia: formData.biografia },
        ]);
        setFormData({ nome: '', biografia: '' });
      } else {
        console.error('Erro ao salvar os dados');
      }
    } catch (error) {
      console.error('Erro ao enviar os dados:', error.message);
    }
  };

  // Nova lógica para deletar
  const handleDelete = async () => {
    const id = parseInt(deleteId, 10);
    if (isNaN(id)) {
      console.error('ID inválido. Por favor, insira um número válido.');
      return;
    }

    const url = `http://localhost:1337/api/autors/${id}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setRows((prev) => prev.filter((row) => row.id !== id));
        console.log(`Autor com ID ${id} excluído com sucesso.`);
        setDeleteId('');
      } else {
        const errorData = await response.json();
        console.error('Erro da API:', errorData);
      }
    } catch (error) {
      console.error('Erro ao tentar excluir o autor:', error.message);
    }
  };

  // Lógica para atualizar
  const handleUpdate = async () => {
    const id = parseInt(updateData.id, 10);
    if (isNaN(id) || !updateData.nome || !updateData.biografia) {
      console.error('Dados inválidos. Por favor, preencha todos os campos corretamente.');
      return;
    }

    const url = `http://localhost:1337/api/autors/${id}`;
    try {
      // Verificar se o autor existe
      const checkResponse = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!checkResponse.ok) {
        console.error(`Autor com ID ${id} não encontrado.`);
        return;
      }

      // Atualizar os dados do autor
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { nome: updateData.nome, biografia: updateData.biografia } }),
      });

      if (response.ok) {
        const updatedRow = { id, nome: updateData.nome, biografia: updateData.biografia };
        setRows((prev) => prev.map((row) => (row.id === id ? updatedRow : row)));
        console.log(`Autor com ID ${id} atualizado com sucesso.`);
        setUpdateData({ id: '', nome: '', biografia: '' });
      } else {
        const errorData = await response.json();
        console.error('Erro da API:', errorData);
      }
    } catch (error) {
      console.error('Erro ao tentar atualizar o autor:', error.message);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Card elevation={3} sx={{ mb: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Adicionar Novo Autor
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Nome"
                variant="outlined"
                fullWidth
                name="nome"
                value={formData.nome}
                onChange={handleChange}
              />
              <TextField
                label="Biografia"
                variant="outlined"
                fullWidth
                rows={4}
                name="biografia"
                value={formData.biografia}
                onChange={handleChange}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ alignSelf: 'flex-end', width: '150px' }}
              >
                Enviar
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Card elevation={3} sx={{ mb: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Deletar Autor
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              label="ID do Autor"
              variant="outlined"
              value={deleteId}
              onChange={(e) => setDeleteId(e.target.value)}
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
            >
              Deletar
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card elevation={3} sx={{ mb: 4, p: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Atualizar Autor
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="ID do Autor"
              variant="outlined"
              name="id"
              value={updateData.id}
              onChange={handleUpdateChange}
            />
            <TextField
              label="Nome"
              variant="outlined"
              name="nome"
              value={updateData.nome}
              onChange={handleUpdateChange}
            />
            <TextField
              label="Biografia"
              variant="outlined"
              name="biografia"
              value={updateData.biografia}
              onChange={handleUpdateChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdate}
            >
              Atualizar
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}