import axios from 'axios';
import { Notify } from 'notiflix';
const getEl = selector => document.querySelector(selector);
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import debounce from 'lodash.debounce';

// let lightbox = new SimpleLightbox('.gallery a', {
//   captionDelay: 250,
//   captionsData: 'alt',
// });
// console.log(lightbox);

// const searchBtn = getEl('.search-btn');
// const searchInput = getEl('input[name="searchQuery"]');
const searchForm = getEl('.search-form');
const gallery = getEl('.gallery');
const loadMoreBtn = getEl('.load-more');
const path = 'https://pixabay.com/api/';
const USER_KEY = '30862042-0df1a58bd13a46a6d149ce250';
let pageNumber = 1;
// let total = 0;

searchForm.addEventListener('submit', actionOnSearchBtn);

loadMoreBtn.classList.add('visually-hidden');
loadMoreBtn.addEventListener('click', actionOnLoadBtn);

function actionOnSearchBtn(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('visually-hidden');
  pageNumber = 1;

  dataFetch();
}

function actionOnLoadBtn() {
  dataFetch();
}

// onscroll = event => {
//   let vieportPostion = getEl('body').clientHeight - window.scrollY;
//   let clientVieportHeight = getEl('body').clientHeight;
//   if (vieportPostion - window.innerHeight <= clientVieportHeight * 0.1) {
//     // scrollThis();
//     // async function scrollThis() {
//     // const result = await axios.get(`${path}?${queryParams}`);
//     // if (result.data.totalHits <= gallery.children.length) {
//     //   return;
//     // }
//     // if (result.data.totalHits !== gallery.children.length) {
//     //   return;
//     // }
//     console.log(total);
//     console.log(gallery.children.length);
//     if (total === gallery.children.length) {
//       return;
//     }
//     // debounce(dataFetch(), 1000);
//     dataFetch();
//   }
// };

async function dataFetch() {
  const queryParams = new URLSearchParams({
    key: USER_KEY,
    q: searchForm.searchQuery.value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: pageNumber,
    per_page: 40,
  });

  try {
    const result = await axios.get(`${path}?${queryParams}`);
    // total = result.data.totalHits;

    console.log(result);

    if (result.data.hits.length === 0) {
      // debounce(
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      //   1000
      // );
      return;
    } else if (pageNumber === 1) {
      loadMoreBtn.classList.remove('visually-hidden');

      Notify.success(`Hooray! We found ${result.data.totalHits} images.`);
    } else if (result.data.totalHits === gallery.children.length) {
      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }

    gallery.insertAdjacentHTML(
      'beforeend',
      result.data.hits.map(updateMarkup).join('')
    );

    // lightbox.refresh();
    pageNumber++;

    if (result.data.totalHits <= gallery.children.length) {
      loadMoreBtn.classList.add('visually-hidden');

      Notify.info(`We're sorry, but you've reached the end of search results.`);
    }
  } catch (error) {
    throw new Error('No, boss ===> ' + error.message);
  }
}

function updateMarkup({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
  largeImageURL,
}) {
  return `
  <div class="photo-card">
  <a href="${largeImageURL} class="photo-link" target='_blank'>
              <img src=${webformatURL} alt="${tags}" loading="lazy" class="photo-preview" />
              <div class="info">
                <p class="info-item">
                  <b>🌟</b> ${likes}
                </p>
                <p class="info-item">
                  <b>👓</b> ${views}
                </p>
                <p class="info-item">
                  <b>🎭</b> ${comments}
                </p>
                <p class="info-item">
                  <b>📦</b> ${downloads}
                </p>
              </div>
              </a>
              </div>
  `;
}
