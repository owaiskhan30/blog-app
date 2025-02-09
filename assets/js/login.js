import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth } from "./firebaseconfig.js";

const login_email = document.querySelector('.login_email');
const login_password = document.querySelector('.login_password');
const login_form = document.querySelector('#login');


login_form.addEventListener("submit", (event) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, login_email.value, login_password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            window.location = "dashboard.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
});