import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { collection, getDocs, addDoc, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";


let print_userName = document.querySelector('.userName');
const logout_btn = document.querySelector(".logout_btn");
const dashboard_form = document.querySelector("#dashboard_form");
const post_title = document.querySelector(".post_title");
const post_description = document.querySelector(".post_description");
const allBlogs = document.querySelector(".allBlogs");
let postArr = [];
let userName = "";


const render = (postArr) => {
        allBlogs.innerHTML = "";
        postArr.map((item) => {
        item.username = userName;
        allBlogs.innerHTML += `<div class="blog_post">
            <div class="post_head d-flex justify-content-start align-items-center gap-4">
                <div class="post_img">
                    <img src="${item.post_thumbnail}" class="auth_img" alt="Author Image">
                </div>
                <div class="post_details">
                    <h2>${item.title}</h2>
                    <span class="autor_name">${userName}</span> - <span class="post_date">${item.date.toDate().toLocaleDateString()}</span>
                </div>
            </div>
            <div class="post_ctn">
                <p>${item.description}</p>
            </div>
            <div class="post_btns">
                <a href="javascript:;" class="delBtn">Delete</a>
                <a href="javascript:;" class="editBtn">Edit</a>
            </div>
        </div>`;
    });
}



onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);
        let users = await getDataFromFirestore()
        console.log(users);
        userName = users.firstname + " " + users.lastname;
        print_userName.innerHTML = userName;
        await getBlogs();
    } else {
        window.location = "login.html"
    }
});


dashboard_form.addEventListener("submit", async (event) => {
    event.preventDefault();
    let users = await getDataFromFirestore();
    try {
        const docRef = await addDoc(collection(db, "blogs"), {
          title: post_title.value,
          description: post_description.value,
          date: Timestamp.fromDate(new Date()),
          uid: auth.currentUser.uid,
          post_thumbnail: users.profileImage,
        });
        console.log("Document written with ID: ", docRef.id);
        getBlogs();
        post_title.value = ""
        post_description.value = "";
    } catch (e) {
        console.error("Error adding document: ", e);
    }
});

async function getDataFromFirestore() {
    let user = null;
    const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        user = doc.data()
    });

    return user
}

async function getBlogs() {
    allBlogs.innerHTML = "";
    postArr = [];
    const w = query(collection(db, "blogs"), where("uid", "==", auth.currentUser.uid));
    const querySnapshots = await getDocs(w);
    querySnapshots.forEach((doc) => {
        doc.data();
        postArr.push(doc.data());
    });
    console.log(postArr);
    render(postArr);
}



logout_btn.addEventListener("click", function (event) {
    event.preventDefault();
    signOut(auth)
        .then(() => (window.location = "login.html"))
        .catch((error) => console.log(error.message));
});
