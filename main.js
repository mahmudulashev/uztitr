



const API_KEY = 'c31fbe3cd0f434bf9aa13ca577150f7d'; 
let currentCategory = 'movies';
let currentPage = 1;
let totalPages = 1;
let debounceTimeout;

function setCategory(category) {
  currentCategory = category;
  currentPage = 1;

  const genresContainer = document.getElementById('genres-container');
  const content = document.getElementById('content');
  const swiper = document.querySelector('.swiper');

  swiper.style.display = 'block';
  content.style.display = 'none';

  if (category === 'movies') {
    genresContainer.style.display = 'block';
    genresContainer.innerHTML = ''; 
    genres.forEach(genre => renderGenreSection(genre));
  } else if (category === 'series') {
    genresContainer.style.display = 'block';
    genresContainer.innerHTML = ''; 
    const seriesGenres = [
      { id: 10759, name: 'Jangari' },
      { id: 35, name: 'Komediya' },
      { id: 18, name: 'Drama' },
      { id: 10765, name: 'Ilmiy-Fantastik & Fentezi' },
      { id: 80, name: 'Jinoiy' },
      { id: 'top_rated', name: 'Yuqori Reytingli' }
    ];
    seriesGenres.forEach(genre => renderGenreSection(genre));
  } else {
    genresContainer.style.display = 'none';
  }

  loadData();
}

function loadData() {
  const url = currentCategory === 'movies'
    ? `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=vote_average.desc&vote_count.gte=500&page=${currentPage}`
    : `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&sort_by=vote_average.desc&vote_count.gte=500&page=${currentPage}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      totalPages = data.total_pages;
      showList(data.results); 
      renderPagination();
    })
    .catch(err => console.error('Ma\'lumotlarni yuklashda xatolik:', err));
}

function showList(items, listName = null) {
  const content = document.getElementById('content');
  content.className = 'grid';
  content.innerHTML = '';

  if (!items || items.length === 0) {
    content.innerHTML = '<p class="hech">Hech qanday natija topilmadi.</p>';
    return;
  }

  items.forEach(item => {
    const title = item.title || item.name;
    const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '';
    const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${poster}" alt="${title}" onclick='loadMovieDetails(${item.id}, "${mediaType}")'>
      <h3>${title}</h3>
      <p>${mediaType === 'movie' ? 'Film' : 'Serial'}</p>
      ${listName ? `<button onclick="removeFromList('${listName}', ${item.id})"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16 6V5.2C16 4.0799 16 3.51984 15.782 3.09202C15.5903 2.71569 15.2843 2.40973 14.908 2.21799C14.4802 2 13.9201 2 12.8 2H11.2C10.0799 2 9.51984 2 9.09202 2.21799C8.71569 2.40973 8.40973 2.71569 8.21799 3.09202C8 3.51984 8 4.0799 8 5.2V6M10 11.5V16.5M14 11.5V16.5M3 6H21M19 6V17.2C19 18.8802 19 19.7202 18.673 20.362C18.3854 20.9265 17.9265 21.3854 17.362 21.673C16.7202 22 15.8802 22 14.2 22H9.8C8.11984 22 7.27976 22 6.63803 21.673C6.07354 21.3854 5.6146 20.9265 5.32698 20.362C5 19.7202 5 18.8802 5 17.2V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></button>` : ''}
    `;
    content.appendChild(card);
  });
}

