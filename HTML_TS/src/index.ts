import { checkAuthOnLoad } from "./auth.js";
import { setupUIEventListeners } from "./ui.js";

document.addEventListener('DOMContentLoaded', () => {
    checkAuthOnLoad();
    setupUIEventListeners();
});