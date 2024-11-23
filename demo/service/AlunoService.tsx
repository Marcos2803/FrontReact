
import { Demo } from '@/types';
import axios from 'axios';

export const AlunoService = {
   
   

getAlunos() {
    return axios.get('/alunos', { headers: { 'Cache-Control': 'no-cache' } })
        .then((response) => response.data.data as Demo.Aluno[])
        .catch((error) => {
            console.error('Erro ao buscar dados dos alunos:', error);
            throw error;
        });
}


    
};
