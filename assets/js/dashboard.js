import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { collection, getDocs, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";


let print_userName = document.querySelector('.userName');
const logout_btn = document.querySelector(".logout_btn");
const dashboard_form = document.querySelector("#dashboard_form");
const post_title = document.querySelector("#post_title");
const post_description = document.querySelector("#post_description");

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

dashboard_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        const docRef = await addDoc(collection(db, "blogs"), {
          title: post_title.value,
          description: post_description.value,
          date: Timestamp.fromDate(new Date()),
          uid: auth.currentUser.uid
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
})





async function getDataFromFirestore() {
    let user = null
    const q = query(collection(db, "blogs"), where("uid", "==", auth.currentUser.uid));
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
