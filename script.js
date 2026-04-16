//grab necessary DOM elements
const searchForm = document.getElementById("searchForm");
const results = document.getElementById("results");
const input = document.getElementById("query");
const dropdown = document.getElementById("dropdown");
const searchContainer = document.getElementById("searchContainer");

//mobile DOM
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const mobileInput = document.getElementById("mobileQuery");
const mobileDropdown = document.getElementById("mobileDropdown");
const navSearchBtn = document.getElementById("navSearchBtn");
const searchBox = document.querySelector(".nav-search");


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

// ------------- END MOBILE ------------- 


//set timeout
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
        if(query.length < 2) {
            dropdown.innerHTML = "";
            return;
        }

        getAnime(query)
    }, 300) //300ms delay
    
});

//when you click back into input space
input.addEventListener("click", function() {
    let query = input.value.trim();

    if(query.length >= 2) {
        getAnime(query);
    }
})

//when you click off of search container, dropdown clears
document.addEventListener("click", function (event) {

    if(!searchContainer.contains(event.target)) {
        dropdown.innerHTML = "";
        dropdown.classList.add("hidden");
    }
});

// get all anime for dropdown
async function getAnime(aQuery) {
    try{
        dropdown.classList.remove("hidden");
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


// ------------- UNFINISHED ------------- 


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

