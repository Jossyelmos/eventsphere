import { renderEventWithTemplate } from "./utils.mjs";

function eventCardTemplate(event) {
  return `
    <div class="event-card">
      <a href="/event_pages/index.html?id=${event.id}">
        <h3>${event.title}</h3>
        <p>Date: ${new Date(event.start).toLocaleDateString()}</p>
        <p>Category: ${event.category}</p>
        <p>Location: ${event.location?.join(", ") || "N/A"}</p>
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
    const eventlist = await this.dataSource.getData();
    this.renderList(eventlist); // pass the fetched array
  }

  renderList(events) {
    if (!Array.isArray(events)) {
      console.error("renderList expected an array, got:", events);
      return;
    }
    renderEventWithTemplate(eventCardTemplate, this.listElement, events);
  }
}