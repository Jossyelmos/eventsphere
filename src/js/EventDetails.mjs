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
    const [lng, lat] = event.location;  
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

    const saved = userEvents.saveEvent(event);

    if (saved) {
      alert("Event saved!");
    } else {
      alert("Event already saved.");
    }
    console.log("All saved events:", userEvents.getSavedEvents());
  });
}


export async function reverseGeocode(lat, lng) {
  const apiKey = "3e9af639d4504b599936424fbe155163";

  const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const address =
      data.features?.[0]?.properties?.formatted || "Unknown location";

    return address;
  } catch (err) {
    console.error("Reverse Geocoding failed:", err);
    return "Location unavailable";
  }
}