function showDetails(item) {
  console.log('Element:', item);
  currentItem = item;
  const title = item.title || item.name;
  const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '';
  const overview = item.overview || 'Hech qanday ma’lumot yo‘q';
  const year = (item.release_date || item.first_air_date || 'Noma’lum').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'Noma’lum';
  const votes = item.vote_count || '0';

  document.querySelector('.swiper').style.display = 'none';
  document.getElementById('genres-container').style.display = 'none';

  const content = document.getElementById('content');
  content.style.display = 'flex';
  content.className = 'page';
  content.innerHTML = `
    <div class="details" id="details">
      <img class="poster" src="${poster}" alt="Poster">
      <h2>${title}</h2>
      <div class="meta">
        <p>
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10H3M16 2V6M8 2V6M7.8 22H16.2C17.8802 22 18.7202 22 19.362 21.673C19.9265 21.3854 20.3854 20.9265 20.673 20.362C21 19.7202 21 18.8802 21 17.2V8.8C21 7.11984 21 6.27976 20.673 5.63803C20.3854 5.07354 19.9265 4.6146 19.362 4.32698C18.7202 4 17.8802 4 16.2 4H7.8C6.11984 4 5.27976 4 4.63803 4.32698C4.07354 4.6146 3.6146 5.07354 3.32698 5.63803C3 6.27976 3 7.11984 3 8.8V17.2C3 18.8802 3 19.7202 3.32698 20.362C3.6146 20.9265 4.07354 21.3854 4.63803 21.673C5.27976 22 5.11984 22 6.8 22Z" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <strong></strong> ${year}
        </p>
        <p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" id="Theater-Mask--Streamline-Plump" height="48" width="48"><desc>Theater Mask Streamline Icon: https://streamlinehq.com</desc><g id="theater-mask--hobby-theater-masks-drama-event-show-entertainment-travel-places"><path id="Union" fill="#fff" fill-rule="evenodd" d="M5.44709 2.50148C7.61365 2.02234 11.6492 1.5 19 1.5c7.3508 0 11.3863 0.52234 13.5529 1.00148 2.0483 0.453 3.2039 2.17268 3.414 3.98422 0.1157 0.99708 0.246 2.30855 0.3489 3.8506 -1.2119 -0.36549 -2.5446 -0.74518 -4.0104 -1.13793C25.0906 7.26518 20.8263 6.6698 18.311 6.55868c-3.6364 -0.16066 -6.2123 2.23739 -7.2503 4.85672 -0.7845 1.98 -1.9776 5.2438 -3.03436 9.1877 -0.88585 3.306 -1.07437 6.7368 -0.57731 10.0526C3.63576 26.7591 1.5 21.3947 1.5 15.8c0 -3.9385 0.29719 -7.28046 0.53309 -9.3143 0.21012 -1.81154 1.36566 -3.53122 3.414 -3.98422ZM31.5283 12.0966C24.428 10.1941 20.3948 9.65415 18.178 9.55622c-2.0958 -0.0926 -3.657 1.26938 -4.3288 2.96488 -0.7543 1.9035 -1.9063 5.0547 -2.9257 8.8589 -2.00303 7.4755 0.0556 15.583 5.852 20.8449 1.7885 1.6236 3.836 3.1812 5.6942 3.6791 1.8582 0.4979 4.4102 0.1727 6.7708 -0.3391 7.6508 -1.6587 13.4874 -7.6507 15.4904 -15.1262 1.0194 -3.8043 1.5973 -7.1093 1.8958 -9.1349 0.2659 -1.8042 -0.4052 -3.7644 -2.2664 -4.7321 -1.9688 -1.0235 -5.7316 -2.5726 -12.832 -4.4751Zm0.9516 12.6198c-0.7541 0.4009 -1.6192 0.6141 -2.2422 -0.2013 -0.5222 -0.6835 -0.3368 -1.6652 0.3463 -2.1502 0.0897 -0.0637 0.2544 -0.1735 0.4877 -0.2975 0.3089 -0.1642 0.7484 -0.3585 1.2925 -0.4925 1.1144 -0.2744 2.6328 -0.2822 4.2575 0.6558 1.6246 0.938 2.3771 2.2569 2.6967 3.3592 0.156 0.5382 0.2075 1.016 0.2197 1.3656 0.0092 0.264 -0.0034 0.4615 -0.0138 0.5711 -0.0785 0.8342 -0.836 1.4855 -1.689 1.375 -1.0176 -0.1318 -1.2655 -0.9875 -1.2954 -1.8411 -0.0054 -0.1555 -0.0291 -0.3809 -0.1029 -0.6352 -0.1399 -0.4827 -0.4656 -1.1059 -1.3153 -1.5965 -0.8497 -0.4906 -1.5523 -0.461 -2.0403 -0.3409 -0.2571 0.0633 -0.4642 0.1555 -0.6015 0.2285Zm-5.2664 -3.2538c0.3489 0.7612 0.0188 1.7044 -0.7752 2.0353 -0.9473 0.3947 -1.5898 -0.2226 -2.0424 -0.9468 -0.0825 -0.1319 -0.2157 -0.3152 -0.4067 -0.4986 -0.3626 -0.348 -0.9562 -0.7249 -1.9374 -0.7249s-1.5748 0.3769 -1.9374 0.7249c-0.191 0.1834 -0.3242 0.3667 -0.4067 0.4986 -0.0539 0.0863 -0.0832 0.1462 -0.0892 0.159 -0.3255 0.751 -1.1951 1.1037 -1.9531 0.7878 -0.7941 -0.3308 -1.1243 -1.2738 -0.7753 -2.0353 0.0153 -0.0334 0.0353 -0.0754 0.0602 -0.1247 0.0499 -0.0985 0.1202 -0.2275 0.2134 -0.3768 0.1855 -0.2966 0.4689 -0.6847 0.8731 -1.0728 0.8279 -0.7948 2.139 -1.5607 4.015 -1.5607s3.1871 0.7659 4.015 1.5607c0.4042 0.3881 0.6876 0.7762 0.8731 1.0728 0.14 0.2241 0.2278 0.4014 0.2736 0.5015Zm-7.9688 7.1393c0.8197 -0.1205 1.5818 0.4463 1.7022 1.2659 0.2025 1.3772 0.8118 2.9108 1.6425 4.1618 0.8617 1.2975 1.7836 2.0307 2.4703 2.2147 0.6867 0.184 1.8516 0.01 3.2466 -0.6829 1.3449 -0.668 2.6394 -1.6915 3.5034 -2.783 0.5142 -0.6496 1.4576 -0.7593 2.1072 -0.2451 0.6495 0.5142 0.7592 1.4576 0.2451 2.1071 -1.1643 1.4708 -2.8196 2.7627 -4.5212 3.6079 -1.6513 0.8202 -3.6295 1.3569 -5.3576 0.8938 -1.7281 -0.463 -3.1729 -1.9169 -4.1929 -3.4529 -1.0511 -1.5827 -1.8387 -3.5292 -2.1115 -5.3851 -0.1204 -0.8196 0.4463 -1.5817 1.2659 -1.7022Z" clip-rule="evenodd" stroke-width="1"></path></g></svg>
          <strong></strong> <span id="genres">Noma’lum</span>
        </p>
      </div>
      <div class="wrapper">
        <div class="qisqacha">
          <p><strong>Qisqacha:</strong> ${overview}</p>
          <hr>
          <div id="extraInfo"></div>
        </div>

        <div class="reyting">
         <span><div class="reyyy"> <h3> Reyting:</h3>
          <p> <strong class='rat'>${rating}</strong></p>
          <p class='ovoz'><strong>Ovozlar:</strong> ${votes}</p></div>
          <div class="user-rating">
            <h4>Reytingingizni qo'shing:</h4>
            <select id="userRatingSelect" onchange="saveUserRating(${item.id})">
              <option value="0">Tanlang</option>
              ${[...Array(10).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join('')}
            </select>
            <p id="userRatingDisplay">Reytingingiz: <br><strong id="userRatingValue">Noma'lum</strong></p>
          </div></span>
          <div class="buttons">
            <button class="watchlist" onclick="addToList('watchlist')"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>Watchlist</button>
            <button class="seen" onclick="addToList('seenList')"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 11L12 14L22 4M16 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 5.11984 21 6.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg> Ko‘rganman</button>
          </div>
        </div>
      </div>

      
     
  `;

  const ratElement = document.querySelector('.rat');
if (rating !== 'Noma’lum') {
  const numericRating = parseFloat(rating);
  if (numericRating >= 1 && numericRating <= 5.9) {
    ratElement.style.color = 'red';
  } else if (numericRating > 5.9 && numericRating <= 7.4) {
    ratElement.style.color = '#ffef00';
  } else if (numericRating > 7.4 && numericRating <= 8.4) {
    ratElement.style.color = '#21d375';
  } else if (numericRating > 8.4 && numericRating <= 10) {
    ratElement.style.color = '#66a6ff';
  }
}

  
  const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
  renderPagination(true, mediaType); 
  if (item.id) {
    fetch(`https://api.themoviedb.org/3/${mediaType}/${item.id}?api_key=${API_KEY}&append_to_response=credits`)
      .then(res => res.json())
      .then(details => {
        const genres = details.genres
          ? details.genres.slice(0, 3).map(genre => genre.name).join(', ')
          : 'Noma’lum';

        let director = 'Noma’lum';
        if (details.credits && details.credits.crew) {
          const directorData = details.credits.crew.find(person => person.job === 'Director');
          if (directorData) {
            director = directorData.name;
          }
        }

        let seasons = '';
        let episodes = '';
        if (mediaType === 'tv') {
          seasons = details.number_of_seasons || 'Noma’lum';
          episodes = details.number_of_episodes || 'Noma’lum';
        }

        const extraInfo = document.getElementById('extraInfo');
        if (extraInfo) {
          extraInfo.innerHTML = `
            <p><strong>Rejissyor:</strong> ${director}</p>
            ${mediaType === 'tv' ? `<p><strong>Fasllar:</strong> ${seasons}</p>` : ''}
            ${mediaType === 'tv' ? `<p><strong>Epizodlar:</strong> ${episodes}</p>` : ''}
          `;
        }

        const genresElement = document.getElementById('genres');
        if (genresElement) {
          genresElement.innerText = genres;
        }

        
        const castContainer = document.createElement('div');
        castContainer.id = 'cast';
        castContainer.innerHTML = `
          <h3>Aktyorlar tarkibi:</h3>
          <div class="cast-list"></div>
           <button class="goBack" onclick="goBack()"><svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>Orqaga</button>
    </div>
        `;
        document.querySelector('.details').appendChild(castContainer);

        const castList = details.credits.cast.slice(0, 9); 
        const castListContainer = castContainer.querySelector('.cast-list');
        castList.forEach(actor => {
          const actorElement = document.createElement('div');
          actorElement.className = 'actor';
          actorElement.innerHTML = `
            <img src="${actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : './images/default-avatar.png'}" alt="${actor.name}">
            <p>${actor.name}</p>
          `;
          castListContainer.appendChild(actorElement);
        });
      })
      .catch(err => {
        console.error('Maʼlumotlarni olishda xatolik:', err);
        const extraInfo = document.getElementById('extraInfo');
        if (extraInfo) {
          extraInfo.innerHTML = `<p>Ma'lumotlarni yuklashda xatolik yuz berdi.</p>`;
        }
      });
  } else {
    console.error('ID mavjud emas');
  }
}

