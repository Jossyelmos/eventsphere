import { getParam } from "./utils.mjs";
import EventData from "./EventData.mjs";
import EventDetails from "./EventDetails.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const dataSource = new EventData();
const eventId = getParam("id");

if (eventId) {
    const event = new EventDetails(eventId, dataSource);

    event.init();
  } else {
    console.error("No event ID found in URL");
    document.querySelector(".event-detail").textContent = "Event not found.";
  }
  