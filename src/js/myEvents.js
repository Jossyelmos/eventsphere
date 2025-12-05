import { loadHeaderFooter } from "./utils.mjs";
import MyEvents from "./MyEvents.mjs";

loadHeaderFooter();

const container = document.querySelector(".saved-events");

const myEvents = new MyEvents(container);
myEvents.init();