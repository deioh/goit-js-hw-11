import { defaultUrl, options } from './api';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// elements

const galleryEl = document.querySelector('.gallery');
const inputEl = document.querySelector('input[name="searchQuery"]');
const searchFormEl = document.querySelector('#search-form');
const lightbox = new simpleLightbox('.lightbox', {
  captionsData: 'alt',
  captionDelay: 250,
});

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
  //options.params.page++;
  galleryEl.innerHTML = '';
  //reachedEnd = false;

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
      reachedEnd = true;
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
  //inputEl.value = '';
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
            <b>Likes</b>
            ${likes}
          </p>
          <p class="info-item">
            <b>Views</b>
                ${views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${downloads}
          </p>
        </div>
      </div>
    </a>
    `;
      }
    )
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
}

// nextPageBtn.addEventListener('click', () => {
//   if (options.params.page * options.params.per_page >= totalHits) {
//     Notify.info("You've reached the end of search results.");
//     reachedEnd = true;
//     return;
//   }

//   options.params.page++;
//   onSearchFormSubmit(event);
//   console.log(options.params.page);
//   console.log(currentPage);
// });

async function loadMore() {
  if (options.params.page * options.params.per_page >= totalHits) {
    Notify.info("You've reached the end of search results.");
    reachedEnd = true;
    return;
  }
  console.log('Loading more images...');
  options.params.page++;
  try {
    console.log('Making API request...');
    const response = await axios.get(defaultUrl, options);
    const { hits } = response.data;
    console.log('Successfully fetched data:', hits);
    renderGallery(hits);
  } catch (error) {
    console.error('Error fetching data:', error);
    Notify.failure(error.message);
  }
}

function handleScroll() {
  console.log('Scroll event triggered.');
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight) {
    console.log('Scroll threshold reached.');
    loadMore();
  }
}

window.addEventListener('scroll', handleScroll);
