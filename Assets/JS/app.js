// will's code
//grant_type=client_credentials&client_id=du5LZGcyZhM51weBA55R5wexC39ZP2goVW2i7TAcayFnkDUtX4&client_secret=AStWV6OJyCylpnWHlOZh4HfR3w2zTiLWoCya9HAD https://api.petfinder.com/v2/oauth2/token

// let token = new petfinder.Client({apiKey: "du5LZGcyZhM51weBA55R5wexC39ZP2goVW2i7TAcayFnkDUtX4", secret:"AStWV6OJyCylpnWHlOZh4HfR3w2zTiLWoCya9HAD"})

let geoAPIKey = "adbcd1fea76a22fc844c199455b4e260";

const client = new petfinder.Client({
  apiKey: "du5LZGcyZhM51weBA55R5wexC39ZP2goVW2i7TAcayFnkDUtX4",
  secret: "AStWV6OJyCylpnWHlOZh4HfR3w2zTiLWoCya9HAD",
});

// async function showAnimals(animalType, searchBreed) {
//   let page = 1;
//   do {
//     apiResult = await client.animal.search({
//       type: animalType,
//       breed: searchBreed,
//       page,
//       limit: 100,
//     });
//     let dogIdx = (page - 1) * 100;
//     apiResult.data.animals.forEach(function(animal) {
//       console.log(` -- ${++dogIdx}: ${animal.name} id: ${animal.id} url: ${animal.url}`);
//     });

//     page++;
//   } while(apiResult.data.pagination && apiResult.data.pagination.total_pages >= page);
// }
// showAnimals("dog", "chihuahua")

async function getpics() {
  let randompic = await client.animal.search({
    photos: true,
    status: "adoptable",
    limit: 3,
  });

  //   console.log(randompic);
  //   console.log(randompic.data.animals[0]);

  let pic1 = randompic.data.animals[0];
  let pic2 = randompic.data.animals[1];
  let pic3 = randompic.data.animals[2];
  console.log(pic1);

  document.getElementById("randomlink").href = pic1.url;

  document.getElementById("randomname").textContent = pic1.name;

  document.getElementById("randomdesc").textContent = pic1.description;

  document.getElementById("doglink").href = pic2.url;

  document.getElementById("dogname").textContent = pic2.name;

  document.getElementById("dogdesc").textContent = pic2.description;

  document.getElementById("catlink").href = pic3.url;

  document.getElementById("catname").textContent = pic3.name;

  document.getElementById("catdesc").textContent = pic3.description;

  //   console.log(randomanimal.primary_photo_cropped);

  //   console.log(randomphoto);

  document.getElementById("random-pic").src = pic1.photos[0].medium;
  document.getElementById("dog-pic").src = pic2.photos[0].medium;
  document.getElementById("cat-pic").src = pic3.photos[0].medium;
}

getpics();

async function search() {
  event.preventDefault();
  let searchstring = document.getElementById("searchstring").value;
  let distance = document.getElementById("distance").value;
  let locationURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchstring}&limit=5&appid=${geoAPIKey}`;
  let location = await (await fetch(locationURL)).json();

  let lat = location[0].lat;
  let lon = location[0].lon;

  let latlon = lat + ", " + lon;
  let page = 1;
  let results = [];
  do {
    results = await client.animal.search({
    location: latlon,
    distance: distance,
    status: "adoptable",
    page,
    limit: 10,
  });
    let dogIdx = (page - 1) * 10;
    results.data.animals.forEach(function(animal) {
        console.log(` -- ${++dogIdx}: ${animal.name} id: ${animal.id} url: ${animal.url}`);
  }); 
     page++;
    } while(results.data.pagination && results.data.pagination.total_pages >= page);
       
      
  
    console.log(results);
}
let form = document.getElementById("searchform");
form.addEventListener("submit", search);

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
    console.log($target);

    $trigger.addEventListener("click", () => {
      openModal($target);
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
