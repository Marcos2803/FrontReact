
import axios from 'axios';

// Configuração do Axios com a URL base da sua API
const api = axios.create({
  baseURL: 'https://localhost:7069/api', // Base URL da API
  headers: {
    'Content-Type': 'application/json', // Tipo de conteúdo
  },
});