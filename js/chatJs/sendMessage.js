const sendMessageInit = async function () {
    const currentUser = window.location.href.substring(40, 64);
    const messageField = document.querySelector(".chatMessages");
    const messageInput = document.querySelector(".chatInput input");
    const messageButton = document.querySelector(".chatInput button");
    const currentLogin = await getCurrentLogin(currentUser);

    if (!messageField.children.length) {
        window.history.pushState(
            window.location.href.slice(36),
            "",
            `?id=${currentUser}`
        );
        messageInput.disabled = true;
        messageButton.disabled = true;
    }
    messageButton.addEventListener("click", async () => {
        let messageText = messageInput.value;

        if (messageText.length === 0) {
            messageInput.placeholder = "Enter something!!!";
        } else {
            messageInput.placeholder = "";
            const params = {
                login: currentLogin,
                text: messageText,
                chatId: window.location.href.substring(72, 96),
            };
            await sendMessage(
                params,
                currentLogin,
                window.location.href.substring(72, 96)
            );
        }
        messageInput.value = "";
    });
};

const sendMessage = async function (body, currentLogin, currentChat) {
    let url = "http://195.49.210.34/chat/send/text";
    await fetch(url, {
        method: "PoST",
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
            await openChatBlock2(currentChat, currentLogin);
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

const openChatBlock2 = async function (chatID, currentLogin) {
    const fullChatUrl = "http://195.49.210.34/chat/" + chatID + "/";
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
                chat.history.forEach((message) => {
                    const messageText = document.createElement("p");
                    messageText.innerText = message.text;
                    const messageWrapper = document.createElement("div");
                    if (message.from === currentLogin) {
                        messageWrapper.classList.add("myMessage");
                    } else if (message.from !== currentLogin) {
                        messageWrapper.classList.add("otherMessage");
                    }
                    messageWrapper.appendChild(messageText);
                    messageField.appendChild(messageWrapper);
                });
            });
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

const getCurrentLogin = async function (currentUser) {
    return await fetch("http://195.49.210.34/user/" + currentUser, {
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
            return jsonResponse.payload[0].login;
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

sendMessageInit();
