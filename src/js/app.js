const map = L.map("map").setView([54.9783, -1.6178], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Custom marker icon
const skateIcon = L.divIcon({
  className: "skate-marker",
  iconSize: [14, 14],
  iconAnchor: [7, 7],
  popupAnchor: [0, -10],
});

fetch("./data/spots.json")
  .then((response) => response.json())
  .then((spots) => {
    spots.forEach((spot) => {
      L.marker([spot.lat, spot.lng], { icon: skateIcon }).addTo(map).bindPopup(`
          <div class="popup-name">${spot.name}</div>
          <div class="popup-description">${spot.description || "No description available."}</div>
        `);
    });

    document.getElementById("spot-count").textContent =
      `${spots.length} spots across the North East`;
    document.getElementById("loader").classList.add("hidden");
  })
  .catch((error) => {
    console.error("Failed to load spots:", error);
    document.getElementById("loader").classList.add("hidden");
  });

// Find Me
const findMeBtn = document.getElementById("find-me");
let userMarker = null;

findMeBtn.addEventListener("click", () => {
  findMeBtn.textContent = "Locating...";
  findMeBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      if (userMarker) map.removeLayer(userMarker);

      userMarker = L.circleMarker([latitude, longitude], {
        radius: 10,
        fillColor: "#9b5de5",
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
    () => {
      alert(
        "Could not get your location. Please make sure location access is enabled.",
      );
      findMeBtn.textContent = "📍 Find Me";
      findMeBtn.disabled = false;
    },
  );
});

// Burger menu
const burger = document.getElementById("burger");
const navMenu = document.getElementById("nav-menu");
const navOverlay = document.getElementById("nav-overlay");

burger.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  navOverlay.classList.toggle("open");
});

navOverlay.addEventListener("click", () => {
  navMenu.classList.remove("open");
  navOverlay.classList.remove("open");
});

document.getElementById("nav-close").addEventListener("click", () => {
  navMenu.classList.remove("open");
  navOverlay.classList.remove("open");
});
