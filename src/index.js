import { defaultUrl, options } from './api';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// elements

const galleryEl = document.querySelector('.gallery');
const inputEl = document.querySelector('input[name="searchQuery"]');
const searchFormEl = document.querySelector('#search-form');

let reachedEnd = false;
let totalHits = 0;

searchFormEl.addEventListener('submit', onSearchFormSubmit);

async function onSearchFormSubmit(event) {
  event.preventDefault();
  const query = inputEl.value.trim();

  if (!query) {
    Notify.failure('Please enter a search query');
    return;
  }
  options.params.q = query;
  options.params.page = 1;
  galleryEl.innerHTML = '';
  reachedEnd = false;

  try {
    const response = await axios.get(defaultUrl, options);
    const { hits } = response.data;
    totalHits = response.data.totalHits;
    console.log('totalHits :', totalHits);
    console.log(response);

    if (hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    renderGallery(hits);
  } catch (error) {
    console.error('Error fetching data:', error);
    Notify.failure(error.message);
  }
}

function renderGallery(hits) {
  Notify.success(`Found ${totalHits} images.`);
  inputEl.value = '';
  let markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
    <a href="${largeImageURL}" class="lightbox">    
      <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>"Likes : ${likes}"</b>
          </p>
          <p class="info-item">
            <b>${views}</b>
          </p>
          <p class="info-item">
            <b>${comments}</b>
          </p>
          <p class="info-item">
            <b>${downloads}</b>
          </p>
        </div>
      </div>
    </a>
    `;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
}
