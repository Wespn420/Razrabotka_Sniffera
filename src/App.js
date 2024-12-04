import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

function App() {
  const [packets, setPackets] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let interval;
    if (isCapturing) {
      interval = setInterval(fetchPackets, 1000);
    }
    return () => clearInterval(interval);
  }, [isCapturing]);

  const fetchPackets = async () => {
    try {
      const response = await axios.get(`${API_URL}/packets`);
      setPackets(response.data.packets || []);
    } catch (error) {
      console.error('Error fetching packets:', error);
    }
  };

  const startCapture = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/start`);
      setIsCapturing(true);
    } catch (error) {
      console.error('Error starting capture:', error);
    } finally {
      setLoading(false);
    }
  };

  const stopCapture = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/stop`);
      setIsCapturing(false);
    } catch (error) {
      console.error('Error stopping capture:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearPackets = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/clear`);
      setPackets([]);
    } catch (error) {
      console.error('Error clearing packets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Анализатор сетевых пакетов
        </Typography>
        
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color={isCapturing ? "error" : "success"}
            onClick={isCapturing ? stopCapture : startCapture}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : (isCapturing ? 'Остановить захват' : 'Начать захват')}
          </Button>
          
          <Button
            variant="outlined"
            onClick={clearPackets}
            disabled={loading}
          >
            Очистить пакеты
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Время</TableCell>
                <TableCell>Источник</TableCell>
                <TableCell>Назначение</TableCell>
                <TableCell>Протокол</TableCell>
                <TableCell>Размер</TableCell>
                <TableCell>Описание</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packets.map((packet, index) => (
                <TableRow key={index}>
                  <TableCell>{packet.time}</TableCell>
                  <TableCell>{packet.source}</TableCell>
                  <TableCell>{packet.destination}</TableCell>
                  <TableCell>{packet.protocol}</TableCell>
                  <TableCell>{packet.length}</TableCell>
                  <TableCell>{packet.summary}</TableCell>
                </TableRow>
              ))}
              {packets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Пакеты еще не захвачены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
}

export default App;