function saveRating() {
  const rating = document.getElementById('ratingSelect').value;
  if (rating !== '0') {
    const savedRatings = JSON.parse(localStorage.getItem('ratings')) || {};
    savedRatings[currentItem.id] = rating;
    localStorage.setItem('ratings', JSON.stringify(savedRatings));
    alert('Rating saqlandi!');
  } else {
    alert('Iltimos, rating tanlang!');
  }
}


function getSavedRating(itemId) {
  const savedRatings = JSON.parse(localStorage.getItem('ratings')) || {};
  return savedRatings[itemId] || null; 
}


function addToList(listName) {
  if (!currentItem) return;

  let list = JSON.parse(localStorage.getItem(listName)) || [];

  if (list.find(i => i.id === currentItem.id)) {
    alert("Bu allaqachon qo‘shilgan!");
    return;
  }

  list.push(currentItem);
  localStorage.setItem(listName, JSON.stringify(list));
  alert("Muvaffaqiyatli qo‘shildi!");
}

function showSavedList(listName) {
  document.querySelector('.swiper').style.display = 'none';
  document.getElementById('genres-container').style.display = 'none';

  const content = document.getElementById('content');
  content.style.display = 'flex';

  const savedList = JSON.parse(localStorage.getItem(listName)) || [];
  showList(savedList, listName); 

  document.getElementById('pagination').innerHTML = ''; 
}

