// Initialise the map centred on Newcastle
const map = L.map("map").setView([54.9783, -1.6178], 13);

// Add OpenStreetMap tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Load spots and place markers
fetch("./data/spots.json")
  .then((response) => response.json())
  .then((spots) => {
    spots.forEach((spot) => {
      L.marker([spot.lat, spot.lng]).addTo(map).bindPopup(`
          <div class="popup-name">${spot.name}</div>
          <div class="popup-description">${spot.description || "No description available."}</div>
        `);
    });
  })
  .catch((error) => console.error("Failed to load spots:", error));
