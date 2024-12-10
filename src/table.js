import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'nome', headerName: 'Nome', width: 200 },
  { field: 'data_de_publicacao', headerName: 'Data de Publicação', width: 150 },
];

export default function DataTable() {
  const [rows, setRows] = useState([]); // Estado para armazenar os dados

  useEffect(() => {
    const url = 'http://localhost:1337/api/livros/';

    // Fazendo a requisição GET
    fetch(url)
      .then((response) => response.json()) // Converte a resposta para JSON
      .then((data) => {
        // Mapeando os dados para o formato esperado pelo DataGrid
        const formattedData = data.data.map((item) => ({
          id: item.id,
          nome: item.nome,
          data_de_publicacao: item.data_de_publicacao,
        }));
        setRows(formattedData); // Atualiza o estado com os dados formatados
      })
      .catch((error) => {
        console.error('Erro ao consumir o endpoint:', error.message);
      });
  }, []); // Executa apenas na montagem do componente

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
