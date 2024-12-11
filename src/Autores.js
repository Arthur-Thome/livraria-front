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
  const [setUpdateData] = useState({ id: '', nome: '', biografia: '' }); // Dados para atualização

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

      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </Box>
  );
}