//npm init -y
//npm isntall express --save
//npm install socket.io
//nvm install node

//para rodar a aplicação no servidor node entrar na pasta 
//cd ID_start
//node .
import express from 'express'
import http from 'http'
import { Server } from 'socket.io';

const app = express()
const server = http.createServer(app)
const sockets = new Server(server);

app.use(express.static('public'))

sockets.on('connection', (socket) => {
    const playerId = socket.id
    const state = {
        players: {},
        fruits: {},
    }
    console.log(`> Player connected: ${playerId}`)   

    socket.emit('setup', state)

    socket.on('disconnect', () => {
        console.log(`> Player disconnected: ${playerId}`)
    })
})

server.listen(3000, () => {
    console.log(`> Server listening on port: 3000`)
})