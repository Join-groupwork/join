const BASE_URL = "https://join-ae525-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = [];
let tasks = [];
let category = [];

async function loadData(){
    let contacts = await fetch (BASE_URL + ".json");
    let contactsToJson = await contacts.json();
    console.log(contactsToJson);
    
}

loadData();