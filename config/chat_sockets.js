module.exports.chatSockets=function(socketServer){

    let io=require('socket.io')(socketServer);
    //this.socket=io.connect('http://localhost:5000'); call here by connect but here  bt connection but usauly it is same 
    io.sockets.on('connection',function(socket){
        console.log('new connection received',socket.id);
        

        socket.on('disconnect',function(){
            console.log('socket disconnected!');
        });
        //on use the req send by the client
        socket.on('join_room',function(data){
            console.log('joining request received',data);
            socket.join(data.chatroom);
            io.in(data.chatroom).emit('user_joined',data);
        });
        //CHANGE :: detect send_message and broadcast to everyone in the room
        socket.on('send_message',function(data){
            io.in(data.chatroom).emit('receive_message',data);
        })



    });
}