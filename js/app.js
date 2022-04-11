// DOM elements

const elCountUsers = document.querySelector("#countOfUsers");
const elCountPosts = document.querySelector("#countOfPosts");
const elCountComments = document.querySelector("#countOfComments");

const eluserList = document.querySelector("#usersList");
const elpostList = document.querySelector("#postsList");
const elcommentList = document.querySelector("#commentList");

const eluserTemplate = document.querySelector("#userTemplate").content;
const elpostTemplate = document.querySelector("#postTemplate").content;
const elCommentsTemplate = document.querySelector("#commentTemplate").content;

// local storage

let storage = window.localStorage

let localPosts = JSON.parse(storage.getItem("posts"))
let localComments = JSON.parse(storage.getItem("comments"))



if (localPosts) {
   renderPosts(localPosts , elpostList)
}

if (localComments) {
    renderPosts(localComments , elcommentList)
    elCountComments.textContent = localComments.length
 }
 
// async functions

async function asyncUser() {
    let response = await fetch("https://jsonplaceholder.typicode.com/users")
    let data = await response.json()
    
    renderUser(data , eluserList)
   
}

asyncUser()


async function fetchPosts(id) {
    let response = await fetch(`https://jsonplaceholder.typicode.com/user/${id}/posts`)
    let data = await response.json()
    
    return data
}

async function fetchComments(id) {
    let response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`)
    let data = await response.json()
    
    return data
    
}

// Render functions

function renderUser(array , placeOfArray) {
    placeOfArray.innerHTML = null
    
    let userFragment = document.createDocumentFragment()
    
    array.forEach(item => {
        
        let userTemplate =  eluserTemplate.cloneNode(true)
        
        userTemplate.querySelector("#userName").textContent = item.name
        userTemplate.querySelector("#userName").dataset.userID = item.id
        userTemplate.querySelector("#userEmail").textContent = item.email
        userTemplate.querySelector("#userCountry").textContent = item.address.city
        userTemplate.querySelector("#userCompany").textContent = item.company.name
        userTemplate.querySelector("#userWebSite").textContent = item.website
        userTemplate.querySelector("#userWebSite").dataset.websiteID = item.id
        
        userFragment.appendChild(userTemplate)
        
    });

    elCountUsers.textContent = array.length
    placeOfArray.appendChild(userFragment)
}

function renderPosts(array , placeOfArray) {
    placeOfArray.innerHTML = null

    let postsFragment = document.createDocumentFragment()

    array.forEach(item => {
        let postTemplate = elpostTemplate.cloneNode(true)

        postTemplate.querySelector("#userPostName").textContent = item.title
        postTemplate.querySelector("#userPostName").dataset.postID = item.id
        postTemplate.querySelector("#userPost").textContent = item.body

        postsFragment.appendChild(postTemplate)
    });

    elcommentList.innerHTML = null
    elCountComments.textContent = 0

    elCountPosts.textContent = array.length
    placeOfArray.appendChild(postsFragment)
}

function renderComments(array , placeOfArray) {
    placeOfArray.innerHTML = null

    let commentsFragment = document.createDocumentFragment()

    array.forEach(item => {
        let CommentsTemplate = elCommentsTemplate.cloneNode(true)

        CommentsTemplate.querySelector("#commentsName").textContent = item.title
        CommentsTemplate.querySelector("#commentsName").dataset.postID = item.id
        CommentsTemplate.querySelector("#commentsEmail").textContent = item.email
        CommentsTemplate.querySelector("#comments").textContent = item.body

        commentsFragment.appendChild(CommentsTemplate)

    });
    elCountComments.textContent = array.length
    placeOfArray.appendChild(commentsFragment)
}


eluserList.addEventListener("click" , async (evt) => {
    
    let userNameId = evt.target.dataset.userID
    
    if (userNameId) {

        let data = await fetchPosts(userNameId)

        renderPosts(data , elpostList)
        storage.setItem("posts", JSON.stringify(data))
        
    }

})

elpostList.addEventListener("click" , async (evt) => {
    let userpostID = evt.target.dataset.postID

    if (userpostID) {  
        let data = await fetchComments(userpostID)

        renderComments(data , elcommentList)
        storage.setItem("comments" , JSON.stringify(data))

    }

})
