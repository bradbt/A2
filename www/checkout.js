import * as Frame from './frame.js';

document.addEventListener("DOMContentLoaded", async () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    if (cart.length === 0) {
      window.location.href = "cart.html";
      return;
    }
  
    const subtotal = cart.reduce((sum, item) =>
      sum + Frame.calculatePrice(item.printSize, item.frameStyle, item.frameWidth, item.matWidth) / 100, 0);
  
    document.getElementById("price-subtotal").innerText = subtotal.toFixed(2);
  
    const shipping = await fetch("shipping.json").then(res => res.json());
    const select = document.getElementById("country");
  
    shipping.destinations.forEach(dest => {
      const opt = document.createElement("option");
      opt.value = dest.isoCode;
      opt.textContent = dest.displayName;
      select.appendChild(opt);
    });
  
    select.addEventListener("change", () => updateShipping(select.value, shipping, subtotal));
    updateShipping(select.value, shipping, subtotal);
  });

function updateShipping(countryCode, shipping, subtotal) {
    const dest = shipping.destinations.find(d => d.isoCode === countryCode);
    if (!dest) return;
  
    let shippingCost = subtotal >= dest.freeShippingThreshold ? 0 : dest.price;
    let total = subtotal + shippingCost;
  
    const shippingLabel = document.getElementById("price-shipping");
    if (shippingCost === 0) {
      shippingLabel.innerHTML = "<b>Free</b>";
    } else {
      shippingLabel.innerText = `€ ${shippingCost.toFixed(2)}`;
    }
  
    const freeShippingDiv = document.getElementById("free-shipping-from");
    if (shippingCost === 0 || !dest.freeShippingThreshold) {
      freeShippingDiv.style.display = "none";
    } else {
      freeShippingDiv.style.display = "block";
      document.getElementById("free-shipping-threshold").innerText = dest.freeShippingThreshold.toFixed(2);
    }
  
    document.getElementById("price-total").innerText = total.toFixed(2);
  }