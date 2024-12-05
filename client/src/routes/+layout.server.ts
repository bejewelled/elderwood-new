import './styles.css';
import {io} from 'socket.io-client'
import {sc, connectInProgress} from '../lib/data/socket'
import { get, set } from 'svelte/store';

export async function load() {
    if (!get(connectInProgress)) {
        await connectInProgress.set(true)
        const socket = io('http://localhost:3000', {
            transports: ['websocket']
        })

        socket.on('connect', () => {
            console.log('connected')
        })

        socket.on("connect_error", (err) => {
            console.log(err)
        });

        socket.on('disconnect', () => {
            console.log('disconnected')
            connectInProgress.set(false)
        })

        if (socket.connected) {

        }
    }
}