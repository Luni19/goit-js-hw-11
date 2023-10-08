import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './fetchImages';

const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');

let query = '';
let page = 1;
const simpleLightBox = new SimpleLightbox('.gallery a');
const perPage = 40;

searchForm.addEventListener('submit', onSearchForm);

function renderGallery(images) {
  // Перевірка чи існує галерея перед вставкою даних
  if (!gallery) {
    return;
  }

  const markup = images
    .map(image => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item" id="${id}">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Лайки:</b> ${likes}</p>
              <p class="info-item"><b>Перегляди:</b> ${views}</p>
              <p class="info-item"><b>Коментарі:</b> ${comments}</p>
              <p class="info-item"><b>Завантаження:</b> ${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup); 
}

function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  query = e.currentTarget.elements.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure(
      'Рядок пошуку не може бути порожнім. Будь ласка, вкажіть свій пошуковий запит.',
    );
    return;
  }

  fetchImages(query, page, perPage)
    .then(data => {
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'На жаль, зображень, що відповідають вашому запиту, не знайдено. Будь ласка, спробуйте ще раз.',
        );
      } else {
        renderGallery(data.hits);
        simpleLightBox.refresh();
        Notiflix.Notify.success(`Ура! Ми знайшли ${data.totalHits} зображень.`);
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onloadMore() {
  page += 1;

  fetchImages(query, page, perPage)
    .then(data => {
      renderGallery(data.hits);
      simpleLightBox.refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page > totalPages) {
        Notiflix.Notify.failure(
          'На жаль, ви дійшли до кінця результатів пошуку.',
        );
      }
    })
    .catch(error => console.log(error));
}

function checkIfEndOfPage() {
  return (
    window.innerHeight + window.pageYOffset >=
    document.documentElement.scrollHeight
  );
}

// Функція, яка виконується, якщо користувач дійшов до кінця сторінки
function showLoadMorePage() {
  if (checkIfEndOfPage()) {
    onloadMore();
  }
}

// Додати подію на прокручування сторінки, яка викликає функцію showLoadMorePage
window.addEventListener('scroll', showLoadMorePage);

// кнопка "вгору"
arrowTop.onclick = function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // після scrollTo відбудеться подія "scroll", тому стрілка автоматично сховається
};

window.addEventListener('scroll', function () {
  arrowTop.hidden = scrollY < document.documentElement.clientHeight;
});