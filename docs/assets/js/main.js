"use strict";const btnSearch=document.querySelector(".js-search"),btnReset=document.querySelector(".js-reset"),btnResetFavorites=document.querySelector(".js-resetFavorites"),inputSearch=document.querySelector(".js-input"),cardsSection=document.querySelector(".js-cardContainer"),favoriteSection=document.querySelector(".js-favouriteContainer");let favorites=[],results=[];function handleClickResults(e){e.preventDefault();const t=inputSearch.value;fetch("https://api.jikan.moe/v3/search/anime?q="+t).then(e=>e.json()).then(e=>{results=e.results,renderAllCards(results)})}function renderCard(e){let t="gray",s="gray",r="hidden";-1!==favorites.findIndex(t=>e.mal_id===t.id)&&(t="favourite_border",s="favourite_color",r="like"),cardsSection.innerHTML+=`\n    <li class="results__container--card ${t} js-card" data-name="${e.title}" data-img="${e.image_url}" data-id="${e.mal_id}">\n  <div class="js-like ${r}"><i class="like__icon fas fa-heart"></i></div>\n    <img class="img"\n        src="${e.image_url||"https://via.placeholder.com/200x250/ffffff/666666/?text=img"}"\n        alt="caratula de la serie" />\n    <h3 class="name ${s} js-name">${e.title}</h3>\n</li>`}function renderAllCards(e){if(cardsSection.innerHTML="",void 0===e)cardsSection.innerHTML+='<p class="results__container--text">Ha ocurrido un error. No hemos encontrado resultados para tu búsqueda.</p>';else{for(const t of e)renderCard(t);const t=document.querySelectorAll(".js-card");for(const e of t)e.addEventListener("click",handleClickCard)}}function handleClickResetResults(e){e.preventDefault(),inputSearch.value="",cardsSection.innerHTML="",results=[]}function handleClickCard(e){const t=e.currentTarget,s=t.querySelector(".js-name"),r=t.querySelector(".js-like"),a={name:t.dataset.name,url:t.dataset.img,id:parseInt(t.dataset.id)},i=favorites.findIndex(e=>e.id===a.id);-1===i?(console.log(t),t.classList.remove("gray"),t.classList.add("favourite_border"),s.classList.remove("gray"),s.classList.add("favourite_color"),r.classList.remove("hidden"),r.classList.add("like"),favorites.push(a),renderAllFavorites(favorites),localStorage.setItem("favorites",JSON.stringify(favorites))):(t.classList.remove("favourite_border"),t.classList.add("gray"),s.classList.remove("favourite_color"),s.classList.add("gray"),r.classList.remove("like"),r.classList.add("hidden"),favorites.splice(i,1),renderAllFavorites(favorites),localStorage.setItem("favorites",JSON.stringify(favorites)))}function renderFavoriteCard(e){favoriteSection.innerHTML+=`<li class="favorites__container--card" data-id="${e.id}">\n  <img class="img"\n      src="${e.url}"\n      alt="caratula de la serie" />\n  <h3 class="title">${e.name}\n  </h3>\n  <button class="esc js-btnEsc"><i class="icon fas fa-times"></i></button>\n</li>\n    `}function renderAllFavorites(e){if(favoriteSection.innerHTML="",0===e.length)favoriteSection.innerHTML+='<li class="favorites__container--text">Aún no tienes ningún favorito añadido.</li>',btnResetFavorites.classList.add("hidden"),btnResetFavorites.classList.remove("bin");else{btnResetFavorites.classList.remove("hidden"),btnResetFavorites.classList.add("bin");for(const t of e)renderFavoriteCard(t);const t=document.querySelectorAll(".js-btnEsc");for(const e of t)e.addEventListener("click",handleClickBtnEsc)}}function handleClickBtnEsc(e){const t=e.currentTarget.parentNode,s=favorites.findIndex(e=>parseInt(t.dataset.id)===e.id);-1!==s&&(favorites.splice(s,1),localStorage.setItem("favorites",JSON.stringify(favorites)),renderAllFavorites(favorites),renderAllCards(results))}function getFavoritesFromLocalStorage(){const e=localStorage.getItem("favorites");null===e?favorites=[]:(favorites=JSON.parse(e),renderAllFavorites(favorites))}function handleClickResetFavorites(){favorites=[],localStorage.setItem("favorites",JSON.stringify(favorites)),renderAllFavorites(favorites),renderAllCards(results)}getFavoritesFromLocalStorage(),btnSearch.addEventListener("click",handleClickResults),btnReset.addEventListener("click",handleClickResetResults),btnResetFavorites.addEventListener("click",handleClickResetFavorites);