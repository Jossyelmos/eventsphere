import Auth from "./Auth.mjs";
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const auth = new Auth();
auth.init();

document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const interests = [...document.querySelectorAll("input[type=checkbox]:checked")]
    .map(i => i.value);

  const res = auth.signup(username, password, interests);

  if (!res.success) {
    alert(res.message);
    return;
  }

  alert("Signup successful! Please log in.");
  window.location.href = "login.html";
});
