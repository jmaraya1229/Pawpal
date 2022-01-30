var globalPets = [];
let resultscontainer = document.getElementById("populate-search-results");
let geoAPIKey = "adbcd1fea76a22fc844c199455b4e260";
let results = {};
let filteredResults = [];
let searchform = document.getElementById("searchform");
searchform.addEventListener("submit", search);

const client = new petfinder.Client({
  apiKey: "mFaTDg20CUKN5hJQNpl8OQ2SC6ClhkYHOKyfs7jrRkL6plQkqY",
  secret: "9AyO9i6tDmZox227F5yn7ePOnkRvq67geVbb7fnA",
});

// will's petfinder creds:
// apiKey: "du5LZGcyZhM51weBA55R5wexC39ZP2goVW2i7TAcayFnkDUtX4",
// secret: "AStWV6OJyCylpnWHlOZh4HfR3w2zTiLWoCya9HAD",

// trent's petfinder creds:
// apiKey: "c4Kr5BRTXhQEhXoQweeNHLhO43gdfD4sCbYy6vD9s93RuRluyB",
// secret: "LpRMDqN9WakbzJjstuJ4TxzvQDg6Qk9o9I60R1na",

// jesse's petfinder creds:
// apiKey: "mFaTDg20CUKN5hJQNpl8OQ2SC6ClhkYHOKyfs7jrRkL6plQkqY",
// secret: "9AyO9i6tDmZox227F5yn7ePOnkRvq67geVbb7fnA",

getpics();

if (localStorage.getItem("favorites") !== null) {
  globalPets = JSON.parse(localStorage.getItem("favorites"));
  renderFav();
  console.log(globalPets);
}

//pulls 3 newest pets added to petfinder on pageload
async function getpics() {
  results = await client.animal.search({
    photos: true,
    status: "adoptable",
    limit: 3,
  });
  let i = 1;
  console.log(results.data);

  results.data.animals.forEach(function (animal) {
    // console.log(` -- ${++animalID}: ${animal.name} id: ${animal.id} url: ${animal.url}`);

    // handle missing photo
    if (animal.photos[0] == undefined) {
      animal.photos = [{ medium: "" }];
      animal.photos[0].medium = "./Assets/IMAGES/pet-filler-img.jpg";
    }
    // handle missing desc
    if (animal.description === null) {
      animal.description = "Adopt Me!";
    }
    // append cards for results
    document.getElementById("pageName").innerHTML = "Newest Pets!";

    resultscontainer.innerHTML =
      resultscontainer.innerHTML +
      `
      <div id="${animal.id}" class="column box pet-card has-text-centered is-justify-content-center is-one-quarter">
      <div class="title has-text-centered is-size-2">${animal.name}</div>
      <div class="pet-pic">
      <a href="${animal.url}" target="_blank"><img class="" src="${animal.photos[0].medium}"></a>
      <img class="fav-btn md hydrated is-link is-pulled-right" data-target="favorite-page" name="add-fav" src="./Assets/IMAGES/md-paw.svg">
      </div>
      <p>${animal.description}</p>
      </div>
      `;

    i++;
  });
  buildFavBtns();
}
//adds event listeners to favorite buttons
function buildFavBtns() {
  var favBtns = Array.from(document.getElementsByClassName("fav-btn"));
  favBtns.forEach(function (favBtn) {
    favBtn.addEventListener("click", function (event) {
      event.preventDefault();
      storePets(event);
    });
  });
}
// stores favs locally
function storePets(event) {
  // console.log(event.target);
  let eventParent = event.target.parentElement;
  // console.log(eventParent);
  let petID = eventParent.parentElement.id;
  console.log(petID);
  // console.log(results);
  let animals = results.data.animals;
  let fav = animals.find(function (animal) {
    return animal.id === parseInt(petID);
  });
  console.log(fav);
  globalPets.push(fav);
  localStorage.setItem("favorites", JSON.stringify(globalPets));
}
//populates favorites modal

