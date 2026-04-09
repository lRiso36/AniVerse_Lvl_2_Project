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