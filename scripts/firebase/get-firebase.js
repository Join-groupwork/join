const BASE_URL = "https://join-ae525-default-rtdb.europe-west1.firebasedatabase.app/";

let contacts = [];
let tasks = [];
let category = [];

async function loadData(){
    let contacts = await fetch (BASE_URL + ".json");
    let contactsToJson = await contacts.json();
    console.log(contactsToJson);
    
}

// Neue Funktion nur zum Laden von Tasks
export async function loadTasks() {
    try {
        const res = await fetch(BASE_URL + "tasks.json");
        const data = await res.json();

        if (!data) return [];

        // Array aus Tasks mit Key
        return Object.entries(data).map(([key, value]) => ({ key, ...value }));

    } catch (err) {
        console.error("Fehler beim Laden der Tasks:", err);
        return [];
    }
}

loadData();