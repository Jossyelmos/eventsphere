import Auth from "./Auth.mjs";

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const event = urlParams.get(param);
  return event;
}

function setupAuthNav() {
  const auth = new Auth();
  const user = auth.getUser();

  const loginLink = document.getElementById("loginLink");
  const signupLink = document.getElementById("signupLink");
  const logoutLink = document.getElementById("logoutLink");

  if (user) {
      loginLink.style.display = "none";
      signupLink.style.display = "none";
      logoutLink.style.display = "block";

      document.getElementById("logoutBtn").addEventListener("click", (e) => {
          e.preventDefault();
          auth.logout();
          window.location.href = "/index.html";
      });
  } else {
      loginLink.style.display = "block";
      signupLink.style.display = "block";
      logoutLink.style.display = "none";
  }
}


export function renderEventWithTemplate(template, parentElement, event, position = "afterbegin", clear = false) {
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  
  const htmlStrings = event.map(template);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  // if clear is true we need to clear out the contents of the parent.

  parentElement.innerHTML = template;

  if(callback){
    callback(data);
  }
}

export async function loadTemplate(path){
  const file = await fetch(path);
  const result = await file.text();
  return result;
}

export async function loadHeaderFooter(){
  const headerContent= await loadTemplate('/partials/header.html');
  const footerContent= await loadTemplate('/partials/footer.html');

  const header = document.getElementById('main-header');
  const footer = document.getElementById('main-footer');

  renderWithTemplate(headerContent, header);
  renderWithTemplate(footerContent, footer);

  loadNavbar();
  setupAuthNav(); 
}

export async function loadFilter() {
  const filterContent = await loadTemplate('/partials/filter.html');

  const filter = document.querySelector('.filters');

  renderWithTemplate(filterContent, filter);
}

export function loadNavbar() {
  const hamButton = document.querySelector('#menu');
  const navigation = document.querySelector('.navigation');
  const title = document.querySelector('.logo');
  const mainContent = document.querySelector('main');

  if (hamButton && navigation && title) {
    hamButton.addEventListener('click', () => {
      navigation.classList.toggle('open');
      hamButton.classList.toggle('open');

      // Dynamically push down content when nav opens
        if (navigation.classList.contains('open')) {
          // Temporarily display nav to get its height
          navigation.style.display = 'flex';
          const navHeight = navigation.offsetHeight;
          mainContent.style.marginTop = navHeight + 'px';
        } else {
          mainContent.style.marginTop = '0';
          navigation.style.display = '';
        }
    });
  };

}
