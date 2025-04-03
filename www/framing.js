import * as Frame from './frame.js';

document.addEventListener('DOMContentLoaded', async() => {
    const params = new URLSearchParams(window.location.search);
    const objectID = params.get("objectID");

    updateCartLink()

    if (!objectID) {
        window.location.href = "search.html";
        return;
    }

});

function updateCartLink() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const link = document.getElementById("cart-link");
    if (cart.length > 0) {
      link.innerText = `Cart (${cart.length})`;
    }
}