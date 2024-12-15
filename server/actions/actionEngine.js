// import all tables from models/schema.ts
import {users, levels, wallet} from '..//models/schema.ts';


// entrypoint to the action engine; takes in all data and parses it.
/*
    client: client data not directly related to the user (e.g. actionType).
    user: user data. this data will directly translate to the database (e.g. userID or user.wallet).
    args: misc. args that may alter action behavior.
*/
const entrypoint = async (client, user, args) => {
    
}
