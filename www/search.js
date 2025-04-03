document.addEventListener('DOMContentLoaded', async () => {
    const gallery = document.getElementById('gallery');
    const searchI = document.getElementById('search-info');
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
  
    updateCartLink();
  
    if (!query) {

      const highlights = await fetch('highlights.json').then(res => res.json());
      const objects = await fetchObjects(highlights.highlights.slice(0, 100));
      displayResults(objects);
      searchI.innerText = 'Search our collection of more than 400,000 artworks.';
    } else {
      searchI.innerText = `Searching for “${query}”…`;
      const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${query}`;
      const res = await fetch(searchUrl);
      const data = await res.json();
      const objectIDs = (data.objectIDs || []).slice(0, 100);
      const objects = await fetchObjects(objectIDs);
      displayResults(objects);
      const plural = objects.length === 1 ? 'artwork' : 'artworks';
      searchI.innerText = `Found ${objects.length} ${plural} for “${query}”`;
    }
  
    function displayResults(objects) {
      gallery.innerHTML = '';
      for (const obj of objects) {
        const thumb = document.createElement('div');
        thumb.className = 'thumb';
  
        const link = document.createElement('a');
        link.href = `framing.html?objectID=${obj.objectID}`;
        link.id = `object-${obj.objectID}`;
  
        const img = document.createElement('img');
        img.src = obj.primaryImageSmall;
        img.alt = obj.title;
  
        const label = document.createElement('div');
        label.className = 'museum-label';
        label.innerHTML = `
          <span class="artist">${obj.artistDisplayName}</span>
          <span class="title">${obj.title}</span>,
          <span class="date">${obj.objectDate}</span>
        `;
  
        link.appendChild(img);
        link.appendChild(label);
        thumb.appendChild(link);
        gallery.appendChild(thumb);
      }
    }
  
    async function fetchObjects(ids) {
      const objects = [];
      for (const id of ids) {
        const cached = localStorage.getItem(`object-${id}`);
        if (cached) {
          objects.push(JSON.parse(cached));
          continue;
        }
  
        try {
          const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
          const obj = await res.json();
          if (obj.primaryImageSmall) {
            localStorage.setItem(`object-${id}`, JSON.stringify(obj));
            objects.push(obj);
          }
        } catch {}
      }
      return objects;
    }
  
    function updateCartLink() {
      const cartLink = document.getElementById('cart-link');
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      if (cart.length > 0) {
        cartLink.innerText = `Cart (${cart.length})`;
      }
    }
  });
  