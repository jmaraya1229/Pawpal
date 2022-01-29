// will's code
//grant_type=client_credentials&client_id=du5LZGcyZhM51weBA55R5wexC39ZP2goVW2i7TAcayFnkDUtX4&client_secret=AStWV6OJyCylpnWHlOZh4HfR3w2zTiLWoCya9HAD https://api.petfinder.com/v2/oauth2/token

// let token = new petfinder.Client({apiKey: "du5LZGcyZhM51weBA55R5wexC39ZP2goVW2i7TAcayFnkDUtX4", secret:"AStWV6OJyCylpnWHlOZh4HfR3w2zTiLWoCya9HAD"})

let geoAPIKey = "adbcd1fea76a22fc844c199455b4e260";

// will's petfinder creds:
// apiKey: "du5LZGcyZhM51weBA55R5wexC39ZP2goVW2i7TAcayFnkDUtX4",
// secret: "AStWV6OJyCylpnWHlOZh4HfR3w2zTiLWoCya9HAD",

// trent's petfinder creds:
// apiKey: "c4Kr5BRTXhQEhXoQweeNHLhO43gdfD4sCbYy6vD9s93RuRluyB",
// secret: "LpRMDqN9WakbzJjstuJ4TxzvQDg6Qk9o9I60R1na",

// jesse's petfinder creds:
// apiKey: "mFaTDg20CUKN5hJQNpl8OQ2SC6ClhkYHOKyfs7jrRkL6plQkqY",
// secret: "9AyO9i6tDmZox227F5yn7ePOnkRvq67geVbb7fnA",

const client = new petfinder.Client({
  apiKey: "c4Kr5BRTXhQEhXoQweeNHLhO43gdfD4sCbYy6vD9s93RuRluyB",
  secret: "LpRMDqN9WakbzJjstuJ4TxzvQDg6Qk9o9I60R1na",
});


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


  if (pic1.photos.length == 0) {
    document.getElementById("random-pic").src = ("./Assets/IMAGES/pet-filler-img.jpg");
  } else {
    document.getElementById("random-pic").src = pic1.photos[0].medium;
  }

  if (pic2.photos.length == 0) {
    document.getElementById("dog-pic").src = ("./Assets/IMAGES/pet-filler-img.jpg");
  } else {
    document.getElementById("dog-pic").src = pic2.photos[0].medium;
  }

  if (pic3.photos.length == 0) {
    document.getElementById("cat-pic").src = ("./Assets/IMAGES/pet-filler-img.jpg");
  } else {
    document.getElementById("cat-pic").src = pic3.photos[0].medium;
  }

  if (pic1.description == "" || pic1.description == null) {
    document.getElementById("randomdesc").textContent = "Adopt me!";
  }  else {
    document.getElementById("randomdesc").textContent = pic1.description;
  }

  if (pic2.description == "" || pic2.description == null) {
    document.getElementById("dogdesc").textContent = "Adopt me!";
  }  else {
    document.getElementById("dogdesc").textContent = pic2.description;
  }

  if (pic3.description == "" || pic3.description == null) {
    document.getElementById("catdesc").textContent = "Adopt me!";
  }  else {
    document.getElementById("catdesc").textContent = pic3.description;
  }

}

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
  let results = "";
  do {
    results = await client.animal.search({
    location: latlon,
    distance: distance,
    status: "adoptable",
    page,
    limit: 100,
  });
    let animalID = (page - 1) * 100;
    results.data.animals.forEach(function(animal) {
        console.log(` -- ${++animalID}: ${animal.name} id: ${animal.id} url: ${animal.url}`);
  }); 
     page++;
    } while(results.data.pagination && results.data.pagination.total_pages >= page);
       
    console.log(results);
}
let form = document.getElementById("searchform");
form.addEventListener("submit", search);

// looping through and pulling info from wills code

var displayResults = function (results) {
  if (results.length === 0) {
    repoContainerEl.textContent = 'No animals found.';
    return;
  }
  for (var i = 0; i < results.length; i++) {
    var animalName = results[i] + '/' + results[i].name;

    var animalEl = document.createElement('a');
    animalEl.classList = 'list-item flex-row justify-space-between align-center';
    animalEl.setAttribute('href', './single-repo.html?repo=' + animalName);

    var titleEl = document.createElement('span');
    titleEl.textContent = repoName;

    animalEl.appendChild(titleEl);

    var statusEl = document.createElement('span');
    statusEl.classList = 'flex-row align-center';

    if (results[i].open_issues_count > 0) {
      statusEl.innerHTML =
        "<i class='fas fa-times status-icon icon-danger'></i>" + results[i].open_issues_count + ' issue(s)';
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    animalEl.appendChild(statusEl);

    repoContainerEl.appendChild(animalEl);
  }
};
displayResults()
console.log(results)

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

// Jess code for Favorite modal button
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal($el) {
    $el.classList.add('is-active');
  }

  function closeModal($el) {
    $el.classList.remove('is-active');
  }

  function closeAllModals() {
    (document.querySelectorAll('modal') || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    console.log($target);

    $trigger.addEventListener('click', () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
    const $target = $close.closest('.modal');

    $close.addEventListener('click', () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event;

    if (e.keyCode === 27) { // Escape key
      closeAllModals();
    }
  });
});

var feed = {created_at: "2017-03-14T01:00:32Z", entry_id: 33358, field1: "4", field2: "4", field3: "0"};

var data = [0];
data.push(feed);

console.log(data);