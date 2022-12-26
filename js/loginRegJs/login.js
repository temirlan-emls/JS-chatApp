const initAuth = async function () {
    const authLogin = document.querySelector("#authLogin");
    const authPassword = document.querySelector("#authPassword");
    const submitButtonAuth = document.querySelector("#submitAuth");

    submitButtonAuth.addEventListener("click", async () => {
        const params = {
            userData: {
                login: authLogin.value,
                password: authPassword.value,
            },
        };
        console.log(JSON.stringify(params));
        await authRequest("http://195.49.210.34/user/authorization/", params);
    });
};

const authRequest = async function (url, body) {
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(body),
    })
        .then(async (response) => {
            let jsonResponse = await response.json();
            console.log(jsonResponse);
            if (jsonResponse.info.status === "Error") {
                const error = jsonResponse.payload || response.status;
                return Promise.reject(error);
            }
            if (
                jsonResponse.info.status === "OK" &&
                jsonResponse.payload.isAuth === true
            ) {
                document.querySelector(".resAuth").innerHTML = "";
                document.querySelector(
                    ".resAuth"
                ).innerHTML = `<h2><span class="success">Welcome ${jsonResponse.payload.userData[0].login}</span></h2>`;
                window.location.href = `../html/chat.html?id=${jsonResponse.payload.userData[0]._id}`;
            }
            if (
                jsonResponse.info.status === "OK" &&
                jsonResponse.payload.isAuth === false
            ) {
                document.querySelector(".resAuth").innerHTML = "";
                document.querySelector(
                    ".resAuth"
                ).innerHTML = `<h2><span class="error">No such user</span></h2>`;
            }
        })
        .catch((error) => {
            document.querySelector(
                ".resAuth"
            ).innerHTML = `<h2><span class="error">Error:</span><br/>${error}</h2>`;
            console.error("There was an error!", error);
        });
};

initAuth();
