const path = require('path');
const http = require('http');
const express = require ('express');
const socketio = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

//dizendo ao express a localizacao dos arquivos estaticos
app.use(express.static(path.join(__dirname,'public')));


//Isso roda quando um usuario se conecta
io.on('connection', socket =>  {
    //manda somente para usuário que esta se conectando
    socket.emit('welcome_message','Bem-vindo(a) ao Chat!')

    //broadcast mandar para todos usuarios menos o usuario que esta conectando
    socket.broadcast.emit('message', 'Um usuário acabou de entrar na sala');

    //roda quando um usuario disconecta
    socket.on('disconnect',() => {
        //manda para todos
        io.emit('message','Um usuário saiu da sala')
    })

    //roda quando enviar uma mensagem
    socket.on('chatMessage',msg => {
        //manda para todos
        io.emit('message',msg)
    })
});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
