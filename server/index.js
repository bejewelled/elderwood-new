const express = require('express'); 
const bodyParser = require('body-parser');
const app = express(); 
const PORT = 3000; 

const cors = require('cors')
const fs = require('fs')

const http = require('http')


const socketIO = require('socket.io');
const server = http.createServer(app)


const bcrypt = require('bcrypt')

const cron = require('node-cron')

const session = require('express-session')

const mongoose = require('mongoose')

//const redis = require('./database/redis')



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))
app.use(bodyParser.json());

app.use(async (req, res, next) => {
    if (req.path === '/login' || req.path === '/register') {
        return next()
    }
    //console.log(req.path)
    if (req.path === '/get_user') {
        // if (!req.session.authorized) {
        //     res.send({err: 'noauth'})
        // }
    }
    console.log('checking session')
    
    next()
})

console.log(app.get('env'))



server.listen(PORT, (error) =>{ 
    if(!error) 
        console.log("Server is Successfully Running, and App is listening on port " + PORT) 
    else 
        console.log("Error occurred, server can't start", error); 
    } 
);


// app.get('/', (req, res) => {

async function dbConnect() {
}

async function startup() {
}

startup()


app.post('/register', async (req, res) => {

})


app.post('/login', async (req, res) => {
   
})

app.get("/logout", (req, res) => {

  });

app.get('/get_user', (req, res) => {

})

const {initSocket, getIO} = require('./socket')

const ioLoader = initSocket(server)
const io = getIO()


io.on('connection', (socket) => {
   socket.on('test', async () => {
    console.log('testing')
    await io.emit('test-back', {})
   })
})

