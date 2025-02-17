import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { auth, db } from "./firebaseconfig.js";
import { collection, getDocs, addDoc, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

// Select DOM Elements
const preloaderContent = document.querySelector(".blogCtn .preloader svg");
let print_userName = document.querySelector('.userName');
const allBlogs = document.querySelector(".allBlogs");
const logout_btn = document.querySelector(".logoutBtn .cusBtn a");
let userName = "";
const get_blogs = [];

// Check if user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);
        let users = await getDataFromFirestore();
        console.log(users);
        userName = users.firstname + " " + users.lastname;
        print_userName.innerHTML = userName;
        logout_btn.innerHTML = "Logout";
    } else {
        print_userName.innerHTML = "";
    }
});

// Fetch user data from Firestore
async function getDataFromFirestore() {
    let user = null;
    const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        user = doc.data();
    });
    return user;
}

// Render blogs to the UI
const render = (postArr) => {
    allBlogs.innerHTML = "";
    postArr.map((item) => {
        allBlogs.innerHTML += `
            <div class="blog_post">
                <div class="post_head d-flex justify-content-start align-items-center gap-4">
                    <div class="post_img">
                        <img src="${item.post_thumbnail}" class="auth_img" alt="Author Image">
                    </div>
                    <div class="post_details">
                        <h2>${item.title}</h2>
                        <span class="autor_name">${item.user_name}</span> - <span class="post_date">${item.date.toDate().toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="post_ctn">
                    <p>${item.description}</p>
                </div>
                <div class="post_btns">
                    <a href="javascript:;" class="seeBtn">See all from this user</a>
                </div>
            </div>`;
    });
};

// Fetch all blogs from Firestore
async function getblogDataFromFirestore() {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    querySnapshot.forEach((doc) => {
        get_blogs.push(doc.data());
    });
    console.log(get_blogs);
    render(get_blogs);
    preloaderContent.style.opacity = "0";
    preloaderContent.style.visibility = "hidden";
}

// Fetch blogs initially
getblogDataFromFirestore();

// Logout user
logout_btn.addEventListener("click", function (event) {
    event.preventDefault();
    signOut(auth)
        .then(() => (window.location = "login.html"))
        .catch((error) => console.log(error.message));
});
