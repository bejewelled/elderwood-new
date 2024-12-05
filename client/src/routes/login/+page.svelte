<svelte:head>
	<title></title>
	<meta name="description" content="About this app" />
</svelte:head>

<div class="text-column">
	<div class='flex wrapper'>
		<div class='w-1/2 items-center wrapper bg-[#cccccc] shadow-md 
		   rounded-sm p-5 max-w-sm'>
		   <form on:submit|preventDefault={login}>
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
			   <button type='submit' class='border-gray-500 border-4 bg-slate-300
			   rounded shadow-md p-1'>Login</button>
		    </form>
			{#if err}
		   		<div class='items-center wrapper text-red-400'>
					Username or password is incorrect.
				</div>
			{/if}
		    </div>
			<a href='/register' class='border-gray-500 border-4 bg-slate-300
			rounded shadow-md p-1'>Register Here!</a>
	   </div>

</div>

<script lang=ts>
    import "../../app.css";
    import axios from 'axios';
    import {banned_words} from '../../lib/data/banned_words';
    import { onMount } from "svelte";
	import {goto} from '$app/navigation';

    let username: string, password: string, confirmPassword: string;
	$: err = undefined
    let passwordsMatch: boolean = false;

    onMount(() => {
        axios.defaults.baseURL = 'http://localhost:3000';
    })

    const login = async (e) => {
        e.preventDefault();

        await console.log(username, password)

        const data = {
            username: username,
            password: password,
        }
        const res = await axios.post('/login', data, {
			withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },         
        });
		err = res.data.err;
		if (res.data.err === null) {
			goto('/game')
		}
    }
</script>
