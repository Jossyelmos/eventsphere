import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        dashboard: resolve(__dirname, "src/dashboard/index.html"),
        events: resolve(__dirname, "src/event/event.html"),
        myEvents: resolve(__dirname, "src/event/myEvent.html"),
        eventPages: resolve(__dirname, "src/event_pages/index.html"),
        signup: resolve(__dirname, "src/profile/signup.html"),
        login: resolve(__dirname, "src/profile/login.html"),
      },
    },
  },
});
