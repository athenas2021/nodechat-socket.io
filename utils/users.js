const users = [];

//Quando usuario entar na sala
function userJoin(id,username,room){
    const user = {id,username,room};
    users.push(user);
    return user;
}

//pegar usuario atual

function getCurrentUser(id){
    return users.find(user => user.id == id);
}

//usuario sai da sala
function userLeave(id){
    const index = users.findIndex(user => user.id == id);
    if(index !== -1 ){
        return users.splice(index,1)[0];
    }
}

//pega lista de usuarios
function getRoomUsers(room){
    return users.filter(user=> user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};