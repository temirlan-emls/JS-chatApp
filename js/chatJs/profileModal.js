const profileModalInit = async function () {
    const currentUser = window.location.href.substring(40, 64);
    openProfileModal(currentUser);
};

const openProfileModal = async (currentUser) => {
    const profileModalBack = document.querySelector(".profileModalBack");
    const profileButton = document.querySelector(".profileButton");
    const profileCloseButton = document.querySelector(".profileModal button");
    profileModalBack.addEventListener("click", (e) => {
        if (
            e.target.classList.value !== "profileModal" &&
            e.target.classList.value === "profileModalBack"
        ) {
            profileModalBack.classList.add("hidden");
        }
    });
    profileCloseButton.addEventListener("click", () => {
        profileModalBack.classList.add("hidden");
    });
    profileButton.addEventListener("click", async () => {
        profileModalBack.classList.remove("hidden");
        await getUserProfile(currentUser);
    });
};

const getUserProfile = async function (currentUser) {
    let fullProfileUrl = "http://195.49.210.34/user/" + currentUser;
    await fetch(fullProfileUrl, {
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
            const profileInfo = document.querySelector(".profileInfo");
            profileInfo.innerHTML = "";
            for (const [key, value] of Object.entries(
                jsonResponse.payload[0]
            )) {
                const infoField = document.createElement("p");
                const infoSpan = document.createElement("span");
                infoField.innerText = key + ": ";
                infoSpan.innerText = value;
                infoField.appendChild(infoSpan);
                profileInfo.appendChild(infoField);
            }
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
};

profileModalInit();
