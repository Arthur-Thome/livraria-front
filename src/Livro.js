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

// Função para formatar a data no formato yyyy-MM-dd
const formatDateForAPI = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function Livros() {
    const [rows, setRows] = useState([]); // Dados dos livros
    const [formData, setFormData] = useState({ nome: '', data_de_publicacao: '' }); // Dados do formulário

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'nome', headerName: 'Nome', width: 200 },
        { field: 'data_de_publicacao', headerName: 'Data de Publicação', width: 150 },
    ];

    // Fetch inicial dos dados
    useEffect(() => {
        const url = 'http://localhost:1337/api/livros/';
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                const formattedData = data.data.map((item) => ({
                    id: item.id,
                    nome: item.nome,
                    data_de_publicacao: item.data_de_publicacao,
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

    // Handle form submit for adding new book
    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = 'http://localhost:1337/api/livros/';
        const formattedDate = formatDateForAPI(formData.data_de_publicacao); // Formatar a data corretamente
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { nome: formData.nome, data_de_publicacao: formattedDate } }),
            });

            if (response.ok) {
                const result = await response.json();
                setRows((prev) => [
                    ...prev,
                    { id: result.data.id, nome: formData.nome, data_de_publicacao: formattedDate },
                ]);
                setFormData({ nome: '', data_de_publicacao: '' }); // Limpa o formulário
            } else {
                console.error('Erro ao salvar os dados');
            }
        } catch (error) {
            console.error('Erro ao enviar os dados:', error.message);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <div class="bookForm">
                <Card elevation={3} sx={{ mb: 4, p: 2 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Adicionar Novo Livro
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
                                        label="Data de Publicação (AAAA/MM/DD)"
                                        variant="outlined"
                                        fullWidth
                                        name="data_de_publicacao"
                                        value={formData.data_de_publicacao}
                                        onChange={handleChange}
                                    />
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Enviar
                                    </Button>
                                </Stack>
                            </Box>
                        
                    </CardContent>
                </Card>
            </div>
            <div class="bookTable">
                <Paper sx={{ height: 400, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        checkboxSelection
                        sx={{ border: 0 }}
                    />
                </Paper>
            </div>
        </Box >
    );
}
