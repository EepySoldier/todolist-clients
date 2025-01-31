import { setupUIEventListeners } from "./ui";
import { checkAuthOnLoad } from "./auth";
document.addEventListener('DOMContentLoaded', async () => {
    checkAuthOnLoad();
    setupUIEventListeners();
});