function removeFromList(listName, id) {
  let list = JSON.parse(localStorage.getItem(listName)) || [];
  list = list.filter(item => item.id !== id);
  localStorage.setItem(listName, JSON.stringify(list)); 

  if (listName === 'watchlist' || listName === 'seenList') {
    showSavedList(listName);
  }
}








function loadMovieDetails(id, type = 'movie') {
  const url = `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&append_to_response=credits`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      showDetails(data); 
    })
    .catch(err => {
      console.error('Maʼlumotlarni yuklashda xatolik:', err);
    });
}





function renderPagination(isDetailsPage = false, mediaType = null) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  if (!isDetailsPage) {
    const backButton = document.createElement('button');
    backButton.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 12H4M4 12L10 18M4 12L10 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    backButton.disabled = currentPage === 1;
    backButton.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        loadData();
      }
    };
    pagination.appendChild(backButton);

    const pageIndicator = document.createElement('span');
    pageIndicator.innerText = ` ${currentPage} / ${totalPages}`;
    pageIndicator.style.margin = '0 10px';
    pagination.appendChild(pageIndicator);

    const nextButton = document.createElement('button');
    nextButton.innerHTML = `
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    nextButton.disabled = currentPage === totalPages;
    nextButton.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        loadData();
      }
    };
    pagination.appendChild(nextButton);
  }
}

function searchAll() {
  clearTimeout(debounceTimeout); 

  debounceTimeout = setTimeout(() => {
    const query = document.getElementById('searchInput').value.trim();
    const content = document.getElementById('content');
    const genresContainer = document.getElementById('genres-container');

    if (query.length < 2) {
      content.style.display = 'none';
      genresContainer.style.display = 'block';
      return;
    }

    content.style.display = 'flex';
    genresContainer.style.display = 'none';

    
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=uz`;

    fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`API xatosi: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        showList(data.results); 
      })
      .catch(err => {
        console.error('Qidiruvda xatolik:', err);
        content.style.display = 'none';
        genresContainer.style.display = 'block';
      });
  }, 300);
}


document.addEventListener('DOMContentLoaded', () => {
  setCategory('movies'); 
  setupLoadMore(); 
});

document.addEventListener('DOMContentLoaded', () => {
const swiper = new Swiper('.swiper', {
  loop: true, 
  slidesPerView: 1, 
  spaceBetween: 20, 
  pagination: {
    el: '.swiper-pagination',
    clickable: true, 
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  autoplay: {
    delay: 10000,
    disableOnInteraction: false, 
  },
});
});



const hamMenu = document.querySelector('.ham-menu');
const offScreen = document.querySelector('.off-screen-menu');
const content = document.getElementById('content'); 

hamMenu.addEventListener('click', () => {
    hamMenu.classList.toggle('active');
    offScreen.classList.toggle('active');

  
    if (offScreen.classList.contains('active')) {
        content.style.zIndex = '-1'; 
        content.style.position = 'relative'; 
    } else {
        content.style.zIndex = '0'; 
        content.style.position = 'static';
    }
});

const genres = [
{ id: 28, name: 'Jangari' },
{ id: 35, name: 'Komediya' },
{ id: 18, name: 'Drama' },
{ id: 878, name: 'Ilmiy-Fantastik' },
{ id: 12, name: 'Sarguzasht' },
{ id: 27, name: 'Horror' },
{ id: 'top_rated', name: 'Yuqori Reytingli' },
].filter(genre => genre.name && genre.id); 

function loadMoviesByGenre(genreId, page = 1) {
  let url;

  if (currentCategory === 'movies') {
    url = genreId === 'top_rated'
      ? `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${page}`
      : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
  } else if (currentCategory === 'series') {
    url = genreId === 'top_rated'
      ? `https://api.themoviedb.org/3/tv/top_rated?api_key=${API_KEY}&page=${page}`
      : `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`;
  }

  return fetch(url)
    .then(res => {
      if (!res.ok) {
        throw new Error(`API xatosi: ${res.status}`);
      }
      return res.json();
    })
    .then(data => data.results)
    .catch(err => {
      console.error(`API chaqiruvda xatolik: ${err.message}`);
      return [];
    });
}

