const container = document.getElementById("watchlistContainer");
const addBtn = document.getElementById("addBtn");
const searchBar = document.getElementById("bigSearchBar");
const closeBtn = document.getElementById("closeBtn");
const searchInput = document.getElementById("searchInput");
const dropdown = document.getElementById("dropdown");
const deleteBtn = document.getElementById("deleteBtn");
const searchContainer = document.getElementById("searchContainer");

//Mobile DOM
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const mobileInput = document.getElementById("mobileQuery");
const mobileDropdown = document.getElementById("mobileDropdown");
const navSearchBtn = document.getElementById("navSearchBtn");
const searchBox = document.querySelector(".nav-search");


//render list on pade load
renderWatchlist();

//get watchlist function
function getWatchlist() {
    return JSON.parse(localStorage.getItem("watchlist")) || [];
}

//render watchlist function
function renderWatchlist() {
    let watchlist = getWatchlist() || [];
    watchlist = watchlist.filter(item => item && item.id);

    let html = "";

    if (watchlist.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                <h3>Your watchlist is empty :(</h3>
                <p>Click <span>+ add </span> to add animes, or <span> Animes </span>to browse </p>
            </div>    
        `;
        return;
    }

    watchlist.forEach(anime => {
        if(!anime || !anime.id) return;
        html += `
            <div class="anime-card" data-id="${anime.id}">
                <img src="${anime.image}" alt="${anime.title}">
                <h3>${anime.title}</h3>
                <p>${anime.year}</p>
                <button class="delete-btn hiddenBtn" data-id="${anime.id}">✕</button>
            </div>`;
        });

        container.innerHTML = html;
}

//be able to click on anime and go to anime page

// ----------------------------------------------

function reroute() {
  const id = this.dataset.id;
  window.location.href = `anime.html?id=${id}`;
}

addBtn.addEventListener("click", () => {
  searchBar.classList.remove("hidden");
})

// ----------------------------------------------

// code surrounding search
// ----------------------------------------------
closeBtn.addEventListener("click", () => {
  searchBar.classList.add("hidden");
})

let timeout;

//add event listener for input everytime typing
searchInput.addEventListener("input", function () {
    //runs everytime input changes
    //get input without extra spaces
    let query = searchInput.value.trim();

    //clear previous timeouts
    clearTimeout(timeout);

    //setTimeout and run search after 300ms of typing being done
    timeout = setTimeout(()=> {
        if(query.length <= 2) {
            dropdown.innerHTML = "";
            return;
        }
        getAnime(query)
    }, 300) //300ms delay
    
});

searchInput.addEventListener("click", function() {
    let query = searchInput.value.trim();

    if(query.length > 2) {
        getAnime(query);
    }
})

document.addEventListener("click", function (event) {

    if(!searchContainer.contains(event.target)) {
        dropdown.innerHTML = "";
    }
});

async function getAnime(aQuery){
    try{
    const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${aQuery}`);
    dropdown.innerHTML = "";

    if(response.data.data.length === 0) {
            dropdown.innerHTML = `<div class='dropdown-item'>No results found</div>`;
            return;
        }
    
    response.data.data.slice(0,15).forEach(anime => {
        let newAnime = document.createElement("div");
        newAnime.classList.add("dropdown-item");

        const year = anime.aired?.from?.slice(0,4) || "N/A";
        const animeTitle = anime.title_english || anime.title;
        newAnime.textContent = `${animeTitle} (${year})`;

        newAnime.addEventListener("click", function() {

            let animeObject = {
                id: anime.mal_id,
                title: animeTitle,
                image: anime.images.jpg.large_image_url,
                year: year,
                episodes: anime.episodes || "?",
                score: anime.score
            }

            let watchlist = getWatchlist() || [];

            const exists = watchlist.some(item => item.id === animeObject.id);
    
            if(!exists) {
                watchlist.push(animeObject);
            }

            localStorage.setItem("watchlist", JSON.stringify(watchlist));
            renderWatchlist();

            searchInput.value = ""; 
            dropdown.innerHTML = "";
                
        });

        dropdown.appendChild(newAnime);

    })
    } catch (error){
        console.log(error);
        dropdown.innerHTML = `<div class='dropdown-item'>Error fetching animes. Try again</div>`;
    }
}

// ----------------------------------------------

//CLICK DROPDOWN ADD ANIME CODE
// ----------------------------------------------

// function addAnime(){
//     let watchlist = getWatchlist();
    
// }

// ----------------------------------------------


document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-btn")) {
        e.stopPropagation();

        const id = Number(e.target.dataset.id);

        let watchlist = getWatchlist() || [];

        watchlist = watchlist.filter(item => item && item.id != id);

        localStorage.setItem("watchlist", JSON.stringify(watchlist));

        // e.target.closest(".anime-card").remove();
        renderWatchlist();

        return;
    }

    const card = e.target.closest(".anime-card");
    if (card){
        const id = card.dataset.id;
        window.location.href = `anime.html?id=${id}`;
    }
});


function saveWatchlist(watchlist) {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
}

//MOBILE ____________________________
menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    searchBox.classList.remove("active");
});
// const topAnimesContainer = document.querySelector(".top-animes-container");
// // getTopAnimes();

// click search
navSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    nav.classList.remove("active");       // hide links
    searchBox.classList.toggle("active"); // show search
});


mobileInput.addEventListener("input", function() {
    
    let query = mobileInput.value.trim();
    console.log(query);

    clearTimeout(timeout);

    timeout = setTimeout(()=> {
        if(query.length <= 2) {
            mobileDropdown.innerHTML = "";
            return;
        }

        // getAnime(query);
        getAnimeMobile(query);

    }, 300) //300ms delay
})

mobileInput.addEventListener("click", function() {
    let query = mobileInput.value.trim();

    if(query.length > 2) {
        // getAnime(query);
        getAnimeMobile(query);
    }
})

// document.addEventListener("click", function (event) {

//     if(!searchContainer.contains(event.target)) {
//         dropdown.innerHTML = "";
//     }
// });

//END MOBILE _________________________

async function getAnimeMobile(aQuery) {
    try{
        const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${aQuery}`);
        mobileDropdown.innerHTML = "";

        if(response.data.data.length === 0) {
            mobileDropdown.innerHTML = `<div class='dropdown-item'>No results found</div>`;
            return;
        }

        response.data.data.slice(0, 15).forEach(anime => {

            let newAnime = document.createElement("div");
            newAnime.classList.add("dropdown-item");

            const year = anime.aired?.from?.slice(0,4) || "N/A";
            const animeTitle = anime.title_english || anime.title;
            newAnime.textContent = `${animeTitle} (${year})`;

            //click handler? anime.mal_id
            newAnime.addEventListener("click", function() {
                window.location.href = `anime.html?id=${anime.mal_id}`;
            });

            mobileDropdown.appendChild(newAnime);
        });

    } catch (error){
        console.log(error);
        mobileDropdown.innerHTML = `<div class='dropdown-item'>Error fetching animes. Try again</div>`;
    }
}