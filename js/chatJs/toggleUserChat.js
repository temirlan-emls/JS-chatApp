const initUsersList = async function () {
    const currentUser = window.location.href.substring(40, 64);

    const toggleUserChat = document.querySelector(".toggleUserChat");
    await getAllUsers(currentUser);
    // await getChats(currentUser);
    toggleUserChat.addEventListener("click", async (e) => {
        toggleUserChatFn(e, currentUser);
    });
};

const toggleUserChatFn = async (e, currentUser) => {
    const usersButton = document.querySelector(".users");
    const chatsButton = document.querySelector(".chats");

    if (e.target.innerText === "USERS") {
        usersButton.classList.add("active");
        chatsButton.classList.remove("active");
        await getAllUsers(currentUser);
    } else if (e.target.innerText === "CHATS") {
        chatsButton.classList.add("active");
        usersButton.classList.remove("active");
        await getChats(currentUser);
    }
};

const getAllUsers = async function (currentUser) {
    await fetch("http://195.49.210.34/user/", {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .then(async (response) => {
            let jsonResponse = await response.json();

            if (jsonResponse.info.status === "Error") {
                const error = jsonResponse.payload || response.status;
                return Promise.reject(error);
            }

            jsonResponse.payload = jsonResponse.payload.filter((obj) => {
                return obj._id !== currentUser;
            });

            const usesList = document.querySelector(".listChatUser");
            usesList.innerHTML = "";
            const chatMembers = document.querySelector(".chatMembers");
            chatMembers.innerHTML = "";
            jsonResponse.payload.forEach((user) => {
                const userLabel = document.createElement("h2");
                userLabel.classList.add("userName");
                userLabel.innerText = user.login;
                const divUser = document.createElement("div");
                divUser.classList.add("user");
                divUser.appendChild(userLabel);
                usesList.appendChild(divUser);

                const divChatMembersUser = document.createElement("div");
                divChatMembersUser.classList.add("chatMembersUser");
                divChatMembersUser.innerText = user.login;
                chatMembers.appendChild(divChatMembersUser);
            });
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

const getChats = async function (currentUser) {
    await fetch("http://195.49.210.34/user/" + currentUser, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .then(async (response) => {
            let jsonResponse = await response.json();

            if (jsonResponse.info.status === "Error") {
                const error = jsonResponse.payload || response.status;
                return Promise.reject(error);
            }

            const fullUrl =
                "http://195.49.210.34/chat/user/" +
                jsonResponse.payload[0].login;
            await getChatsBlock1(fullUrl);
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

const getChatsBlock1 = async function (fullUrl) {
    await fetch(fullUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    })
        .then(async (response) => {
            let jsonResponse = await response.json();

            if (jsonResponse.info.status === "Error") {
                const error = jsonResponse.payload || response.status;
                return Promise.reject(error);
            }

            const usesList = document.querySelector(".listChatUser");
            usesList.innerHTML = "";
            jsonResponse.payload.forEach((chat) => {
                const userLabel = document.createElement("h2");
                userLabel.innerText = chat.label;
                const divUser = document.createElement("div");
                divUser.classList.add("chat");
                divUser.appendChild(userLabel);
                usesList.appendChild(divUser);
            });
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

initUsersList();
