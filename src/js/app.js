// Initialise the map centred on Newcastle
const map = L.map("map").setView([54.9783, -1.6178], 13);

// Add OpenStreetMap tiles
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Test marker
L.marker([54.9783, -1.6178])
  .addTo(map)
  .bindPopup("Newcastle city centre")
  .openPopup();
