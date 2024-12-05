<div class='flex wrapper'>
     <div class='w-1/2 items-center wrapper bg-[#cccccc] shadow-md 
        rounded-sm p-5 max-w-sm'>
        <form on:submit|preventDefault={registerWrapper}>
            <div class='username mb-4 w-1/3'>
                <label class='text-slate-700 text-sm font-bold' for='username'>
                    Username
                </label>
                <input bind:value={username}
                type='text' name='username' id='username' placeholder='Username' 
                required minlength="5" maxlength="15"/>
            </div>
            <div class='password mb-4 w-1/3'>
                <label class='text-slate-600 text-sm font-bold' for='password'>
                    Password
                </label>
                <input bind:value={password}
                type='password' name='password' id='password' placeholder='Password' 
                required minlength="8" maxlength="32"/>
            </div>
            <div class='confirmPassword mb-4'>
                <label class='text-slate-600 text-sm font-bold' for='password2'>
                    Confirm Password <br/>
                </label>
                <input bind:value={confirmPassword}
                type='password' name='password2' id='password2' placeholder='Confirm Password' 
                required />
            </div>
            <button type='submit' class='border-gray-500 border-4 bg-slate-300
            rounded shadow-md p-1'>Register</button>
        </form>
        {#key err}
        {#if err !== 'none'}
            {#if err !== null}
                <div class='items-center wrapper text-red-400'>
                    Username is already taken, either log in or choose a different username.
                </div>
            {:else if err === null}
                <div class='items-center wrapper text-green-600'>
                    Successfully registered! Redirecting to login page...
                </div>
            {/if}
        {/if}
        {/key}
        </div>
    </div>

<script lang=ts>
    //import dotenv from 'dotenv';
    //dotenv.config();
    import "../../app.css";
    import axios from 'axios';
    import {banned_words} from '../../lib/data/banned_words';
    import { onMount } from "svelte";
    import {goto} from '$app/navigation';

    let username: string, password: string, confirmPassword: string;
    let passwordsMatch: boolean = false;
    $: err = 'none'

    onMount(() => {
        axios.defaults.baseURL = 'http://localhost:3000';
    })

    const register = async () => {
        if ($banned_words.includes(username.toLowerCase())) {
            alert('Username is not allowed');
            return;
        }
        for (let i in $banned_words) {
            if (username.toLowerCase().includes($banned_words[i])) {
                alert('Username is not allowed');
                return;
            }
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const data = {
            username: username,
            password: password,
        }
        const res = await axios.post('/register', {username, password}, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },         
        })
        console.log(res.data)
        return res.data;
        
    }

    const registerWrapper = () => {
        register().then((status) => {
            console.log(status)
            err = status.err;
            if (err === null) {
                setTimeout(() => {
                    goto('/login')
                }, 1300)
            }
        })
    }

</script>

