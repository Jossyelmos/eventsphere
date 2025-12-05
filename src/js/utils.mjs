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
}

export async function loadFilter() {
  const filterContent = await loadTemplate('/partials/filter.html');

  const filter = document.querySelector('.filters');

  renderWithTemplate(filterContent, filter);
}