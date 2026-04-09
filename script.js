//grab necessary DOM elements
const searchForm = document.getElementById("searchForm");
const results = document.getElementById("results");
const input = document.getElementById("query");
const dropdown = document.getElementById("dropdown");
const searchContainer = document.getElementById("searchContainer");
// const topAnimesContainer = document.querySelector(".top-animes-container");
// // getTopAnimes();

let timeout;
//add event listener for input everytime typing
input.addEventListener("input", function () {
    //runs everytime input changes
    //get input without extra spaces
    let query = input.value.trim();

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

input.addEventListener("click", function() {
    let query = input.value.trim();

    if(query.length > 2) {
        getAnime(query);
    }
})

document.addEventListener("click", function (event) {

    if(!searchContainer.contains(event.target)) {
        dropdown.innerHTML = "";
    }
});

async function getAnime(aQuery) {
    try{
        const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${aQuery}`);
        dropdown.innerHTML = "";

        if(response.data.data.length === 0) {
            dropdown.innerHTML = `<div class='dropdown-item'>No results found</div>`;
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

            dropdown.appendChild(newAnime);
        });

    } catch (error){
        console.log(error);
        dropdown.innerHTML = `<div class='dropdown-item'>Error fetching animes. Try again</div>`;
    }
}


// async function getTopAnimes() {
//     const results = await fetch("https://api.jikan.moe/v4/top/anime");
//     const theData = await results.json();
//     console.log(theData.data);

//     const topAnimes = theData.data.map(anime => ({
//         id: animes.mal_id,
//         title: anime.title_english || anime.title,
//         image: anime.images.jpg.large_image_url,
//         score: anime.score,
//         rank: anime.rank,
//         year: anime.aired?.from?.slice(0, 4) || "N/A"
//     }));

//     // topAnimes.forEach{
//     //     const newCard = document.createElement("div");

//     // }
// }