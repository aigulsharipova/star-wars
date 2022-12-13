const APP = {
  urls: {
    base: 'https://swapi.dev/api/',
    people: 'people/',
    planets: 'planets/',
    films: 'films/',
  },
  init: () => {
    APP.addListeners();
    APP.buildNav();
  },
  addListeners: () => {
    let nav = document.getElementById('nav');
    nav.addEventListener('click', APP.getData);
    footer.addEventListener('click', APP.getData);
  },
  buildNav: () => {
    let df = new DocumentFragment();
    for (let nm in APP.urls) {
      if (nm != 'base') {
        let link = document.createElement('a');
        link.href = `${APP.urls.base}${APP.urls[nm]}`;
        link.textContent = nm;
        link.setAttribute('data-link', `${APP.urls.base}${APP.urls[nm]}`);
        df.append(link);
      }
    }
    document.getElementById('nav').append(df);
  },
  getData: (ev) => {
    if (ev) ev.preventDefault();
    document.querySelector('.overlay').classList.add('active');
    let link = ev.target;
    let url = link.getAttribute('data-link');
    fetch(url)
      .then((resp) => {
        if (!resp.ok) throw new Error(resp.statusText);
        return resp.json();
      })
      .then(APP.buildList)
      .catch((err) => {
        console.error(err);
        document.querySelector('.overlay').classList.remove('active');
      });
  },
  buildList: (data) => {
    let m = document.getElementById('main');
    console.log(data);

    document.querySelector('.overlay').classList.remove('active');
    m.innerHTML = data.results
      .map((item) => {
        let nm = item.name || item.title;
        return `<p>${nm}</p>`;
      })
      .join(' ');
    let footer = document.getElementById('footer');
    footer.innerHTML = '';

    if (data.previous) {
      let prev = document.createElement('a');
      prev.href = data.previous;
      let url = new URL(data.previous);
      let labels = url.pathname.split('/');
      let label = labels[labels.length - 2];
      prev.textContent = `<< Previous ${label}`;
      prev.setAttribute('data-link', data.previous);
      footer.append(prev);
    }
    if (data.next) {
      let next = document.createElement('a');
      next.href = data.next;
      let url = new URL(data.next);
      let labels = url.pathname.split('/');
      let label = labels[labels.length - 2];
      next.textContent = `Next ${label} >>`;
      next.setAttribute('data-link', data.next);
      footer.append(next);
    }
  },
};

document.addEventListener('DOMContentLoaded', APP.init);