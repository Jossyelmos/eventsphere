import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors()); // allow front-end to call this backend

const EVENTBRITE_TOKEN = "YOUR_PRIVATE_TOKEN_HERE";

// Route: Get events
app.get("/api/events", async (req, res) => {
  try {
    const url = "https://www.eventbriteapi.com/v3/events/search/?q=music&location.address=Lagos,Nigeria";

    const apiRes = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${EVENTBRITE_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    const data = await apiRes.json();

    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: data });
    }

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server failed to fetch events" });
  }
});

app.listen(3000, () => {
  console.log("Backend server running on port 3000");
});
