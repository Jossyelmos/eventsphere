import { renderEventWithTemplate } from "./utils.mjs";
import { reverseGeocode } from "./EventDetails.mjs"; // adjust path

function eventCardTemplate(event, address = "Loading...") {
  return `
    <div class="event-card" id="event-${event.id}">
      <a href="/event_pages/index.html?id=${event.id}">
        <h3>${event.title}</h3>
        <p>Date: <span>${new Date(event.start).toLocaleDateString()}</span></p>
        <p>Category: <span>${event.category}</span></p>
        <div class="location">
          <p class="event-location">Location: </p>
          <p class="event-address">${address}</p>
        </div>
      </a>
    </div>
  `;
}

export default class EventList {
  constructor(event, dataSource, listElement) {
    this.event = event;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const events = await this.dataSource.getData();
    this.renderList(events);
  }

  async renderList(events) {
    // CLEAR OLD RESULTS
    this.listElement.innerHTML = "";
  
    // Render placeholders
    events.forEach(event => {
      const template = eventCardTemplate(event, "Loading...");
      this.listElement.insertAdjacentHTML("beforeend", template);
    });
  
    // Update addresses async
    events.forEach(async event => {
      let address = "Location unavailable";
  
      if (event.location && Array.isArray(event.location)) {
        const [lng, lat] = event.location;
        address = await reverseGeocode(lat, lng);
      }
  
      const card = document.querySelector(`#event-${event.id} .event-address`);
      if (card) card.textContent = address;
    });
  }
  
}
