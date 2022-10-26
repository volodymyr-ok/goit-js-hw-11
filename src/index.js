import axios from 'axios';
import { Notify } from 'notiflix';

const getEl = selector => document.querySelector(selector);
const searchForm = getEl('.search-form');
const searchBtn = getEl('.search-btn');
const gallery = getEl('.gallery');
const USER_KEY = '30862042-0df1a58bd13a46a6d149ce250';

const pixURL = 'https://pixabay.com/api/';

const queryParams = new URLSearchParams({
  key: USER_KEY,
  q: searchForm.value,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

// searchBtn.addEventListener('click', actionOnSearchBtn);

console.log(queryParams);

// gallery.innerHTML = `<div class="photo-card">
//   <img src="" alt="${tags}" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>${likes}</b>
//     </p>
//     <p class="info-item">
//       <b>${views}</b>
//     </p>
//     <p class="info-item">
//       <b>${comments}</b>
//     </p>
//     <p class="info-item">
//       <b>${downloads}</b>
//     </p>
//   </div>
// </div>`;
