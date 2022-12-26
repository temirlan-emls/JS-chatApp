import { intervalsStore } from "./_intervalStore.js";

const starChatInit = async function () {
    const currentUser = window.location.href.substring(40, 64);
    startChatToggler(currentUser);
};

const startChatToggler = async (currentUser) => {
    const startChatError = document.querySelector(".startChatError");
    const startChatButton = document.querySelector(".topButtons");
    startChatButton.addEventListener("click", async (e) => {
        startChatError.innerHTML = "";
        if (e.target.innerText === "Start Chat!") {
            startChatBack.classList.remove("hidden");
        }
    });

    const startChatBack = document.querySelector(".startChatBack");
    startChatBack.addEventListener("click", (e) => {
        if (
            e.target.classList.value !== "startChatModal" &&
            e.target.classList.value === "startChatBack"
        ) {
            startChatError.innerHTML = "";
            startChatBack.classList.add("hidden");
        }
    });

    const chatMember = document.querySelector(".chatMembers");
    let chatMembersList = [];
    chatMember.addEventListener("click", (e) => {
        if (
            (e.target.classList.value !== "chatMembers" &&
                e.target.classList.value === "chatMembersUser") ||
            e.target.classList.value === "chatMembersUser activeChatMember"
        ) {
            if (!e.target.classList.value.includes("activeChatMember")) {
                chatMembersList.push(e.target.innerText);
                e.target.classList.add("activeChatMember");
            } else if (e.target.classList.value.includes("activeChatMember")) {
                chatMembersList = chatMembersList.filter(
                    (item) => item !== e.target.innerText
                );
                e.target.classList.remove("activeChatMember");
            }
        }
    });

    const startChatCloseButton = document.querySelector(
        ".startChatModal button"
    );
    startChatCloseButton.addEventListener("click", () => {
        intervalsStore.forEach(clearInterval);
        const chatLabel = document.querySelector("#chatLabel");
        const chatDescr = document.querySelector("#chatDescr");

        const params = {
            userId: currentUser,
            label: chatLabel.value,
            members: chatMembersList,
            description: chatDescr.value,
        };

        if (!chatMembersList.length && !chatLabel.value) {
            startChatError.innerHTML = "";
            const errorMessageMember = document.createElement("p");
            errorMessageMember.innerText = "Choose chat members";
            startChatError.appendChild(errorMessageMember);

            const errorMessageLabel = document.createElement("p");
            errorMessageLabel.innerText = "Enter chat label";
            startChatError.appendChild(errorMessageLabel);
        } else if (!chatMembersList.length) {
            startChatError.innerHTML = "";
            const errorMessageLabel = document.createElement("p");
            errorMessageLabel.innerText = "Enter chat label";
            startChatError.appendChild(errorMessageLabel);
        } else if (!chatLabel.value) {
            startChatError.innerHTML = "";
            const errorMessageMember = document.createElement("p");
            errorMessageMember.innerText = "Choose chat members";
            startChatError.appendChild(errorMessageMember);
        }

        if (chatMembersList.length && chatLabel.value) {
            startChat(params, currentUser);
            startChatError.innerHTML = "";
            chatMembersList = [];
            startChatBack.classList.add("hidden");
        }
    });
};

const startChat = async function (body, currentUser) {
    let url = "http://195.49.210.34/chat/create";
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(body),
    })
        .then(async (response) => {
            let jsonResponse = await response.json();
            if (jsonResponse.info.status === "Error") {
                const error = jsonResponse.payload || response.status;
                return Promise.reject(error);
            }
            await openChatBlock2(jsonResponse.payload._id, currentUser);
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

const openChatBlock2 = async function (chatID, currentUser) {
    const fullChatUrl = "http://195.49.210.34/chat/" + chatID + "/";

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
                console.log(jsonResponse.payload[0].label);
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

starChatInit();
