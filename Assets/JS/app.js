//grant_type=client_credentials&client_id=du5LZGcyZhM51weBA55R5wexC39ZP2goVW2i7TAcayFnkDUtX4&client_secret=AStWV6OJyCylpnWHlOZh4HfR3w2zTiLWoCya9HAD https://api.petfinder.com/v2/oauth2/token

// let token = new petfinder.Client({apiKey: "du5LZGcyZhM51weBA55R5wexC39ZP2goVW2i7TAcayFnkDUtX4", secret:"AStWV6OJyCylpnWHlOZh4HfR3w2zTiLWoCya9HAD"})

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
  let randompics = await client.animal.search({
    type: "dog",
    primary_photo_cropped: true,
    limit: 10,
  });

  console.log(randompics);
  console.log(randompics.data.animals[0]);

  let animal = randompics.data.animals[0];

  console.log(animal.primary_photo_cropped);

  let photo = animal.primary_photo_cropped.medium;
  console.log(photo);

  document.getElementById("picture").src = photo;
}

getpics();
