<div class='grid grid-cols-8 justify-between items-center text-center 
bg-slate-400'>
    <div class='col-span-1 px-1 border-none'>
        <a href='/game' class='text-xl text-slate-600 text-right font-bold'>Elderwood</a>
    </div>
    <div class='col-span-1 px-1 hover:bg-slate-300 border-x-2 border-x-slate-600'>
        <a href='/game' class='text-slate-700 font-bold'>Home</a>
    </div>
    <div class='col-span-1 px-1 hover:bg-slate-300 border-r-2 border-r-slate-600'>
        <a href='/game' class='text-slate-700 font-bold'>About</a>
    </div>
    <div class='col-span-1 px-1 hover:bg-slate-300 border-r-2 border-r-slate-600'>
        <a href='/game' class='text-slate-700 font-bold'>Contact Us</a>
    </div>
    <div class='col-span-1 px-1 hover:bg-slate-300 border-r-2 border-r-slate-600'>
        <a href='/game' class='text-slate-700 font-bold'>Leaderboards</a>
    </div>
    <div class='col-span-1 px-1 hover:bg-slate-300 border-r-2 border-r-slate-600'>
        <a href='/game' class='text-slate-700 font-bold'>Discord</a>
    </div>
    <div class='col-span-1 px-1 hover:bg-slate-300 border-r-2 border-r-slate-600'>
        <a href='/game' class='text-slate-700 font-bold'>Account</a>
    </div>
    <div class='col-span-1 hover:bg-slate-300 px-1'>
        <button class='text-slate-700 font-bold' on:click = {() => logout()}>Logout</button>
    </div>
</div>

<script lang='ts'>
import axios from "axios";
import {goto} from '$app/navigation';

const logout = async () => {
        const logout = await axios.get('http://localhost:3000/logout', {withCredentials: true});
        goto('/login')
    }
</script>