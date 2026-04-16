const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
const title = document.getElementById("animeTitle");
const extras = document.getElementById("animeExtras");
const description = document.getElementById("description");
const leftSide = document.getElementById("leftSide");
const topImage = document.querySelector(".top-image");
const streaming = document.getElementById("streaming");
const scoreEl = document.getElementById("score");
const imageContainer = document.getElementById("imageContainer");
const watchlistBtn = document.getElementById("watchlistBtn");

//mobile DOM
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const mobileInput = document.getElementById("mobileQuery");
const mobileDropdown = document.getElementById("mobileDropdown");
const navSearchBtn = document.getElementById("navSearchBtn");
const searchBox = document.querySelector(".nav-search");
const mobileScore = document.getElementById("mobileScore");

let currentAnime = null;
console.log(id);

getAnimeInfo();

async function getAnimeInfo() {

    try{
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}`);
        const anime = response.data.data;

        //get images
        const bigImage = 
            anime.trailer?.image?.maximum_image_url ||
            anime.images?.jpg?.large_image_url;

        const regularImage = anime.images.jpg.large_image_url;

        //add images
        topImage.style.backgroundImage = `url("${bigImage}")`;

        imageContainer.innerHTML = `
        <img src="${regularImage}" alt="${anime.title}">`;
    
        //title
        title.textContent = anime.title_english || anime.title;

        //set description and score
        description.textContent = anime.synopsis || "No description";
        scoreEl.textContent = `⭐ ${anime.score || "N/A"}`;
        mobileScore.textContent = scoreEl.textContent;
        //get 
        const year = anime.aired?.from?.slice(0,4) || "N/A";
        const studio = anime.studios?.[0]?.name || "Unknown";
        const episodeNum = anime.episodes || "?"

        extras.innerHTML = `
            <span>${year}</span> • 
            <span>${episodeNum} episodes</span> • 
            <span>[Directed by ${studio}]</span>
            `;

        currentAnime = {
            id: id,
            title: anime.title_english || anime.title,
            image: regularImage,
            year: year,
            episodes: episodeNum,
            score: anime.score
        }

        console.log(currentAnime);
        } catch (error) {
            console.log(error);
            title.textContent = "Error loading anime";
        }

}


//update watch list button on page load
updateWatchlistButton();

watchlistBtn.addEventListener("click", () => {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

    const exists = watchlist.some(item => item.id === id);
    
    if(exists) {
        watchlist = watchlist.filter(item => item.id !== id);
    } else {
        watchlist.push(currentAnime);
    }

    localStorage.setItem("watchlist", JSON.stringify(watchlist));

    updateWatchlistButton();
});


function updateWatchlistButton() {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    const hasId = watchlist.some(item => item.id === id);

    if(hasId) {
        watchlistBtn.textContent = "✔ In Watchlist";
    } else {
         watchlistBtn.textContent = "➕ Add to Watchlist";
    }
}

let timeout;
// ------------- MOBILE ------------- 

//when you click three line button on navbar,
//nav links show and search box on navbar goes away
menuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    searchBox.classList.remove("active");
});

// click "search" in navbar
//get rid of navbar links, show search input form in navbar
navSearchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    nav.classList.remove("active");       // hide links
    searchBox.classList.toggle("active"); // show search
});


// same function as computer, but different variables
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

// same get anime for dropdown, but for mobile, so different variables
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
// ------------- END MOBILE ------------- 



















// function getAniListIdFromMalId(malId) {
//     var query = `
//         query ($idMal: Int) {
//         Media (idMal: $idMal, type: ANIME) {
//             id
//             idMal
//             externalLinks {
//                 site
//                 url
//                 }
//             }
//         }
//     `;

//     var variables = {
//         idMal: malId
//     };

//     var url = `https://proxy.cors.sh/https://graphql.anilist.co`,
//     options = {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             "x-cors-api-key": "temp_key",
//             'Accept': 'application/json',
//         },
//         body: JSON.stringify({
//             query: query,
//             variables: variables
//         })
//     };

//     fetch(url, options)
//         .then(response => response.json())
//         .then(theData => {
//             const media = theData.data.Media;

//             console.log(media.externalLinks);
//             if(!media || !media.externalLinks || media.externalLinks.length === 0){
//                 streaming.textContent = "No streaming platforms found."
//                 return;
//             }

//             const streamingSites = ["Crunchyroll", "Netflix", "Hulu"];

//             streaming.innerHTML = "";

//             const filtered = media.externalLinks.filter(link =>
//                 streamingSites.includes(link.site)
//             )

//             if (filtered.length === 0) {
//                 streaming.textContent = "Not available on major platforms.";
//                 return;
//                 }

//             filtered.forEach(link => {
//                 const p = document.createElement("p");
//                 p.textContent = link.site;

//                 streaming.appendChild(p);
//             })
//         }) .catch(error => {
//             console.error("AniList error: ", error);
//             streaming.textContent = "Could not load streaming info";
//         });
// }