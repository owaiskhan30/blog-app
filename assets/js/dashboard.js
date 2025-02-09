import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";


let print_userName = document.querySelector('.userName');
const logout_btn = document.querySelector(".logout_btn");

let userName = "";

onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);
        let users = await getDataFromFirestore()
        console.log(users);
        userName = users.firstname + " " + users.lastname;
        print_userName.innerHTML = userName;
    } else {
        window.location = "login.html"
    }
}); 


async function getDataFromFirestore() {
    let user = null
    const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        user = doc.data()
    });

    return user
}

logout_btn.addEventListener("click", function (event) {
    event.preventDefault();
    signOut(auth)
        .then(() => (window.location = "login.html"))
        .catch((error) => console.log(error.message));
});
