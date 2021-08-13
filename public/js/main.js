const chatBox = document.getElementById('chat-form');

const socket = io();

socket.on('welcome_message',message =>{
    console.log('Mensagem de boas-vindas:'+message)
    outputMessage(message);
})


socket.on('message',message =>{
    console.log('Mensagem :'+message)
    outputMessage(message);
})

socket.on('chatMessage',message =>{
    //console.log('Mensagem :'+message)
    outputMessage(message);
})

chatBox.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage',msg);
})

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =  `<p class="meta">Lucas <span>9:12pm</span></p>
    <p class="text">
        ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}