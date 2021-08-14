const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const nomeRobo = 'Robô do Chat';

//dizendo ao express a localizacao dos arquivos estaticos
app.use(express.static(path.join(__dirname, 'public')));


//Isso roda quando um usuario se conecta
io.on('connection', socket => {
    
    socket.on('joinRoom', ({ username, room }) => {
        
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        //manda somente para usuário que esta se conectando
        socket.emit('welcome_message', formatMessage(nomeRobo, 'Bem-vindo(a) ao Chat!'))

        //broadcast mandar para todos usuarios menos o usuario que esta conectando
        socket.broadcast.to(user.room).emit(
            
            'message', formatMessage(nomeRobo, `${user.username} acabou de entrar na sala`)
        );

        //manda as infomacoes  do usuario e sala
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    });

    //roda quando enviar uma mensagem
    socket.on('chatMessage', msg => {
        //pega dados do usuario atual
        const user = getCurrentUser(socket.id);
        //manda para todos
        io.to(user.room).emit('message', formatMessage(user.username, msg))
    });

    //roda quando um usuario disconecta
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if (user) {
            //manda para todos
            io.to(user.room).emit('message', formatMessage(nomeRobo, `${user.username} saiu da sala`));

            //manda as infomacoes  do usuario e sala
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
