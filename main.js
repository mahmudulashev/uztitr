
    const API_KEY = 'c31fbe3cd0f434bf9aa13ca577150f7d'; 
    let currentCategory = 'movies';
    let currentPage = 1;
    let totalPages = 1;

    function setCategory(category) {
      currentCategory = category;
      currentPage = 1;
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
        });
    }

    function showList(items, fromList = null) {
      const content = document.getElementById('content');
      content.className = 'grid';
      content.innerHTML = '';

      items.forEach(item => {
        const title = item.title || item.name;
        const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '';
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
          <img src="${poster}" alt="Poster">
          <h4>${title}</h4>
          ${fromList ? `<button onclick="removeFromList('${fromList}', ${item.id})">❌ O‘chirish</button>` : ''} 
        `;
        card.onclick = () => showDetails(item);  
        content.appendChild(card);
      });
    }

    let currentItem = null;

    function showDetails(item) {
      currentItem = item;
      const title = item.title || item.name;
      const poster = item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '';
      const overview = item.overview || 'Hech qanday ma’lumot yo‘q';
      const year = item.release_date || item.first_air_date || 'Noma’lum';
      const rating = item.vote_average || 'Noma’lum';
      const votes = item.vote_count || '0';

      const savedRating = getSavedRating(item.id);
    
      const content = document.getElementById('content');
      content.className = '';
      content.innerHTML = `
        <div class="details" id="details">
          <img src="${poster}" alt="Poster">
          <h2>${title}</h2>
          <p><strong>Yili:</strong> ${year}</p>
          <p><strong>Reyting:</strong> ${rating}</p>
          <p><strong>Ovozlar:</strong> ${votes}</p>
          <p><strong>Qisqacha:</strong> ${overview}</p>
          <div id="extraInfo"></div>
          <div class="buttons">
            <button onclick="addToList('watchlist')">⭐ Watchlist</button>
            <button onclick="addToList('seenList')">✅ Ko‘rganman</button>
          </div>
        </div>

            <div>
          <h4>Filmingizni baholash (1-10):</h4>
          <select id="ratingSelect">
            <option value="0">Tanlang...</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
          <button onclick="saveRating()">Baholash</button>
        </div>
      </div>
      `;

    if (savedRating !== null) {
      document.getElementById('ratingSelect').value = savedRating;
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
    

      if (item.media_type === 'tv' || item.first_air_date) {
        fetch(`https://api.themoviedb.org/3/tv/${item.id}?api_key=${API_KEY}`)
          .then(res => res.json())
          .then(tvDetails => {
            const seasons = tvDetails.number_of_seasons || 'Noma’lum';
            const episodes = tvDetails.number_of_episodes || 'Noma’lum';
            const extraInfo = document.getElementById('extraInfo');
            extraInfo.innerHTML = `
              <p><strong>Fasllar:</strong> ${seasons}</p>
              <p><strong>Epizodlar:</strong> ${episodes}</p>
            `;
          });
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
      const savedList = JSON.parse(localStorage.getItem(listName)) || [];
      showList(savedList, listName);
      document.getElementById('pagination').innerHTML = '';
    }

    function removeFromList(listName, id) {
      let list = JSON.parse(localStorage.getItem(listName)) || [];
      list = list.filter(item => item.id !== id);
      localStorage.setItem(listName, JSON.stringify(list));
      showSavedList(listName);
    }

    function renderPagination() {
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '';

      const backButton = document.createElement('button');
      backButton.innerText = '⬅️ Back';
      backButton.disabled = currentPage === 1;
      backButton.onclick = () => {
        if (currentPage > 1) {
          currentPage--;
          loadData();
        }
      };
      pagination.appendChild(backButton);

      const pageIndicator = document.createElement('span');
      pageIndicator.innerText = `Sahifa ${currentPage} / ${totalPages}`;
      pageIndicator.style.margin = '0 10px';
      pagination.appendChild(pageIndicator);

      const nextButton = document.createElement('button');
      nextButton.innerText = 'Next ➡️';
      nextButton.disabled = currentPage === totalPages;
      nextButton.onclick = () => {
        if (currentPage < totalPages) {
          currentPage++;
          loadData();
        }
      };
      pagination.appendChild(nextButton);
    }

    function searchAll() {
      const query = document.getElementById('searchInput').value.trim();
      if (query.length < 2) return;

      const url = currentCategory === 'movies'
        ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
        : `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}`;

      fetch(url)
        .then(res => res.json())
        .then(data => {
          totalPages = 1;
          showList(data.results);
          document.getElementById('pagination').innerHTML = '';
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
      loadData();
    });

    setCategory('movies');
