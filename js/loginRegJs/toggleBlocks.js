const toggleBlocks = document.querySelector(".toggleBlocks");
const regBlock = document.querySelector(".regBlock");
const authBlock = document.querySelector(".authBlock");

const toggleBlocksFn = (e) => {
    if (e.target.innerText === "Auth") {
        regBlock.classList.add("hidden");
        authBlock.classList.remove("hidden");
    } else if (e.target.innerText === "Registration") {
        authBlock.classList.add("hidden");
        regBlock.classList.remove("hidden");
    }
};

toggleBlocks.addEventListener("click", (e) => {
    toggleBlocksFn(e);
});
