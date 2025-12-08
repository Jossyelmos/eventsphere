import EventData from "./EventData.mjs";
import { loadHeaderFooter, loadFilter,getLocalStorage } from "./utils.mjs";
import { initFilters } from "./filter";
import Auth from "./Auth.mjs";

const auth = new Auth();
auth.init();

const user = auth.getUser();

if (user) {
    const users = JSON.parse(getLocalStorage("userProfiles"));
    const interests = users[user].interests;
  
    // console.log("User interests:", interests);
  
    // you may auto-filter events here
    loadFilter();
    initFilters();
  }

loadHeaderFooter();
