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

// Find Me button
const findMeBtn = document.getElementById("find-me");
let userMarker = null;

findMeBtn.addEventListener("click", () => {
  findMeBtn.textContent = "Locating...";
  findMeBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      // Remove previous user marker if it exists
      if (userMarker) {
        map.removeLayer(userMarker);
      }

      // Add a marker for the user's location
      userMarker = L.circleMarker([latitude, longitude], {
        radius: 10,
        fillColor: "#1a7a3c",
        color: "#ffffff",
        weight: 2,
        fillOpacity: 1,
      })
        .addTo(map)
        .bindPopup('<div class="popup-name">You are here</div>')
        .openPopup();

      map.setView([latitude, longitude], 15);

      findMeBtn.textContent = "📍 Find Me";
      findMeBtn.disabled = false;
    },
    (error) => {
      alert(
        "Could not get your location. Please make sure location access is enabled.",
      );
      findMeBtn.textContent = "📍 Find Me";
      findMeBtn.disabled = false;
    },
  );
});
