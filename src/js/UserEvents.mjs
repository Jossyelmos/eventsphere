import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class UserEvents {
    constructor(userId) {
      this.userId = userId;
  
      const data = JSON.parse(getLocalStorage("userEvents")) || {};
  
      // ensure the user entry exists AND is an array
      this.saved = Array.isArray(data[userId]) ? data[userId] : [];
  
      this._allUsers = data;
    }
  
    saveEvent(event) {
      // ensure saved array is valid
      if (!Array.isArray(this.saved)) {
        this.saved = [];
      }
  
      const exists = this.saved.some(e => e.id === event.id);
      if (exists) return false;
  
      this.saved.push(event);
  
      // update storage
      this._allUsers[this.userId] = this.saved;
      setLocalStorage("userEvents", JSON.stringify(this._allUsers));
  
      return true;
    }
  
    getSavedEvents() {
      return this.saved;
    }

    removeEvent(eventId) {
        this.saved = this.saved.filter((e) => e.id !== eventId);
        this._allUsers[this.userId] = this.saved;
      
        setLocalStorage("userEvents", JSON.stringify(this._allUsers));
      }
      
  }
  