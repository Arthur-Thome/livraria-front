import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'nome', headerName: 'Nome', width: 200 },
  { field: 'biografia', headerName: 'Biografia', width: 300},
];

export default function Autores() {
  const [rows, setRows] = useState([]); // Estado para armazenar os dados

  useEffect(() => {
    const url = 'http://localhost:1337/api/autors/'; // URL do endpoint

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const data = await response.json();

        // Processa os dados para o formato esperado pela DataGrid
        const formattedData = data.data.map((item) => ({
          id: item.id,
          nome: item.nome,
          biografia: item.biografia,
        }));

        setRows(formattedData); // Atualiza o estado com os dados formatados
      } catch (error) {
        console.error('Erro ao consumir o endpoint:', error.message);
      }
    };

    fetchData(); // Chama a função de busca
  }, []); // Efeito executado apenas na montagem do componente

  return (
    <Paper sx={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows} // Usa os dados do estado
        columns={columns}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
