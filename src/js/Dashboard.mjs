import { getLocalStorage } from "./utils.mjs";
import Auth from "./Auth.mjs";
import UserEvents from "./UserEvents.mjs";
import EventData from "./EventData.mjs";

export default class Dashboard {
  constructor(userInfoEl, savedEventsEl, recommendedEl) {
    this.userInfoEl = userInfoEl;
    this.savedEventsEl = savedEventsEl;
    this.recommendedEl = recommendedEl;

    this.user = null;
    this.userProfile = null;
  }

  async init() {
    const auth = new Auth();
    this.user = auth.getUser();

    if (!this.user) {
      this.userInfoEl.innerHTML = "<p>Please login to access your dashboard.</p>";
      return;
    }

    this.loadProfile();
    this.loadSavedEvents();
    await this.loadRecommendedEvents();
  }

  loadProfile() {
    const profiles = JSON.parse(getLocalStorage("userProfiles")) || {};
    this.userProfile = profiles[this.user];

    this.userInfoEl.innerHTML = `
      <p><strong>Username:</strong> ${this.user}</p>
      <p><strong>Email:</strong> ${this.userProfile.email}</p>
      <p><strong>Interests:</strong> ${this.userProfile.interests.join(", ")}</p>
    `;
  }

  loadSavedEvents() {
    const userEvents = new UserEvents(this.user);
    const saved = userEvents.getSavedEvents();

    if (saved.length === 0) {
      this.savedEventsEl.innerHTML = "<p>No saved events yet.</p>";
      return;
    }

    this.savedEventsEl.innerHTML = saved
      .map(
        (e) => `
        <div class="event-card">
          <h3>${e.title}</h3>
          <p>${new Date(e.start).toLocaleDateString()}</p>
          <p>Category: ${e.category}</p>
        </div>
      `
      )
      .join("");
  }

  async loadRecommendedEvents() {
    const api = new EventData();
    const allEvents = await api.getData();

    const interests = this.userProfile.interests;

    let recommended = allEvents.filter((ev) =>
      interests.includes(ev.category)
    );

    recommended = recommended.slice(0, 5);

    if (recommended.length === 0) {
      this.recommendedEl.innerHTML = "<p>No recommendations yet.</p>";
      return;
    }

    this.recommendedEl.innerHTML = recommended
      .map(
        (e) => `
        <div class="event-card">
          <h3>${e.title}</h3>
          <p>${new Date(e.start).toLocaleDateString()}</p>
          <p>Category: ${e.category}</p>
        </div>
      `
      )
      .join("");
  }
}
