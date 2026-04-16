//mobile DOM
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
const mobileInput = document.getElementById("mobileQuery");
const mobileDropdown = document.getElementById("mobileDropdown");
const navSearchBtn = document.getElementById("navSearchBtn");
const searchBox = document.querySelector(".nav-search");
const contactForm = document.getElementById("contactForm");
// ------------- MOBILE ------------- 
let timeout;
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

//when you click back into input space
mobileInput.addEventListener("click", function() {
    let query = mobileInput.value.trim();

    if(query.length >= 2) {
        getMobileAnime(query);
    }
})

//when you click off of search container, dropdown clears
document.addEventListener("click", function (event) {

    if(!searchBox.contains(event.target)) {
        mobileDropdown.innerHTML = "";
        mobileDropdown.classList.add("hidden");
    }
});
// ------------- END MOBILE ------------- 

let PUBLIC_KEY = "AeSACyZOet741182J";
let TEMPLATE_ID = "template_rg205ds";
let SERVICE_ID = "service_4yxov7w";


emailjs.init(PUBLIC_KEY);

contactForm.addEventListener("submit", function(e) {
    e.preventDefault();

    emailjs.sendForm(
        SERVICE_ID,
        TEMPLATE_ID,
        this
    ).then(() => {
        alert("Message sent successfully!");
        this.reset();
    }, (error) => {
        console.log("FAILED...", error);
        alert("Failed to send message.");
    });
});


