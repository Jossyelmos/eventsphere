// filter.js
import FilterEvents from "./FilterEvents.mjs";
import EventData from "./EventData.mjs";
import EventList from "./EventList.mjs";

let allEvents = [];
let eventList;

export async function initFilters() {
  const dataSource = new EventData();
  const listElement = document.querySelector(".event-list");

  allEvents = await dataSource.getData();

  eventList = new EventList(null, { getData: () => allEvents }, listElement);
//   eventList.renderList(allEvents);

  // New filter events
  document.getElementById("attendanceFilter").addEventListener("change", applyFilters);
  document.getElementById("rankFilter").addEventListener("change", applyFilters);

  // Existing filters
  document.getElementById("searchInput").addEventListener("input", applyFilters);
  document.getElementById("categoryFilter").addEventListener("change", applyFilters);
//   document.getElementById("dateFilter").addEventListener("change", applyFilters);
}

function applyFilters() {
  const search = document.getElementById("searchInput").value;
  const category = document.getElementById("categoryFilter").value;
//   const date = document.getElementById("dateFilter").value;
  const attendance = document.getElementById("attendanceFilter").value;
  const rank = document.getElementById("rankFilter").value;

  const filters = { search, category, attendance, rank };

  const filtered = FilterEvents.apply(allEvents, filters);
  eventList.renderList(filtered);
}
