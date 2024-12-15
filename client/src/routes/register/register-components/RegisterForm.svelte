<script>
    import { onMount } from 'svelte';
    import { Toast } from 'flowbite-svelte';
    import axios from 'axios';  
    import { preventDefault } from 'svelte/legacy';
    let username = '';
    let password = '';
    let confirm = '';
    let email = '';

    let errDisp = '';

    onMount(() => {
        axios.defaults.baseURL = 'http://localhost:3000';
    })

    async function handleSubmit() {
        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }
        return axios.post('/register', {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
            },       
            username,
            password,
            email,
        }).then((res) => {
            if (res.data.err) {
                switch (res.data.err) {
                    case 'err_missing_fields':
                        errDisp = 'Please fill out all fields.';
                        break;
                    case 'err_bad_word':
                        errDisp = 'You cannot include this in your username. Please note that any circumvention of bad words will result in an instant ban with no refund.';
                        break;
                    case 'err_invalid_chars':
                        errDisp = 'Your username must only consist of alphanumeric characters.';
                        break;
                    case 'err_username_length':
                        errDisp = 'Your username must be between 5 and 16 characters.';
                        break;
                    case 'err_username_taken':
                        errDisp = 'This username is already taken.';
                        break;
                    case 'err_email_taken':
                        errDisp = 'This email is already taken.';
                        break;
                }
                setTimeout(() => {
                    errDisp = '';
                }, 5000);
            } else {
                errDisp = 'Registration successful! You may now login.';
            }
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })
    }
</script>




<!-- create registration form with username/password/confirm/email -->
{#if errDisp}
    <Toast>
        <div>{errDisp}</div>
    </Toast>
{/if}
<form class="form" method='POST'  on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" bind:value={username} />
    </div>
    <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" bind:value={password} />
    </div>
    <div class="form-group">
        <label for="confirm">Confirm Password</label>
        <input type="password" id="confirm" bind:value={confirm} />
    </div>
    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" bind:value={email} />
    </div>
    <button type="submit">Register</button>
</form>