function renderGenreSection(genre) {
  const genresContainer = document.getElementById('genres-container');

  const section = document.createElement('div');
  section.className = 'genre-section';
  section.id = `genre-${genre.id}`;

  section.innerHTML = `
    <div class="genre-header">
      
      <h2 class="genre-title">${genre.name}</h2>
      <a class="load-more" data-genre-id="${genre.id}" data-page="1">Ko'proq <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg></a>
    </div>
      <div class="genre-grid" id="genre-grid-${genre.id}"></div>
    
  `;

  genresContainer.appendChild(section);

  loadMoviesByGenre(genre.id).then(items => {
    if (!items || items.length === 0) {
      section.style.display = 'none';
    } else {
      const grid = document.getElementById(`genre-grid-${genre.id}`);
      items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}" onclick='showDetails(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
          <h3>${item.title || item.name}</h3>
        `;
        grid.appendChild(card);
      });
    }
  }).catch(err => {
    console.error(`Janrni yuklashda xatolik: ${genre.name}`, err);
    section.style.display = 'none'; 
  });
}

function setupLoadMore() {
  document.addEventListener('click', event => {
    if (event.target.classList.contains('load-more')) {
      const button = event.target;
      const genreId = button.getAttribute('data-genre-id');
      let page = parseInt(button.getAttribute('data-page'), 10);

      page += 1;
      button.setAttribute('data-page', page);

      loadMoviesByGenre(genreId, page).then(items => {
        const grid = document.getElementById(`genre-grid-${genreId}`);
        items.forEach(item => {
          const card = document.createElement('div');
          card.className = 'card';
          card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}" onclick='showDetails(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
            <h3>${item.title || item.name}</h3>
          `;
          grid.appendChild(card);
        });
      });
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  genres.forEach(genre => renderGenreSection(genre));
  setupLoadMore();
});

