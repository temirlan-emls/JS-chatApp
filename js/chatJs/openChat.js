import { intervalsStore } from "./_intervalStore.js";

const openChatHandler = async function () {
    const listChatUser = document.querySelector(".listChatUser");
    const currentUser = window.location.href.substring(40, 64);
    listChatUser.addEventListener("click", async (e) => {
        intervalsStore.forEach(clearInterval);
        const targetChat = e.target.innerText;
        await openChat(currentUser, targetChat);
    });
};

const openChat = async function (currentUser, targetChat) {
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
            await openChatBlock1(
                fullUrl,
                targetChat,
                jsonResponse.payload[0].login
            );
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

const openChatBlock1 = async function (fullUrl, targetChat, currentUser) {
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

            jsonResponse.payload.forEach(async (chat) => {
                if (chat.label === targetChat) {
                    const fullChatUrl =
                        "http://195.49.210.34/chat/" + chat._id + "/";
                    await openChatBlock2(fullChatUrl, currentUser);
                }

                if (intervalsStore.length === 0) {
                }
            });
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

const openChatBlock2 = async function (fullChatUrl, currentUser) {
    let chatInterval = setInterval(async () => {
        await fetch(fullChatUrl, {
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
                const messageField = document.querySelector(".chatMessages");
                messageField.innerHTML = "";
                jsonResponse.payload.forEach((chat) => {
                    chat.history
                        .slice()
                        .reverse()
                        .forEach((message) => {
                            const messageText = document.createElement("p");
                            messageText.innerText = message.text;
                            const messageWrapper =
                                document.createElement("div");
                            if (message.from === currentUser) {
                                messageWrapper.classList.add("myMessage");
                            } else if (message.from !== currentUser) {
                                messageWrapper.classList.add("otherMessage");
                            }
                            messageWrapper.appendChild(messageText);
                            messageField.appendChild(messageWrapper);
                        });
                });
                console.log(jsonResponse.payload[0].label);
                window.history.pushState(
                    window.location.href,
                    "",
                    `?id=${window.location.href.substring(40, 64)}?chatId=${
                        jsonResponse.payload[0]._id
                    }`
                );
                const messageInput = document.querySelector(".chatInput input");
                const messageButton =
                    document.querySelector(".chatInput button");
                messageInput.disabled = false;
                messageButton.disabled = false;
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }, 1000);
    intervalsStore.push(chatInterval);
};

openChatHandler();

let chatInterval = setInterval(async () => {}, 1000);
