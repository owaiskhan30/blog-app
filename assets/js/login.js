import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth } from "./firebaseconfig.js";

// DOM elements
const login_email = document.querySelector('.login_email');
const login_password = document.querySelector('.login_password');
const login_form = document.querySelector('#login');

// Handle form submit for login
login_form.addEventListener("submit", (event) => {
    event.preventDefault();

    // Sign in with email and password
    signInWithEmailAndPassword(auth, login_email.value, login_password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);

            // Redirect to dashboard on successful login
            window.location = "dashboard.html";
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            // Log the error for debugging
            console.error(errorCode, errorMessage);
        });
});
