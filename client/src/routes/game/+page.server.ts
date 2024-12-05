import axios from "axios";
import {goto} from '$app/navigation';
import { redirect } from '@sveltejs/kit';
 

export async function load() {
//     const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

//     await wait(3000);

//     const user_info = await axios.get('http://localhost:3000/get_user', {withCredentials: true});
//    // console.log(user_info.data)
//     if (user_info.data.err === 'noauth') {
//         console.log('no authorization, returning to login...')
//         throw redirect(302, '/login');
//     }
//     return {
// 		username: user_info.data.username,
// 	};
}