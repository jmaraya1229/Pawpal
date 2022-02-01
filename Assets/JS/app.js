var globalPets = [];

let resultscontainer = document.getElementById("populate-search-results");
let geoAPIKey = "adbcd1fea76a22fc844c199455b4e260";
let results = {};
let filteredResults = [];
$('#filterButton').hide();

let searchform = document.getElementById("searchform");
searchform.addEventListener("submit", search);

let filterSubmission = document.getElementById("search-filters");
filterSubmission.addEventListener("submit", filterResults);

const client = new petfinder.Client({
  apiKey: "du5LZGcyZhM51weBA55R5wexC39ZP2goVW2i7TAcayFnkDUtX4",
  secret: "AStWV6OJyCylpnWHlOZh4HfR3w2zTiLWoCya9HAD",
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
}

//pulls 3 newest pets added to petfinder on pageload
async function getpics() {
  results = await client.animal.search({
    photos: true,
    status: "adoptable",
    limit: 3,
  });
  let animals = results.data.animals;
  document.getElementById("pageName").innerHTML = "Newest Pets:";
  renderCards(animals);
  buildFavBtns();
}

function renderCards(animals) {
  resultscontainer.innerHTML = "";
  animals.forEach(function (animal) {
    if (animal.photos[0] == undefined) {
      animal.photos = [{ medium: "" }];
      animal.photos[0].medium = "./Assets/IMAGES/pet-filler-img.jpg";
    }

    if (animal.description === null) {
      animal.description = "Adopt Me!";
    }

    // append cards for results
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
  });
}

//adds event listeners to favorite buttons
function buildFavBtns() {
  var favBtns = Array.from(document.getElementsByClassName("fav-btn"));
  favBtns.forEach(function (favBtn) {
    favBtn.addEventListener("click", function (event) {
      event.preventDefault();
      
  if ($(this).attr('src') == './Assets/IMAGES/md-paw.svg') {
        $(this).attr("src", "./Assets/IMAGES/favoritedImg.png");
} 
else {
        $(this).attr("src", "./Assets/IMAGES/md-paw.svg");
}
      storePets(event);
    });
  });
}
// stores favs locally
function storePets(event) {
  let eventParent = event.target.parentElement;

  let petID = eventParent.parentElement.id;

  let animals = results.data.animals;
  let fav = animals.find(function (animal) {
    return animal.id === parseInt(petID);
  });

  globalPets.push(fav);
  localStorage.setItem("favorites", JSON.stringify(globalPets));
}
//populates favorites modal

function renderFav() {
  let favContent = document.getElementById("fav-petcards");
  if(globalPets.length === 0){
    $('#favorites').text("No Favorites Selected")
    $('#clearAll').hide()
  }
  else {
    $('#favorites').empty();
    $('.favDiv').remove();
    $('#clearAll').show();
  globalPets.forEach(function (pet) {
    favContent.innerHTML = favContent.innerHTML =
      favContent.innerHTML +
      `
      <div class="favDiv">
      <div id="${pet.id}" class="box pet-card has-text-centered is-justify-content-center is-one-quarter">
      <div class="title has-text-centered is-size-2">${pet.name}</div>
      <div class="pet-pic">
      <a href="${pet.url}" target="_blank"><img class="" src="${pet.photos[0].medium}"></a>
      <img class="fav-btn md hydrated is-link is-pulled-right" data-target="favorite-page" name="add-fav" src="./Assets/IMAGES/md-paw.svg">
      </div>
      <p>${pet.description}</p>
      </div>
      </div>
      `;
  });
  }
}

//handles search form
async function search(event) {
  event.preventDefault();
  let searchstring = document.getElementById("searchstring").value;
  let distance = document.getElementById("distance").value;
  let locationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchstring}&limit=5&appid=${geoAPIKey}`;
  let location = await (await fetch(locationURL)).json();
  $('#filterButton').show();
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
    animals = results.data.animals;
    resultscontainer.innerHTML = "";
    document.getElementById("pageName").innerHTML = "Search Results:";
    renderCards(animals);
    page++;
  } while (results.pagination && results.pagination.total_pages >= page);
  buildFavBtns();
}

function filterResults() {
  event.preventDefault();
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
      spayed_neutered: filterSubmission.spayneuter.checked,
      house_trained: filterSubmission.housetrained.checked,
      declawed: filterSubmission.declawed.checked,
      special_needs: filterSubmission.specialneeds.checked,
      shots_current: filterSubmission.shots.checked,
    },
    environment: {
      children: filterSubmission.goodkids.checked,
      dogs: filterSubmission.gooddogs.checked,
      cats: filterSubmission.goodcats.checked,
    },
  };
  let animals = results.data.animals;
  filteredResults = animals.filter(function (item) {
    if (filters.type !== "null") {
      if (filters.type !== item.type) {
        return false;
      }
    }

    if (filters.breeds.primary !== "") {
      if (filters.breeds.primary !== item.breeds.primary) return false;
    }

    if (filters.age !== "null") {
      if (filters.age !== item.age) return false;
    }
    if (filters.size !== "null") {
      if (filters.size !== item.size) return false;
    }
    if (filters.gender !== "null") {
      if (filters.gender !== item.gender) return false;
    }
    if (filters.colors.primary !== "") {
      if (filters.colors.primary !== item.colors.primary) return false;
    }
    if (filters.coat !== "null") {
      if (filters.coat !== item.coat) return false;
    }
    if (filters.attributes.spayed_neutered) {
      if (!item.attributes.spayed_neutered) {
        return false;
      }
    }
    if (filters.attributes.house_trained) {
      if (!item.attributes.house_trained) {
        return false;
      }
    }
    if (filters.attributes.declawed) {
      if (!item.attributes.declawed || item.attributes.declawed === null) {
        return false;
      }
    }
    if (filters.attributes.special_needs) {
      if (!item.attributes.special_needs) {
        return false;
      }
    }
    if (filters.attributes.shots_current) {
      if (!item.attributes.shots_current) {
        return false;
      }
    }
    if (filters.environment.children) {
      if (!item.environment.children) {
        return false;
      }
    }
    if (filters.environment.cats) {
      if (!item.environment.cats) {
        return false;
      }
    }
    if (filters.environment.dogs) {
      if (!item.environment.children) {
        return false;
      }
    }
    return true;
  });
  let filteredAnimals = filteredResults
  renderCards(filteredAnimals);
  buildFavBtns();
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

//Clear LocalStorage


function clearAll() {
  localStorage.clear();
  location.reload()
}

