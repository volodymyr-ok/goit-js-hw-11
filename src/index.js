import axios from 'axios';
import { Notify } from 'notiflix';
const getEl = selector => document.querySelector(selector);

const searchBtn = getEl('.search-btn');
const searchInput = getEl('input[name="searchQuery"]');
const gallery = getEl('.gallery');
const loadMoreBtn = getEl('.load-more');
const path = 'https://pixabay.com/api/';
const USER_KEY = '30862042-0df1a58bd13a46a6d149ce250';
let pageNumber = 1;

searchBtn.addEventListener('click', actionOnSearchBtn);

loadMoreBtn.classList.add('visually-hidden');
loadMoreBtn.addEventListener('click', actionOnLoadBtn);

function actionOnSearchBtn(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('visually-hidden');
  pageNumber = 1;

  const queryParams = new URLSearchParams({
    key: USER_KEY,
    q: searchInput.value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: pageNumber,
    per_page: 40,
  });

  dataFetch(queryParams);
}

function actionOnLoadBtn() {
  const queryParams = new URLSearchParams({
    key: USER_KEY,
    q: searchInput.value,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: pageNumber,
    per_page: 40,
  });

  dataFetch(queryParams);
}

async function dataFetch(params) {
  try {
    const result = await axios.get(`${path}?${params}`);

    if (result.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    gallery.insertAdjacentHTML(
      'beforeend',
      result.data.hits.map(updateMarkup).join('')
    );

    if (result.data.hits.length < 40) {
      loadMoreBtn.classList.add('visually-hidden');

      Notify.info(`We're sorry, but you've reached the end of search results.`);
    } else {
      loadMoreBtn.classList.remove('visually-hidden');
    }

    pageNumber++;
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
}) {
  return `
                      <div class="photo-card">
                        <img src=${webformatURL} alt="${tags}" loading="lazy" />
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
