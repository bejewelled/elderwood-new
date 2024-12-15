import express from 'express'; 
const app = express(); 
const PORT = 3000; 
import fs from 'fs';

import { createServer } from 'http';

const server = createServer(app)
const db = require('./database/sql.ts').db;
import {users} from './models/schema.ts';

import { genSalt, genSaltSync, hashSync } from 'bcrypt';
import cron from 'node-cron';
import cors from 'cors';

import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';

// use this but ES moduleas
import session from 'express-session';
const pgSession = require('connect-pg-simple')(session);

const sessionConfig = session({
    store: new pgSession({
        conString: process.env.DATABASE_URL,
        tableName: 'session'
    }),
    secret: 'a25oIhWEfaK8923uHJk2390x2qQPE268',
    maxAge: 86400*7,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
  })

app.use(sessionConfig)


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))



app.use(express.json());

// app.use(async (req, res, next) => {
//     if (req.path === '/login' || req.path === '/register') {
//         return next()
//     }
//     //console.log(req.path)
//     if (req.path === '/get_user') {
//         // if (!req.session.authorized) {
//         //     res.send({err: 'noauth'})
//         // }
//     }
//     //console.log('checking session')
    
//     next()
// })

var sessionChecker = (req, res, next) => {    
    if (req.session.profile) {
        next();
    } else {
        console.log(`No User Session Found`.red);
        res.redirect('/login');
    }
};

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


import { blacklist } from './username_blacklist.js';
import { eq, not, sql } from 'drizzle-orm';

app.post('/register', async (req, res) => {
    const {username, password, email} = req.body
    console.log(username)
    if (!username || !password || !email) {
        res.send({err: 'err_missing_fields'})
        return;
    }

    let unique = true;
    
    // check if username contains only alphanumeric (regex?)
    if (!username.match(/^[a-zA-Z0-9]+$/)) {
        res.send({err: 'err_invalid_chars'})
        return;
    }

    // check if username has bad words 
    console.log('bad check')
    for (const word of blacklist) {
        if (username.includes(word)) {
            res.send({err: 'err_bad_word'})
            return;
        }
    }

    console.log('length check')
    // check username length
    if (username.length < 5 || username.length > 16) {
        res.send({err: 'err_username_length'})
        return;
    }

    console.log('username check')
    // check if username is taken
    const user = await db.select().from(users).where(eq(users.username, username))
    console.log(user)
    if (user.length > 0) {
        res.send({err: 'err_username_taken'})
        return;
    }

    console.log('email check')
    // check if email is taken
    const mail = await db.select().from(users).where(eq(users.email, email))
    if (mail.length > 0) {
        res.send({err: 'err_email_taken'})
        return;
    }

    console.log('generating user...')
    // generate salted password
    const salt = bcrypt.genSaltSync(10)
    await db.insert(users)
    .values({
        username: username,
        password: bcrypt.hashSync(password, salt),
        email: email,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date(),
    })
    res.send({success: true})
    console.log('user generated!')
})


app.post('/login', async (req, res) => {
    const {username, password} = req.body
    if (!username || !password) {
        res.send({err: 'err_missing_fields'})
        return;
    }

    const user = await db.select().from(users).where(eq(users.username, username))
    if (user.length === 0) {
        res.send({err: 'err_user_not_found'})
        return;
    }

    if (!bcrypt.compareSync(password, user[0].password)) {
        res.send({err: 'err_incorrect_password'})
        return;
    }

    console.log('success!')
    // generate uuid token for session
    req.session.profile = user[0]
    req.session.userID = user[0].userID
    console.log(req.session.userID)
    req.session.save()
    res.redirect(301, 'http://localhost:5173/game')
    return;
   
})

app.get("/logout", (req, res) => {

  });

// app.get('/', sessionChecker, (req, res) => {
//     console.log("?")
// })

import { initSocket } from './socket.js';



const io = initSocket(server)
io.engine.use(sessionConfig);
if (!io) {
    throw new Error('Socket.io not initialized! Server cannot run until socket.io is initialized.')
}


io.on('connection', (socket) => {
    const req = socket.request
    req.session.reload((err) => {
        req.session.save();
      });
    const socketID = socket.request.session.id
    socket.join(socketID)
    console.log('room connected! id: ' + socketID)
    console.log('userID: ' + socket.request.session.profile)
    socket.on('test', async () => {
        console.log('testing')
        await io.emit('test-back', {})
    })
})

io.on('disconnect', (socket) => {
    // socket should leave the room
    socket.leave(socket.request.session.id)
    console.log('room disconnected')
})

