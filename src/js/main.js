const token = "63M_vgx2nlv1qX9sZxfwTsNMQm8C77Qmf6YSEARl";

const eventsContainer = document.querySelector(".upcoming");

async function getEvents() {
  try {
    const response = await fetch("https://api.predicthq.com/v1/events/?limit=20", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Events:", data.results);

    eventsContainer.innerHTML = "";

    data.results.forEach((event) => {
      const card = `
        <div class="event-card">
          <h3>${event.title}</h3>
          <p>Date: ${new Date(event.start).toLocaleDateString()}</p>
          <p>Category: ${event.category}</p>
          <p>Location: ${event.location?.join(", ") || "N/A"}</p>
        </div>
      `;
      eventsContainer.innerHTML += card;
    });
  } catch (error) {
    console.error("Error fetching events:", error);
  }
}

getEvents();