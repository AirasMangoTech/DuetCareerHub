const { Server } = require('socket.io');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('sendMessage', (message) => {
      console.log('Message received:', message);
      io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected:', socket.id);
    });
  });

  return io;
};
