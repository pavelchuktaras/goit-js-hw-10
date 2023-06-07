const API_KEY =
  'live_9JwkVoRLNkWl8YtgtMdRELfCTRbT78WoQFo2SF8fEHdKBxntfyuFWfi3I7xxP66K';

function fetchBreeds(id) {
  const url = `https://api.thecatapi.com/v1/breeds?api_key=${API_KEY}`;
  return fetch(url).then(res => res.json());
}

function fetchCatByBreed(breedId) {
  const url = `https://api.thecatapi.com/v1/images/search?api_key=${API_KEY}&breed_ids=${breedId}`;
  return fetch(url).then(res => res.json());
}

export { fetchBreeds, fetchCatByBreed };
