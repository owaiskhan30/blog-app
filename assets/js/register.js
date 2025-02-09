import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { db, auth } from "./firebaseconfig.js";

const registerForm = document.querySelector("#register");
const reg_fisrtname = document.querySelector(".reg_fisrtname");
const reg_lastname = document.querySelector(".reg_lastname");
const reg_email = document.querySelector(".reg_email");
const reg_password = document.querySelector(".reg_password");
const reg_uploadImage = document.querySelector(".reg_uploadImage");
let profile_img_url = "";

let myWidget = cloudinary.createUploadWidget({
    cloudName: 'dyi9sqwmt',
    uploadPreset: 'blog-app-preset'
}, (error, result) => {
    if (!error && result && result.event === "success") {
        console.log('Done! Here is the image info: ', result.info);
        profile_img_url = result.info.secure_url;
    }
}
)

document.getElementById("upload_widget").addEventListener("click", function () {
    myWidget.open();
}, false);



reg_uploadImage.addEventListener("click", (event) => {
    event.preventDefault();
});


registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    createUserWithEmailAndPassword(auth, reg_email.value, reg_password.value)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log(user);

            try {
                const docRef = await addDoc(collection(db, "users"), {
                    firstname: reg_fisrtname.value,
                    lastname: reg_lastname.value,
                    email: reg_email.value,
                    profileImage: profile_img_url,
                    uid: user.uid
                });
                console.log("Document written with ID: ", docRef.id);
                reg_fisrtname.value = "";
                reg_lastname.value = "";
                reg_email.value = "";
                reg_password.value = "";
            } catch (e) {
                console.error("Error adding document: ", e);
            }

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
});