import EventData from "./EventData.mjs";
import EventList from "./EventList.mjs";
import { loadHeaderFooter, loadFilter } from "./utils.mjs";
import { initFilters } from "./filter";

loadHeaderFooter();
loadFilter();
initFilters();

const dataSource = new EventData();
const element = document.querySelector(".event-list");

const events = new EventList(null, dataSource, element);

events.init();