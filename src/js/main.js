'use strict';
//HTML
const btnSearch = document.querySelector('.js-search');
const btnReset = document.querySelector('.js-reset');
const btnResetFavorites = document.querySelector('.js-resetFavorites');
const inputSearch = document.querySelector('.js-input');
const cardsSection = document.querySelector('.js-cardContainer');
const favoriteSection = document.querySelector('.js-favouriteContainer');

//Arrays
let favorites = [];
let results = [];

//Functions

//Hacer que aparezcan los resultados de la búsqueda:
function handleClickResults(event) {
  event.preventDefault();
  const inputValue = inputSearch.value;
  fetch(`https://api.jikan.moe/v3/search/anime?q=${inputValue}`)
    .then((response) => response.json())
    .then((dataFromAPI) => {
      results = dataFromAPI.results;
      renderAllCards(results);
    });
}

//Renderizar una card con los datos de la API:
function renderCard(dataCard) {
  let articleClass = 'gray';
  let nameClass = 'gray';
  let likeIconClass = 'hidden';
  const indexResult = favorites.findIndex((favorite) => dataCard.mal_id === favorite.id);
  if (indexResult !== -1) {
    articleClass = 'favourite_border';
    nameClass = 'favourite_color';
    likeIconClass = 'like';
  }
  cardsSection.innerHTML += `
    <li class="results__container--card ${articleClass} js-card" data-name="${
    dataCard.title
  }" data-img="${dataCard.image_url}" data-id="${dataCard.mal_id}">
  <div class="js-like ${likeIconClass}"><i class="like__icon fas fa-heart"></i></div>
    <img class="img"
        src="${dataCard.image_url || 'https://via.placeholder.com/200x250/ffffff/666666/?text=img'}"
        alt="caratula de la serie" />
    <h3 class="name ${nameClass} js-name">${dataCard.title}</h3>
</li>`;
}

//Renderizar las 50 cards que te devuelve la API:
function renderAllCards(cards) {
  cardsSection.innerHTML = '';
  if (cards === undefined) {
    cardsSection.innerHTML += `<p class="results__container--text">Ha ocurrido un error. No hemos encontrado resultados para tu búsqueda.</p>`;
  } else {
    for (const card of cards) {
      renderCard(card);
    }
    const allCards = document.querySelectorAll('.js-card');
    for (const card of allCards) {
      card.addEventListener('click', handleClickCard);
    }
  }
}

//Funcionalidad del botón de reset del input:
function handleClickResetResults(event) {
  event.preventDefault();
  inputSearch.value = '';
  cardsSection.innerHTML = '';
  results = [];
}

//Cambiar el style de las cards de resultados al clickarlas y añadirlas al array "favorites" para renderizarlas:
function handleClickCard(event) {
  const selectedCard = event.currentTarget;
  const name = selectedCard.querySelector('.js-name');
  const likeIcon = selectedCard.querySelector('.js-like');
  const favoriteData = {
    name: selectedCard.dataset.name,
    url: selectedCard.dataset.img,
    id: parseInt(selectedCard.dataset.id),
  };
  const indexResult = favorites.findIndex((favoriteCard) => favoriteCard.id === favoriteData.id);
  if (indexResult === -1) {
    console.log(selectedCard);
    selectedCard.classList.remove('gray');
    selectedCard.classList.add('favourite_border');
    name.classList.remove('gray');
    name.classList.add('favourite_color');
    likeIcon.classList.remove('hidden');
    likeIcon.classList.add('like');
    favorites.push(favoriteData);
    renderAllFavorites(favorites);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  } else {
    selectedCard.classList.remove('favourite_border');
    selectedCard.classList.add('gray');
    name.classList.remove('favourite_color');
    name.classList.add('gray');
    likeIcon.classList.remove('like');
    likeIcon.classList.add('hidden');
    favorites.splice(indexResult, 1);
    renderAllFavorites(favorites);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

//Renderizar una card de favoritos con los datos de array "favorites":
function renderFavoriteCard(favoriteItem) {
  favoriteSection.innerHTML += `<li class="favorites__container--card" data-id="${favoriteItem.id}">
  <img class="img"
      src="${favoriteItem.url}"
      alt="caratula de la serie" />
  <h3 class="title">${favoriteItem.name}
  </h3>
  <button class="esc js-btnEsc"><i class="icon fas fa-times"></i></button>
</li>
    `;
}

//Renderizar todas las cards del array "favorites":
function renderAllFavorites(favorites) {
  favoriteSection.innerHTML = '';
  if (favorites.length === 0) {
    favoriteSection.innerHTML += `<li class="favorites__container--text">Aún no tienes ningún favorito añadido.</li>`;
    btnResetFavorites.classList.add('hidden');
    btnResetFavorites.classList.remove('bin');
  } else {
    btnResetFavorites.classList.remove('hidden');
    btnResetFavorites.classList.add('bin');
    for (const favoriteItem of favorites) {
      renderFavoriteCard(favoriteItem);
    }
    const allBtnEsc = document.querySelectorAll('.js-btnEsc');
    for (const btnEsc of allBtnEsc) {
      btnEsc.addEventListener('click', handleClickBtnEsc);
    }
  }
}

//Funcionalidad del botón "esc" de las cards de favoritos:
function handleClickBtnEsc(event) {
  const selectedFavouriteCard = event.currentTarget.parentNode;

  const indexResult = favorites.findIndex(
    (favorite) => parseInt(selectedFavouriteCard.dataset.id) === favorite.id
  );
  if (indexResult !== -1) {
    favorites.splice(indexResult, 1);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    renderAllFavorites(favorites);
    renderAllCards(results);
  }
}

function getFavoritesFromLocalStorage() {
  const savedFavorites = localStorage.getItem('favorites');
  if (savedFavorites === null) {
    favorites = [];
  } else {
    favorites = JSON.parse(savedFavorites);
    renderAllFavorites(favorites);
  }
}

getFavoritesFromLocalStorage();

//Funcionalidad botón de reset de la seccion favoritos:
function handleClickResetFavorites() {
  favorites = [];
  localStorage.setItem('favorites', JSON.stringify(favorites));
  renderAllFavorites(favorites);
  renderAllCards(results);
}

//Listener
btnSearch.addEventListener('click', handleClickResults);
btnReset.addEventListener('click', handleClickResetResults);
btnResetFavorites.addEventListener('click', handleClickResetFavorites);
