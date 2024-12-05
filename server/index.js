const express = require('express'); 
const bodyParser = require('body-parser');
const app = express(); 
const PORT = 3000; 

const cors = require('cors')
const fs = require('fs')

const http = require('http')

const mongoStore = require('connect-mongo')

const socketIO = require('socket.io');
const server = http.createServer(app)


const bcrypt = require('bcrypt')

const cron = require('node-cron')

const session = require('express-session')

const mongoose = require('mongoose')

//const redis = require('./database/redis')

const cc = require('./database/redis')

const sessionConfig = session({
    secret: 'q6dskP3DccphawY55VErTENu9sKe9v23',
    cookie: {
        httpOnly: false,
        secure:  false, 
        sameSite: 'lax',
        maxAge: 1000*60*60*24,
    },
    saveUninitialized: false,
    resave: false,
    store: mongoStore.create({
        mongoUrl: process.env.DB_CONNECT_URI,
    })
})

app.use(sessionConfig)


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
    await mongo.connect()
}

async function startup() {
    await dbConnect();
    await chat.initChat();
}

startup()


app.post('/register', async (req, res) => {

})

const updater = require('./procedures/updater')

app.post('/login', async (req, res) => {
   
})

app.get("/logout", (req, res) => {

  });

app.get('/get_user', (req, res) => {

})

const {initSocket, getIO} = require('./socket')

const ioLoader = initSocket(server)
const io = getIO()
io.engine.use(sessionConfig)


io.on('connection', (socket) => {
   
})

