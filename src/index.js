import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import Notiflix from 'notiflix';
import 'notiflix/src/notiflix.css';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

const refs = {
  select: document.querySelector('.breed-select'),
  div: document.querySelector('.cat-info'),
  loader: document.querySelector('.loader'),
  error: document.querySelector('.error'),
};

refs.select.classList.add('hidden');
refs.div.classList.add('hidden');
refs.loader.classList.add('hidden');

onLoadingStart(refs.select);
fetchBreeds()
  .then(breeds => {
    if (!breeds.length) throw new Error('Data not found');
    const markup = breeds.map(createSelectOpt).join('');
    return markup;
  })
  .then(updateSelect)
  .catch(onError)
  .finally(onLoadingEnd);

refs.select.addEventListener('change', onSelect);

function createSelectOpt({ id, name }) {
  return `<option value="${id}">${name || 'Unknown'}</option>`;
}

function updateSelect(markup) {
  refs.select.innerHTML = markup;
  new SlimSelect({
    select: refs.select,
  });
  refs.select.classList.remove('hidden');
}

function onSelect(e) {
  onLoadingStart(refs.div);
  fetchCatByBreed(e.target.value)
    .then(cats => {
      if (!cats.length) throw new Error('Data not found');
      const markup = cats.map(catInfoMarkup).join('');
      return markup;
    })
    .then(updateInfo)
    .catch(onError)
    .finally(onLoadingEnd);
}

function catInfoMarkup({ url, breeds }) {
  const { name, description, temperament } = breeds[0];
  return `
        <img class="cat-image" src="${url}" alt="${name || 'Unknown'}">
        <div class="cat-info-text">
            <h2>${name || 'Unknown'}</h2>
            <p>${description || 'Unknown'}</p>
            <p><b>Temperament: </b>${temperament || 'Unknown'}</p>
        </div>`;
}

function onLoadingStart(element) {
  element.classList.add('hidden');
  refs.loader.classList.remove('hidden');
  Notiflix.Loading.arrows('Loading data, please wait...', {
    backgroundColor: 'rgba(0,0,0,0.5)',
  });
}

function updateInfo(markup) {
  refs.div.innerHTML = markup;
  refs.div.classList.remove('hidden');
}

function onLoadingEnd() {
  refs.loader.classList.add('hidden');
  Notiflix.Loading.remove();
}
let errorOccurred = false;
function onError() {
  if (!errorOccurred) {
    errorOccurred = true;
    refs.loader.classList.add('hidden');
    refs.div.classList.add('hidden');
    Notiflix.Notify.failure(
      'Oops! Something went wrong! Try reloading the page!'
    );
  }
}

refs.select.addEventListener('click', () => {
  refs.error.classList.add('hidden');
});
refs.div.addEventListener('click', () => {
  refs.error.classList.add('hidden');
});
