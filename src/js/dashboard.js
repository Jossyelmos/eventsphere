import { loadHeaderFooter } from "./utils.mjs";
import Dashboard from "./Dashboard.mjs";

loadHeaderFooter();

const userInfoEl = document.querySelector("#user-info");
const savedEventsEl = document.querySelector(".saved-events");
const recommendedEl = document.querySelector(".recommended-events");

const dashboard = new Dashboard(userInfoEl, savedEventsEl, recommendedEl);
dashboard.init();