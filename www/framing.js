import * as Frame from './frame.js';

document.addEventListener('DOMContentLoaded', async() => {
    const params = new URLSearchParams(window.location.search);
    const objectID = params.get("objectID");

    if (!objectID) {
        window.location.href = "search.html";
        return;
    }

});