function renderFav() {
  let favContent = document.getElementById("fav-petcards");
  favContent.innerHTML = "";
  globalPets.forEach(function (pet) {
    favContent.innerHTML = favContent.innerHTML =
      favContent.innerHTML +
      `
 <div class="tile is-parent">
   <div class="tile is-child box">
     <p id="${pet.id}" class="title has-text-centered">
     ${pet.name}
       <button class="button is-link is-pulled-right" data-target="favorite-page">
         <ion-icon name="paw-outline"></ion-icon> 
       </button>
     </p>
     <div class="columns is-flex is-centered">
       <figure>
           <a href="${pet.URL} target="_blank"><img id="" src="${pet.photos[0].medium}"></a>
       </figure>
       <p>${pet.description}</p>
     </div>
   </div>
 </div>
 `;
  });
}

//handles search form
async function search(event) {
  event.preventDefault();
  let searchstring = document.getElementById("searchstring").value;
  let distance = document.getElementById("distance").value;
  let locationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchstring}&limit=5&appid=${geoAPIKey}`;
  let location = await (await fetch(locationURL)).json();
  if (location[0] === undefined) {
    document.getElementById("searchstring").value = "";
    document.getElementById("searchstring").placeholder = "Invalid Entry";
    return;
  }
  let lat = location[0].lat;
  let lon = location[0].lon;

  let latlon = lat + ", " + lon;
  let page = 1;
  do {
    results = await client.animal.search({
      location: latlon,
      distance: distance,
      status: "adoptable",
      page,
      limit: 100,
    });

    resultscontainer.innerHTML = "";
    // let animalID = (page - 1) * 100;
    // console.log(animals)
    results.data.animals.forEach(function (animal) {
      // console.log(` -- ${++animalID}: ${animal.name} id: ${animal.id} url: ${animal.url}`);

      // handle missing photo
      if (animal.photos[0] == undefined) {
        animal.photos = [{ medium: "" }];
        animal.photos[0].medium = "./Assets/IMAGES/pet-filler-img.jpg";
      }
      // handle missing desc
      if (animal.description === null) {
        animal.description = "Adopt Me!";
      }
      // append cards for results
      document.getElementById("pageName").innerHTML = "Search Results:";
      $("#randomCard1").hide();
      $("#randomCard2").hide();
      $("#randomCard3").hide();
      resultscontainer.innerHTML =
        resultscontainer.innerHTML +
        `
        <div id="${animal.id}" class="column box pet-card has-text-centered is-justify-content-center is-one-quarter">
        <div class="title has-text-centered is-size-2">${animal.name}</div>
        <div class="pet-pic">
        <a href="${animal.url}" target="_blank"><img class="" src="${animal.photos[0].medium}"></a>
        <img class="fav-btn md hydrated" src="./Assets/IMAGES/md-paw.svg">
        </div>
        <p>${animal.description}</p>
        </div>
        `;
    });
    page++;
  } while (results.pagination && results.pagination.total_pages >= page);
  buildFavBtns();
}

//logs 'hello'
function test() {
  console.log("hello");
}

// trent's code
document.addEventListener("DOMContentLoaded", () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add("is-active");
  }

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    // console.log($target);

    $trigger.addEventListener("click", () => {
      openModal($target);
      renderFav();
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) {
      // Escape key
      closeAllModals();
    }
  });
});

console.log(document.getElementById("search-filters"));

let filterSubmission = document.getElementById("search-filters");
filterSubmission.addEventListener("submit", filterResults);

function filterResults() {
  event.preventDefault;
  let filters = {
    type: filterSubmission.species.value,
    breeds: {
      primary: filterSubmission.breed.value,
    },
    colors: {
      primary: filterSubmission.color.value,
    },
    age: filterSubmission.age.value,
    gender: filterSubmission.gender.value,
    size: filterSubmission.size.value,
    coat: filterSubmission.coat.value,
    attributes: {
      spayed_neutered: filterSubmission.spay - neuter.value,
      house_trained: filterSubmission.house - trained.value,
      declawed: filterSubmission.declawed.value,
      special_needs: filterSubmission.special - needs.value,
      shots_current: filterSubmission.shots.value,
    },
    environment: {
      children: filterSubmission.goodkids.value,
      dogs: filterSubmission.gooddogs.value,
      cats: filterSubmission.goodcats.value,
    },
  };
  console.log(filters);
}
