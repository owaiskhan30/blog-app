import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-auth.js";
import { collection, getDocs, deleteDoc, updateDoc, doc, addDoc, query, where, Timestamp } from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
import { auth, db } from "./firebaseconfig.js";

let print_userName = document.querySelector(".userName");
const logout_btn = document.querySelector(".logout_btn");
const sub_btn = document.querySelector(".sub_btn");
const dashboard_form = document.querySelector("#dashboard_form");
const post_title = document.querySelector(".post_title");
const post_description = document.querySelector(".post_description");
const allBlogs = document.querySelector(".allBlogs");

let postArr = [];
let userName = "";

// Render Function
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
                        <span class="autor_name">${item.user_name}</span> - 
                        <span class="post_date">${item.date.toDate().toLocaleDateString()}</span>
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

    const editBtn = document.querySelectorAll(".editBtn");
    const delBtn = document.querySelectorAll(".delBtn");
    attachEventListeners(editBtn, delBtn);
};

// Attach event listeners for editing and deleting blogs
function attachEventListeners(editBtn, delBtn) {
    editBtn.forEach((item, index) => {
        item.addEventListener("click", async () => {
            console.log("Edit clicked for index:", index);
            post_title.value = postArr[index].title;
            post_description.value = postArr[index].description;
            sub_btn.disabled = true;

            let existingUpdateBtn = document.querySelector(".update_btn");
            if (existingUpdateBtn) existingUpdateBtn.remove();

            let updateBtn = document.createElement("button");
            updateBtn.className = "update_btn cusBtn";
            updateBtn.textContent = "Update blog";
            dashboard_form.append(updateBtn);

            updateBtn.addEventListener("click", async (event) => {
                event.preventDefault();
                console.log("Update button clicked");

                const blogRef = doc(db, "blogs", postArr[index].id);
                console.log(blogRef);

                try {
                    await updateDoc(blogRef, {
                        title: post_title.value,
                        description: post_description.value,
                    });
                    console.log("Blog updated successfully!");

                    postArr[index].title = post_title.value;
                    postArr[index].description = post_description.value;
                    render(postArr);

                    post_title.value = "";
                    post_description.value = "";
                    updateBtn.style.display = "none";
                    sub_btn.disabled = false;
                } catch (error) {
                    console.error("Error updating blog:", error);
                }
            });
        });
    });

    delBtn.forEach((item, index) => {
        item.addEventListener("click", async () => {
            console.log("Delete clicked for index:", index);
            await deleteDoc(doc(db, "blogs", postArr[index].id));
            console.log("Blog deleted...");
            postArr.splice(index, 1);
            render(postArr);
        });
    });
}

// Check if the user is logged in
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const uid = user.uid;
        console.log(uid);
        let users = await getDataFromFirestore();
        console.log(users);
        userName = users.firstname + " " + users.lastname;
        print_userName.innerHTML = userName;
        await getBlogs();
    } else {
        window.location = "login.html";
    }
});

// Add blog data to Firestore
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
            user_name: userName,
        });
        console.log("Document written with ID:", docRef.id);
        getBlogs();
        post_title.value = "";
        post_description.value = "";
    } catch (e) {
        console.error("Error adding document:", e);
    }
});

// Get user data from Firestore
async function getDataFromFirestore() {
    let user = null;
    const q = query(collection(db, "users"), where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        user = doc.data();
    });
    return user;
}

// Get blogs data from Firestore for the logged-in user
async function getBlogs() {
    allBlogs.innerHTML = "";
    postArr = [];
    const w = query(collection(db, "blogs"), where("uid", "==", auth.currentUser.uid));
    const querySnapshots = await getDocs(w);
    querySnapshots.forEach((doc) => {
        postArr.push({ ...doc.data(), id: doc.id });
    });
    console.log(postArr);
    render(postArr);
}

// Logout user
logout_btn.addEventListener("click", function (event) {
    event.preventDefault();
    signOut(auth)
        .then(() => (window.location = "login.html"))
        .catch((error) => console.log(error.message));
});
