import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

// Middleware para parsing de JSON
app.use(express.json());
app.use(express.static('public'));

// Configuração do Socket.IO
sockets.on('connection', (socket) => {
    const playerId = socket.id
    console.log(`> Player connected: ${playerId}`)   

// Obtendo a data e hora do servidor
const connectionTime = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour12: false // Para exibir no formato 24h
});
    const registroConexao = {
        tipo: 'conexão',
        jogador: playerId,
        horario: connectionTime,
    };

    // Grava o registro de conexão no arquivo
    fs.appendFile('./LOG/Conected.txt', JSON.stringify(registroConexao) + '\n', (err) => {
        if (err) {
            console.error('Erro ao gravar o registro de conexão:', err);
        }
    });
    socket.emit('setup',registroConexao)

    socket.on('disconnect', () => {
        const disconnectionTime = new Date().toLocaleString();

        const registroDesconexao = {
            tipo: 'desconexão',
            jogador: playerId,
            horario: disconnectionTime,
        };

        // Grava o registro de desconexão no arquivo
        fs.appendFile('./LOG/Desconected.txt', JSON.stringify(registroDesconexao) + '\n', (err) => {
            if (err) {
                console.error('Erro ao gravar o registro de desconexão:', err);
            }
        });
        console.log(`> Player desconnected: ${playerId}`) 
    });
});
// Endpoint para registrar acessos
app.post('/api/registro', (req, res) => {
    const { login, hora } = req.body;

    if (!login || !hora) {
        return res.status(400).json({ error: 'Login e hora são obrigatórios!' });
    }

    const registro = { login, hora };

    // Caminho para o arquivo na pasta "public"
    const filePath = path.join(__dirname, 'public', 'registros.txt');

    // Salva o registro no arquivo na pasta "public"
    fs.appendFile(filePath, JSON.stringify(registro) + '\n', (err) => {
        if (err) {
            console.error('Erro ao salvar registro:', err);
            return res.status(500).json({ error: 'Erro ao salvar registro.' });
        }

        res.status(201).json({ message: 'Registro salvo com sucesso!' });
    });
});

// Inicia o servidor
server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`);
});
