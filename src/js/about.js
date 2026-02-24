const burger = document.getElementById("burger");
const navMenu = document.getElementById("nav-menu");
const navOverlay = document.getElementById("nav-overlay");

burger.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  navOverlay.classList.toggle("open");
});

navOverlay.addEventListener("click", () => {
  navMenu.classList.remove("open");
  navOverlay.classList.remove("open");
});

document.getElementById("nav-close").addEventListener("click", () => {
  navMenu.classList.remove("open");
  navOverlay.classList.remove("open");
});
