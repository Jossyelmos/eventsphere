import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class Auth {
    constructor() {
      this.users = JSON.parse(getLocalStorage("userProfiles")) || {};
      this.currentUser = getLocalStorage("currentUser") || null;
    }
  
    init() {
      // nothing yet, but compatible with your architecture
    }
  
    signup(username, password, interests = []) {
      if (this.users[username]) {
        return { success: false, message: "Username already exists" };
      }
  
      this.users[username] = {
        password,
        interests,
        createdAt: Date.now(),
      };
  
      setLocalStorage("userProfiles", JSON.stringify(this.users));
  
      return { success: true };
    }
  
    login(username, password) {
      if (!this.users[username]) {
        return { success: false, message: "User does not exist" };
      }
  
      if (this.users[username].password !== password) {
        return { success: false, message: "Wrong password" };
      }
  
      this.currentUser = username;
      setLocalStorage("currentUser", username);
  
      return { success: true };
    }
  
    logout() {
      this.currentUser = null;
      localStorage.removeItem("currentUser");
    }
  
    getUser() {
      return this.currentUser;
    }
  
    getUserProfile(username) {
      return this.users[username];
    }
  }
  