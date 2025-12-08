import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import Auth from "./Auth.mjs";
import UserEvents from "./UserEvents.mjs";

const categoryImages = {
    concerts: "/images/categories/concerts.avif",
    sports: "/images/categories/sports.avif",
    community: "/images/categories/community.avif",
    festivals: "/images/categories/festival.avif",
    "performing-arts": "/images/categories/arts.avif",
    conferences: "/images/categories/conference.avif",
    "school-holidays": "/images/categories/holiday.jpg",
    // fallback
    default: "/images/event-placeholder.png"
  };
  
  

export default class EventDetails {
  constructor(eventId, dataSource) {
    this.eventId = eventId;
    this.event = {};
    this.dataSource = dataSource;
  }

  async init() {
    // show skeleton
    document.getElementById("eventSkeleton").style.display = "block";
    document.getElementById("eventContent").style.display = "none";
  
    this.event = await this.dataSource.findEventById(this.eventId);
  
    this.renderEventDetails();
  
    // hide skeleton
    document.getElementById("eventSkeleton").style.display = "none";
    document.getElementById("eventContent").style.display = "block";
  }
  

  renderEventDetails() {
    eventDetailsTemplate(this.event);
  }
}

async function eventDetailsTemplate(event) {
  document.querySelector("h2").textContent = `Event: ${event.title}`;
  document.querySelector("h3").textContent = `Country: ${event.country}`;

  const image = categoryImages[event.category] || categoryImages.default;


  const productImage = document.getElementById("eventImage");
  productImage.src = image;
  productImage.alt = event.title;

  document.querySelector("#eventDate").textContent = new Date(event.start).toLocaleString();
  document.querySelector("#eventCategory").textContent = event.category;

  if (event.location && Array.isArray(event.location)) {
    const [lng, lat] = event.location;  // PredictHQ uses [lng, lat]
    const address = await reverseGeocode(lat, lng);
  
    document.querySelector("#eventLocation").textContent =
      address || "Location unavailable";
  }
  

  document.querySelector("#eventDesc").textContent = event.description || "No description available";
  document.querySelector("#eventAttendance").textContent = event.phq_attendance || "No attendance available";
  document.querySelector("#eventRate").textContent = event.rank || "No ranking available";

  const saveBtn = document.getElementById("bookEvent");

  saveBtn.addEventListener("click", () => {
    const auth = new Auth();
    const username = auth.getUser();

    if (!username) {
      alert("Please login to save events.");
      return;
    }

    const userEvents = new UserEvents(username);

    const saved = userEvents.saveEvent(event); // <-- correct object

    if (saved) {
      alert("Event saved!");
    } else {
      alert("Event already saved.");
    }
    console.log("All saved events:", userEvents.getSavedEvents());
  });
}

// export async function reverseGeocode(lat, lng) {
  
//     const apiKey = "ae7fe6f42e46455fa3bc3b7a0b0b63bb";
  
//     const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
  
//     try {
//       const res = await fetch(url);
//       const data = await res.json();
  
//       if (data.results && data.results.length > 0) {
//         return data.results[0].formatted;
//       } else {
//         return "Unknown location";
//       }
//     } catch (err) {
//       console.error("Reverse geocoding failed:", err);
//       return "Location unavailable";
//     }
//   }
  
// export async function reverseGeocode(lat, lng) {
//   const apiKey = "ae7fe6f42e46455fa3bc3b7a0b0b63bb";
//   const cacheKey = "geoCache";

//   // Load cache safely
//   let cache = {};
//   try {
//     cache = JSON.parse(localStorage.getItem(cacheKey)) || {};
//   } catch (e) {
//     cache = {}; // corrupted cache → reset
//     localStorage.setItem(cacheKey, JSON.stringify({}));
//   }

//   const key = `${lat},${lng}`;

//   // Return cached value if available
//   if (cache[key]) return cache[key];

//   const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

//   try {
//     const res = await fetch(url);

//     // 402 = rate limit exceeded
//     if (res.status === 402) {
//       console.warn("OpenCage quota exceeded → fallback address");
//       cache[key] = "Unknown location";
//       localStorage.setItem(cacheKey, JSON.stringify(cache));
//       return "Unknown location";
//     }

//     const data = await res.json();

//     const address =
//       data.results?.[0]?.formatted || "Unknown location";

//     // Save address to cache
//     cache[key] = address;
//     localStorage.setItem(cacheKey, JSON.stringify(cache));

//     return address;
//   } catch (err) {
//     console.error("Reverse geocoding failed:", err);
//     return "Location unavailable";
//   }
// }

export async function reverseGeocode(lat, lng) {
  const apiKey = "ae7fe6f42e46455fa3bc3b7a0b0b63bb";
  const cacheKey = "geoCache";

  // Always ensure cache is an object
  let cache = getLocalStorage(cacheKey);
  if (!cache || typeof cache !== "object") cache = {};

  const coordKey = `${lat},${lng}`;

  // If cached, return it (NO API CALL)
  if (cache[coordKey]) return cache[coordKey];

  // Since API is now paid, DO NOT FETCH — return fallback
  const fallback = "Unknown location";

  // Save fallback in cache so it never rechecks this location
  cache[coordKey] = fallback;
  setLocalStorage(cacheKey, cache);

  return fallback;
}

