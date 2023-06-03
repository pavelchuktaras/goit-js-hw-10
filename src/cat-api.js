const API_KEY =
  'live_9JwkVoRLNkWl8YtgtMdRELfCTRbT78WoQFo2SF8fEHdKBxntfyuFWfi3I7xxP66K';

function fetchBreeds(id) {
  const url = `https://api.thecatapi.com/v1/breeds?api_key=${API_KEY}&breed_ids=${id}`;
  return fetch(url).then(res => res.json());
}

export { fetchBreeds };
