import axios from 'axios';
import { Notify } from 'notiflix';
const getEl = selector => document.querySelector(selector);
import SimpleLightbox from 'simplelightbox';

// import debounce from 'lodash.debounce';

// const searchBtn = getEl('.search-btn');
// const searchInput = getEl('input[name="searchQuery"]');
const searchForm = getEl('.search-form');
const gallery = getEl('.gallery');
const loadMoreBtn = getEl('.load-more');
const path = 'https://pixabay.com/api/';
const USER_KEY = '30862042-0df1a58bd13a46a6d149ce250';
let pageNumber = 1;
let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  captionsData: 'alt',
});

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
//     async function scrollThis() {
//       const result = await axios.get(`${path}?${queryParams}`);

//       if (result.data.totalHits !== gallery.children.length) {
//         dataFetch();
//       }
//       scrollThis();
//     }
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

    console.log(gallery.children.length);

    if (result.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
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
    // SimpleLightbox.refresh();

    pageNumber++;

    if (result.data.totalHits === gallery.children.length) {
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
            <img src=${webformatURL} alt="${tags}" loading="lazy" class="photo-preview" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b> ${likes}
              </p>
              <p class="info-item">
                <b>Views</b> ${views}
              </p>
              <p class="info-item">
                <b>Comments</b> ${comments}
              </p>
              <p class="info-item">
                <b>Downloads</b> ${downloads}
              </p>
            </div>
          </div>
  `;
}

// <a class="photo-link" href="${largeImageURL}></a>
