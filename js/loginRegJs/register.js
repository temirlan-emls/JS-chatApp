const init = async function () {
    const loginInput = document.querySelector("#login");
    const passwordInput = document.querySelector("#password");
    const passwordTryInput = document.querySelector("#passwordTry");
    const submitButtonReg = document.querySelector("#submitReg");

    submitButtonReg.addEventListener("click", async () => {
        const params = {
            userData: {
                login: loginInput.value,
                password: passwordInput.value,
                tryPassword: passwordTryInput.value,
            },
        };
        await registerRequest(
            "http://195.49.210.34/user/registration/",
            params
        );
    });
};

const registerRequest = async function (url, body) {
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
            if (jsonResponse.info.status === "OK") {
                console.log("OK");
                document.querySelector(".resAuth").innerHTML = "";
                document.querySelector(
                    ".resAuth"
                ).innerHTML = `<h2><span class="success">Success Reg</span></h2>`;
                document.querySelector(".authBlock").classList.remove("hidden");
                document.querySelector(".regBlock").classList.add("hidden");
            }
        })
        .catch((error) => {
            document.querySelector(
                ".resReg"
            ).innerHTML = `<h2><span class="error">Error:</span><br/>${error}</h2>`;
            console.error("There was an error!", error);
        });
};

init();
