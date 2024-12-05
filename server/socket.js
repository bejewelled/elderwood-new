const socketIO = require('socket.io')

let io;

const initSocket = (server) => {
    io = socketIO(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
    })
    io.on('error', (err) => {
        console.log(err)
    })
    // Handle socket event using socket.on()
}

const getIO = () => {
    if (!io) {
        throw new Error('Socket.IO not initialized!');
      }
      return io;
}

module.exports = {
    initSocket,
    getIO
}