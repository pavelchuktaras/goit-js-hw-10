const refs = {
  select: document.querySelector('.breed-select'),
  div: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';
import 'notiflix/src/notiflix.css';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import { Spinner } from 'spin.js';
import 'spin.js/spin.css';

var spinner = new Spinner().spin();
refs.loader.appendChild(spinner.el);

Notiflix.Notify.init({
  position: 'center-top',
  distance: '40px',
  timeout: 3600000,
});

refs.select.classList.add('invisible');
refs.div.classList.add('invisible');
refs.loader.classList.add('invisible');

startLoading(refs.select);
fetchBreeds()
  .then(breeds => {
    if (!breeds.length) throw new Error('Data not found');
    const markup = breeds.map(createSelectOption).join('');
    return markup;
  })
  .then(updateSelect)
  .catch(onError)
  .finally(endLoading);

refs.select.addEventListener('change', onSelect);

function createSelectOption({ id, name }) {
  return `<option value="${id}">${name || 'Unknown'}</option>`;
}

function updateSelect(markup) {
  refs.select.innerHTML = markup;
  new SlimSelect({
    select: refs.select,
  });
  refs.select.classList.remove('invisible');
}

function onSelect(e) {
  startLoading(refs.div);
  fetchCatByBreed(e.target.value)
    .then(cats => {
      if (!cats.length) throw new Error('Data not found');
      const markup = cats.map(createCatInfo).join('');
      return markup;
    })
    .then(updateInfo)
    .catch(onError)
    .finally(endLoading);
}

function createCatInfo({ url, breeds }) {
  const { name, description, temperament } = breeds[0];
  return `
        <img class="cat-image" src="${url}" alt="${name || 'Unknown'}">
        <div class="cat-info-text">
            <h2>${name || 'Unknown'}</h2>
            <p>${description || 'Unknown'}</p>
            <p><b>Temperament: </b>${temperament || 'Unknown'}</p>
        </div>`;
}

function updateInfo(markup) {
  refs.div.innerHTML = markup;
  refs.div.classList.remove('invisible');
}

function startLoading(element) {
  element.classList.add('invisible');
  refs.loader.classList.remove('invisible');
}

function endLoading() {
  refs.loader.classList.add('invisible');
}
let errorOccurred = false;

function onError() {
  if (!errorOccurred) {
    errorOccurred = true;
    refs.loader.classList.add('invisible');
    refs.div.classList.add('invisible');
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  }
}

refs.select.addEventListener('click', () => {
  refs.error.classList.add('invisible');
});
refs.div.addEventListener('click', () => {
  refs.error.classList.add('invisible');
});
