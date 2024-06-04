import { fetchBreeds, fetchCatByBreed } from './cat-api';
import SlimSelect from 'slim-select';

const breedSelect = document.querySelector('.breed-select');

new SlimSelect({
  breedSelect,
});

let breedId;

hideElements(0);

breedSelect.addEventListener('change', event => {
  console.log('Change event occurred');
  breedId = event.target.value;
  console.log(`Selected breed ID: ${breedId}`);
  cat_Info();
});

console.log('Starting fetchBreeds...');
fetchBreeds()
  .then(breeds => {
    console.log(`fetchBreeds successful. Received ${breeds.length} breeds`);
    const options = breeds
      .map(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        return option;
      })
      .forEach(option => {
        console.log(`Appending option ${option.textContent} (${option.value})`);
        breedSelect.appendChild(option);
        hideElements(1);
      });
  })
  .catch(error => {
    console.error('Error fetchingBreeds:', error);
    hideElements(0);
  });

function cat_Info() {
  console.log('catInfo');
  const breed_Img = 'https://api.thecatapi.com/v1/images/search?breed_ids=';
  const catData = {};
  console.log(`Fetching breed by ID: ${breedId}`);

  fetchCatByBreed(breedId)
    .then(cat => {
      console.log(`Fetched cat data: ${JSON.stringify(cat)}`);
      catData.id = cat.id;
      catData.name = cat.name;
      catData.description = cat.description;
      catData.img = `${breed_Img}${cat.id}`;
      console.log(catData);

      if (!catData.id) {
        console.error('catData.id is null or undefined');
        return;
        hideElements(0);
      }

      fetch(catData.img)
        .then(response => {
          console.log(`Fetched response: ${response.status}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(img => {
          console.log(`Fetched image: ${JSON.stringify(img)}`);
          if (!img || !img.length) {
            console.error('img is null or empty');
            return;
          }
          catData.img = img[0].url;
          console.log('catData');
          console.log(catData.img);
          const catInfoDiv = document.querySelector('.cat-info');
          catInfoDiv.innerHTML = `
           <img src="${catData.img}" alt="${catData.name}" width="300" height="300">
           <h2>${catData.name}</h2>
           <p>${catData.description}</p>`;
          hideElements(1);
        })
        .catch(error => {
          console.error(`Error fetching cat image: ${error} `);
        });
    })
    .catch(error => {
      console.error(`Error fetching cat by ID: ${error} `);
      hideElements(0);
    });
}

function hideElements(tag) {
  const loader = document.querySelector('.loader');
  const error = document.querySelector('.error');

  if (tag === 1) {
    loader.style.display = 'none';
    error.style.display = 'none';
  } else {
    loader.style.display = 'block';
    error.style.display = 'block';
  }
}
