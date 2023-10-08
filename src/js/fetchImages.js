import axios from 'axios';
import { KEY } from './api-key.js';

axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('Виникла помилка:', error);
    Notiflix.Notify.failure('Виникла помилка. Будь ласка, спробуйте пізніше.');
    return Promise.reject(error);
  },
);

const BASE_URL = 'https://pixabay.com/api/';

/**
 * Запитує зображення з сервера Pixabay.
 *
 * @param {string} query - Пошуковий запит.
 * @param {number} page - Номер сторінки результатів.
 * @param {number} perPage - Кількість результатів на сторінці.
 * @returns {Promise<object>} - Об'єкт з даними зображень.
 */
async function fetchImages(query, page, perPage) {
  const params = {
    key: KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: page,
    per_page: perPage,
  };

  try {
    const response = await axios.get('', { params });
    return response.data;
  } catch (error) {
    console.error('Виникла помилка:', error);
    throw error;
  }
}

export { fetchImages };