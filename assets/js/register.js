import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { db, auth } from "./firebaseconfig.js";

// DOM elements
const preloader = document.querySelector(".preloader svg");
const registerForm = document.querySelector("#register");
const reg_fisrtname = document.querySelector(".reg_fisrtname");
const reg_lastname = document.querySelector(".reg_lastname");
const reg_email = document.querySelector(".reg_email");
const reg_password = document.querySelector(".reg_password");
const reg_uploadImage = document.querySelector(".reg_uploadImage");

let profile_img_url = "";

// Cloudinary widget for image upload
let myWidget = cloudinary.createUploadWidget({
    cloudName: 'dyi9sqwmt',
    uploadPreset: 'blog-app-preset'
}, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', result.info);
        profile_img_url = result.info.secure_url;  // Save image URL
    }
});

// Open widget on click
document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
}, false);

// Prevent default behavior for image upload button
reg_uploadImage.addEventListener("click", (event) => {
    event.preventDefault();
});

// Handle user registration form submit
registerForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Create new user with email and password
    createUserWithEmailAndPassword(auth, reg_email.value, reg_password.value)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log(user);

            try {
                preloader.style.opacity = "1";
                preloader.style.visibility = "visible";
                // Add user data to Firestore
                const docRef = await addDoc(collection(db, "users"), {
                    firstname: reg_fisrtname.value,
                    lastname: reg_lastname.value,
                    email: reg_email.value,
                    profileImage: profile_img_url,
                    uid: user.uid
                });

                console.log("Document written with ID: ", docRef.id);

                // Clear form fields
                reg_fisrtname.value = "";
                reg_lastname.value = "";
                reg_email.value = "";
                reg_password.value = "";

                // Redirect to login page
                window.location = "login.html";
            } catch (e) {
                console.error("Error adding document: ", e);
            }

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(errorCode, errorMessage);
        });
});
