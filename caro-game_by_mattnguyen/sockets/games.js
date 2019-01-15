
module.exports = function(io) {
  let caroRooms = [];
  io
    .of('/games')
    .on('connection', socket => {
      socket.on('connectUser', userId => {
        if(caroRooms.includes(userId)) {
          socket.emit('hostRoom');
          //We got an error here: Not keeping the room in adapter but in caroRooms is existed
        } 
        else socket.emit('newRoom', caroRooms); 
      })
      
      socket.on('hostRoom', hostId => {
        socket.join(hostId);
        caroRooms.push(hostId);
        socket.broadcast.emit('newRoom', caroRooms)
        socket.emit('hostRoom');
      })
      socket.on('leaveRoom', hostId => {
        socket.leave(hostId);
        index = caroRooms.indexOf(hostId);
        caroRooms.splice(index, 1);
        socket.broadcast.emit('newRoom', caroRooms)
        socket.emit('newRoom', caroRooms)
        socket.emit('leaveRoom', caroRooms);
      })

      socket.on('joinRoom', data => {
        socket.join(data.roomId);
        index = caroRooms.indexOf(data.roomId);
        caroRooms.splice(index, 1);
        socket.broadcast.emit('newRoom', caroRooms);
        const gameData = {
          hostId: data.roomId,
          joinId: data.joinId
        }

        //Get socket ID
        const sockets = io.of('/games').adapter.rooms[data.roomId].sockets;
        const keys = [];
        for (let key in sockets)
          keys.push(key)

        io.of('/games').in(data.roomId ).emit('startGame', gameData);
        
        //Choose who goes first
        if(Math.random() > 0.5) {
          dataHost = {turn: true, role: 'o'};
          dataJoin = {turn: false, role: 'x'};
          io.of('/games').to(keys[0]).emit('yourTurn', dataHost);
          io.of('/games').to(keys[1]).emit('opponentTurn', dataJoin);
        } else {
          dataHost = {turn: false, role: 'o'};
          dataJoin = {turn: true, role: 'x'};
          io.of('/games').to(keys[1]).emit('yourTurn', dataJoin);
          io.of('/games').to(keys[0]).emit('opponentTurn', dataHost);
        }
      })
      socket.on('nextTurn', (data) => {
        socket.broadcast.to(data.room).emit('nextTurn', data);
      })

      socket.on('leaveGame', (room) => {
        socket.leave(room);
      })

      socket.on('chatSample', data => {
        socket.broadcast.to(data.room).emit('chatSample', data.msg);
      })

      socket.on('submission', room => {
        socket.broadcast.to(room).emit('submission')
      })

      socket.on('drawGame', room => {
        socket.broadcast.to(room).emit('drawGame');
      })

      socket.on('acceptedDraw', room => {
        socket.broadcast.to(room).emit('acceptedDraw');
      })
    })

}

