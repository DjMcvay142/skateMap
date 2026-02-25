const map = L.map("map").setView([54.9783, -1.6178], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

const typeColours = {
  ledge: "#7b2ff7",
  stairset: "#e63946",
  bank: "#f4a261",
  rail: "#00b4d8",
  manual: "#2dc653",
  gap: "#f5c518",
  skatepark: "#ff006e",
  diy: "#a0522d",
};

function createIcon(type) {
  const colour = typeColours[type] || "#7b2ff7";
  return L.divIcon({
    className: "",
    html: `<div class="spot-marker" style="
      width: 14px;
      height: 14px;
      background: ${colour};
      border: 2px solid #ffffff;
      border-radius: 50%;
      box-shadow: 0 0 6px ${colour}99;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
      cursor: pointer;
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

// Store all markers with their type for filtering
let allMarkers = [];
let activeFilter = "all";

fetch("./data/spots.json")
  .then((response) => response.json())
  .then((spots) => {
    spots.forEach((spot) => {
      const marker = L.marker([spot.lat, spot.lng], {
        icon: createIcon(spot.type),
      }).addTo(map).bindPopup(`
  <div class="popup-name">${spot.name}</div>
  <div class="popup-type" style="background:${
    typeColours[spot.type]
  }22; color:${typeColours[spot.type]}; border: 1px solid ${
    typeColours[spot.type]
  }55">${spot.type}</div>
  <div class="popup-description">${
    spot.description || "No description available."
  }</div>
  ${spot.author ? `<div class="popup-author">Author: ${spot.author}</div>` : ""}
`);

      allMarkers.push({ marker, type: spot.type });

      marker.on("mouseover", function () {
        this.getElement().querySelector(".spot-marker").style.transform =
          "scale(1.6)";
      });

      marker.on("mouseout", function () {
        this.getElement().querySelector(".spot-marker").style.transform =
          "scale(1)";
      });
    });

    document.getElementById("spot-count").textContent =
      `${spots.length} spots across the North East`;
    document.getElementById("loader").classList.add("hidden");
  })
  .catch((error) => {
    console.error("Failed to load spots:", error);
    document.getElementById("loader").classList.add("hidden");
  });

// Filter logic
function applyFilter(type) {
  activeFilter = type;
  let visibleCount = 0;

  allMarkers.forEach(({ marker, type: spotType }) => {
    if (type === "all" || spotType === type) {
      marker.addTo(map);
      visibleCount++;
    } else {
      map.removeLayer(marker);
    }
  });

  const spotCount = document.getElementById("spot-count");
  if (type === "all") {
    spotCount.textContent = `${visibleCount} spots across the North East`;
  } else {
    spotCount.textContent = `${visibleCount} ${type} spots`;
  }

  // Update active button state
  document.querySelectorAll(".filter-option").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.type === type);
  });
}

document.querySelectorAll(".filter-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    applyFilter(btn.dataset.type);
  });
});

// Filter panel toggle
const filterBtn = document.getElementById("filter-btn");
const filterPanel = document.getElementById("filter-panel");

filterBtn.addEventListener("click", () => {
  filterPanel.classList.toggle("open");
});

document.getElementById("filter-close").addEventListener("click", () => {
  filterPanel.classList.remove("open");
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
      findMeBtn.textContent = "Find Me";
      findMeBtn.disabled = false;
    },
    () => {
      alert(
        "Could not get your location. Please make sure location access is enabled.",
      );
      findMeBtn.textContent = "Find Me";
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
