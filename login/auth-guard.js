import { auth } from "../firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    }

    if (user.isAnonymous) {
        console.log("User ist als Gast eingeloggt");
    } else {
        console.log("User ist als Member eingeloggt");
    }
});