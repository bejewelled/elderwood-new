import { Server } from "socket.io";

let ioOut;

const initSocket = (server) => {
    ioOut = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    console.log('Socket.ioOut initialized')

    ioOut.on('connectionOut', (socket) => {
    })
    ioOut.on('error', (err) => {
        console.log(err)
    })
    return ioOut;
    // Handle socket event using socket.on()
}

const getioOut = () => {
    if (!ioOut) {
        throw new Error('Socket.ioOut not initialized!');
      }
      return ioOut;
}

export {
    initSocket
}