import Auth from "./Auth.mjs";
import UserEvents from "./UserEvents.mjs";

export default class MyEvents {
  constructor(container) {
    this.container = container;
    this.user = null;
    this.userEvents = null;
  }

  init() {
    const auth = new Auth();
    this.user = auth.getUser();

    if (!this.user) {
      this.container.innerHTML = "<p>Please log in to view saved events.</p>";
      return;
    }

    this.userEvents = new UserEvents(this.user);
    this.renderList();
  }

  renderList() {
    const events = this.userEvents.getSavedEvents();

    if (!events || events.length === 0) {
      this.container.innerHTML = "<p>You have no saved events yet.</p>";
      return;
    }

    this.container.innerHTML = events
      .map(
        (event) => `
        <div class="event-card">
          <h3>${event.title}</h3>
          <p>Date: ${new Date(event.start).toLocaleString()}</p>
          <p>Category: ${event.category}</p>
          <button class="remove-btn" data-id="${event.id}">
            Remove
          </button>
        </div>
      `
      )
      .join("");

    this.addRemoveListeners();
  }

  addRemoveListeners() {
    const buttons = this.container.querySelectorAll(".remove-btn");

    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const eventId = e.target.dataset.id;

        this.userEvents.removeEvent(eventId);
        this.renderList();
      });
    });
  }
}
