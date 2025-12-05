import Auth from "./Auth.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const auth = new Auth();
auth.init();

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = auth.login(username, password);

  if (!res.success) {
    alert(res.message);
    console.log("Not successful");
    return;
  }

  alert("Login successful!");
  window.location.href = "/index.html";
});
