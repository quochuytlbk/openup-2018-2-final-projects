
module.exports = function(io) {
  io.on('connection', function(socket) {
    socket.on('chat message', (data) => {
      io.emit('chat message', data);
    })
    socket.on('disconnect', function(){
      // console.log('user disconnected');
    });
  })
}