<script>
    import { onMount } from 'svelte';
    import { io } from 'socket.io-client';
    import { Toast } from 'flowbite-svelte';
    import axios from 'axios';
    import { goto } from '$app/navigation';
    // setup login vars
    let username = '';
    let password = '';
    let errDisp = '';

    onMount(() => {
        axios.defaults.baseURL = 'http://localhost:3000';
    })

    async function handleSubmit() {
        return axios.post('/login', {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            },       
            username,
            password
        }).then((res) => {
            if (res.data.err) {
                errDisp = 'Username or password is incorrect.';
                setTimeout(() => {
                    errDisp = '';
                }, 5000);
            } else {
                goto('/game');
            }
        }).catch((err) => {
            console.log(err);
        })
    }

</script>




<!-- create form with login username/password -->
{#if errDisp}
    <Toast>
        <div>{errDisp}</div>
    </Toast>
{/if}

<form class="form" method='POST'  on:submit|preventDefault={handleSubmit}>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" bind:value={username}><br><br>
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" bind:value={password}><br><br>
    <input type="submit" value="Submit">
</form>