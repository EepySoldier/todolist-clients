import { checkAuthOnLoad } from './auth.js';
import { setupUIEventListeners } from './ui.js';


$(document).ready(() => {
    checkAuthOnLoad();
    setupUIEventListeners();
});