import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import Auth from "./Auth.mjs";
import UserEvents from "./UserEvents.mjs";

const categoryImages = {
    concerts: "/images/categories/concerts.avif",
    sports: "/images/categories/sports.avif",
    community: "/images/categories/community.avif",
    festivals: "/images/categories/festivals.avif",
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

  document.querySelector("#eventDate").textContent = `Date: ${new Date(event.start).toLocaleString()}`;
  document.querySelector("#eventCategory").textContent = `Category: ${event.category}`;

  if (event.location && Array.isArray(event.location)) {
    const [lng, lat] = event.location;  // PredictHQ uses [lng, lat]
    const address = await reverseGeocode(lat, lng);
  
    // console.log("Reverse geocoded address:", address);
  
    document.querySelector("#eventLocation").textContent =
      `Address: ${address} || "Location unavailable"`;
  }
  

  document.querySelector("#eventDesc").textContent = `Description: ${event.description}` || "No description available";
  document.querySelector("#eventAttendance").textContent = `Attendance: ${event.phq_attendance}` || "No attendance available";
  document.querySelector("#eventRate").textContent = `Ranked: ${event.rank}` || "No ranking available";

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

async function reverseGeocode(lat, lng) {
    const apiKey = "ae7fe6f42e46455fa3bc3b7a0b0b63bb";
  
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
  
      if (data.results && data.results.length > 0) {
        return data.results[0].formatted;
      } else {
        return "Unknown location";
      }
    } catch (err) {
      console.error("Reverse geocoding failed:", err);
      return "Location unavailable";
    }
  }
  