document.addEventListener('DOMContentLoaded', () => {
  setCategory('movies');
});

function goBack() {
  const swiper = document.querySelector('.swiper');
  swiper.style.display = 'block';

  document.getElementById('genres-container').style.display = 'block';
  const content = document.getElementById('content');
  content.className = 'grid';
  content.innerHTML = '';
  content.style.display = 'none'; 

  if (window.matchMedia('(min-width: 768px)').matches) {
    const navTom = document.querySelector('.nav-tom');
    if (navTom) {
      navTom.style.display = 'flex'; 
    }
  }
}

document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function () {
    
    document.querySelectorAll('nav a').forEach(item => item.classList.remove('active'));
    this.classList.add('active');
  });
});

document.querySelector('.search-btn').addEventListener('click', event => {
  event.preventDefault();

  const navTom = document.querySelector('.nav-tom');
  const swiper = document.querySelector('.swiper');
  const genresContainer = document.getElementById('genres-container');
  const content = document.getElementById('content');
  const search = document.querySelector('.search');

 
  navTom.style.display = 'none';
  swiper.style.display = 'none';
  genresContainer.style.display = 'none';
  content.style.display = 'none';

  
  search.style.display = 'flex';
});


document.addEventListener('click', event => {
  const search = document.querySelector('.search');
  const navTom = document.querySelector('.nav-tom');
  const swiper = document.querySelector('.swiper');
  const genresContainer = document.getElementById('genres-container');
  const content = document.getElementById('content');
  const button = document.querySelector('.svg1');

  button.style.color = '#141414' 
  

  
  if (!event.target.closest('.search') && !event.target.closest('.search-btn')) {
    search.style.display = 'none';
    //navTom.style.display = 'flex'; 
    button.style.color = 'white'
    // swiper.style.display = 'block'; 
   // genresContainer.style.display = 'block'; 
    //content.style.display = 'grid';
  }
});


window.addEventListener('load', () => {
  const search = document.querySelector('.search');
  search.style.display = 'none';
});

document.querySelector('.hamburger').addEventListener('click', event => {
  const navTom = document.querySelector('.nav-tom');
  navTom.style.display = 'none';
  
});

function saveUserRating(itemId) {
  const userRatingSelect = document.getElementById('userRatingSelect');
  const userRating = userRatingSelect.value;

  if (userRating === '0') {
    alert('Iltimos, reyting tanlang!');
    return;
  }

  
  const userRatings = JSON.parse(localStorage.getItem('userRatings')) || {};
  userRatings[itemId] = userRating;
  localStorage.setItem('userRatings', JSON.stringify(userRatings));

  
  const userRatingValue = document.getElementById('userRatingValue');
  userRatingValue.innerText = userRating;

  alert('Reytingingiz saqlandi!');
}

function getUserRating(itemId) {
  const userRatings = JSON.parse(localStorage.getItem('userRatings')) || {};
  return userRatings[itemId] || 'Noma\'lum';
}


document.addEventListener('DOMContentLoaded', () => {
  const userRatingValue = document.getElementById('userRatingValue');
  const userRating = getUserRating(currentItem.id);
  userRatingValue.innerText = userRating;
});

