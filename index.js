// Initialize maps, score etc...
let panorama;
let map;
let score = 0;
let marker;
let correctMarker;
let lat;
let lng;
let poly;
let round = 1;
let points;
let distance;
let googlePov;

let homeScreen = document.getElementById('home-screen-container')


// GSAP Animations
gsap.from('.home-screen-slider', { duration: 1.2, y: '-100%', ease: 'bounce', delay: .1})
gsap.from('.logo', { duration: 2, x: '200%', ease: 'elastic', delay: 1.2 })
gsap.fromTo('.home-screen-btns', { opacity: 0}, {opacity: 1, duration: 4.5, ease: 'expo', delay: 2})

let howToPlayBtn = document.getElementById('how-to-play-btn')
let instructionsContainer = document.getElementById('instructions-container')
let okayBtn = document.getElementById('okay-btn')

let startGameBtn = document.getElementById('start-game-btn')

howToPlayBtn.addEventListener('click', ()=> {
  gsap.fromTo(".instructions-container", { y: '-100%'}, {y: '35px', ease: 'bounce', delay: .2, duration: 2})
})

okayBtn.addEventListener('click', () => {
  gsap.fromTo(".instructions-container", { y: '35px'}, {y: '-100%', ease: 'power4', delay: .2, duration: 2})
})

startGameBtn.addEventListener('click', () => {
  // Animates home-screen to start game 
  gsap.fromTo(".logo", { x: '0'}, {x: '-200%', ease: 'slow', delay: .1, duration: 1})
  gsap.fromTo(".home-screen-slider", { x: '0'}, {x: '-200%', ease: 'power1', delay: 1, duration: 1.5})
  gsap.fromTo(".white-background", { x: '0'}, {x: '-200%', ease: 'power2', delay: 1, duration: 1.5})
  gsap.fromTo(".home-screen-btns", { x: '0'}, {x: '-200%', ease: 'power2', delay: 1, duration: 1.5})
  setTimeout(hideHomeScreen, 2000)

  // Animates score card from right side 
  gsap.fromTo('.game-score-card-container', { x: '100%'}, {x: '0', ease: 'power4', delay: 1.1, duration: 2})
  gsap.fromTo('.trapezoid-yellow', { x: '100%'}, {x: '0', ease: 'power4', delay: 1.1, duration: 2})
  gsap.fromTo('.trapezoid-red', { x: '100%'}, {x: '0', ease: 'power4', delay: 1.1, duration: 2})
  gsap.fromTo('.square-yellow', { x: '100%'}, {x: '0', ease: 'power4', delay: 1.1, duration: 2})

  // Animates map from right side
  gsap.fromTo('.map-box-container', { x: '200%'}, {x: '0', ease: 'power4', delay: 1.1, duration: 2})

})

function hideHomeScreen(){
  homeScreen.classList.add('hide')
}

// DOM elements 

let placePinBtn = document.getElementById('place-pin-btn')
let guessBtn = document.getElementById('guess-btn')

let smallGoogleMapContainer = document.getElementById('map-box-container')
let smallGoogleMap = document.getElementById('map')
let streetViewMap = document.getElementById('street-view')

let guessScoreContainer = document.getElementById('guess-score-container')
let guessedDistance = document.getElementById('guessed-distance')

let gameScoreCard = document.getElementById('game-score-card-container')
let scoreCardShapes = document.getElementById('score-card-shapes')

let yourFinalScore = document.getElementById('your-final-score')

let roundsLeft = document.getElementById('round')
roundsLeft.innerHTML = `${round}/5`

let pointsAdded = document.getElementById('points-added')
let userScore = document.getElementById('user-score')
let finalScore = document.getElementById('final-score-container')


let places = [
  [{ lat: 39.411930, lng: -104.872806 }, {heading: 0, pitch: 10 }], 
  [{ lat: -33.976695, lng: 25.647533}, {heading: 180, pitch: 10 }],
  [{ lat: 40.6913805, lng: -73.9915705 }, {heading: -85, pitch: 6 }], 
  [{ lat: -22.7563851, lng: -41.8894214}, {heading: 200, pitch: 10 }],
  [{ lat: 44.1134079, lng: 9.8376783 }, {heading: 180, pitch: 10 }], 
  [{ lat: 53.2728953, lng: -9.0523698 }, {heading: -75, pitch: 7 }],
  [{ lat: 34.3934459, lng: 132.4576324 }, {heading: 0, pitch: 8 }], 
  [{ lat: 56.4560068, lng: 84.9739889 }, {heading: -140, pitch: 8 }], 
  [{ lat: 33.7419109, lng: -84.3493135 }, {heading: -100, pitch: 12 }], 

  [{ lat: 34.0426219, lng: -118.3766484 }, {heading: 0, pitch: 10 }], 
  [{ lat: -33.4428858, lng: -70.6459227}, {heading: 150, pitch: 10 }],
  [{ lat: 18.4626096, lng: -66.0935658 }, {heading: 0, pitch: 6 }], 
  [{ lat: 46.4303122, lng:30.7290636}, {heading: -25, pitch: 10 }],
  [{ lat: 34.2271753, lng: -77.8307044 }, {heading: 100, pitch: 10 }], 
  [{ lat: 51.5012276, lng: -0.1934662 }, {heading: 50, pitch: 4 }],
  [{ lat: 14.6431828, lng: 121.0378312 }, {heading: -150, pitch: 8 }], 
  [{ lat: -39.4933145, lng: 176.9105662 }, {heading: 0, pitch: 8 }], 
  [{ lat: 41.9307204, lng: -87.643827 }, {heading: 100, pitch: 12 }], 

  [{ lat: 29.7487717, lng: -95.3711096 }, {heading: 50, pitch: 10 }], 
  [{ lat: 25.1518811, lng: 55.2007904,}, {heading: -50, pitch: 10 }],
  [{ lat: 39.7353519, lng: -8.7994176 }, {heading: -125, pitch: 6 }], 
  [{ lat: 18.4622425, lng: -66.2708305 }, {heading: 25, pitch: 10 }],
  [{ lat: -12.1100047, lng: -77.03725 }, {heading: -100, pitch: 14 }], 
  [{ lat: 25.7904218, lng: -80.1319336 }, {heading: -100, pitch: 4 }],
  [{ lat: 25.0778329, lng: -77.346336 }, {heading: -150, pitch: 8 }], 
  [{ lat: 36.1809066, lng: -115.1801713 }, {heading: 120, pitch: 8 }], 
  [{ lat: 44.9149924, lng: -68.6833332 }, {heading: -20, pitch: 12 }], 
]

// Gets a random location 
let currentPlace = places[Math.floor(Math.random() * (places.length))]  
let coordinates = currentPlace[0]
googlePov = currentPlace[1] 

// Initializes google maps and a polyline 
function initialize() {
  map = new google.maps.Map(document.getElementById("map"), {
   zoom: 1,
   center: {
     lat: 38.854885,
     lng: -98.081807
   },
   disableDefaultUI: true,
   draggingCursor:'crosshair',
   draggableCursor: 'crosshair'
 });
 
 // Dots for polyline
 const lineSymbol = {
  path: "M 0,-1 0,1",
  strokeOpacity: 1,
  scale: 4,
};

 poly = new google.maps.Polyline({
   strokeColor: 'rgb(255, 199, 45)',
   strokeOpacity: 0,
   strokeWeight: 1,
   icons: [
     {
       icon: lineSymbol,
       offset: "0",
       repeat: "15px",
     },
   ],
 });

 // Adds a marker on click of smaller map 
 map.addListener("click", (e) => {
   placeMarker(e.latLng, map);
 });

  panorama = new google.maps.StreetViewPanorama(
   document.getElementById("street-view"),
   {
     position: coordinates,
     pov: googlePov,
     addressControlOptions: {
       position: false
     },
     linksControl: false,
     panControl: false,
     enableCloseButton: true,
     disableDefaultUI: true,
   }
   
 )
}

const playAgain = () => {
  location.reload()
}


// Starts a new round - hides elements it needs to, updates score and round then re-initializes the maps
const playNextRound = () => { 
  smallGoogleMap.classList.remove('map-box-guess')
  smallGoogleMap.classList.add('map-box')

  // gsap.fromTo(".guess-score-container", { opacity: '1'}, {opacity: '0', ease: 'power3', duration: 3})
  guessScoreContainer.classList.remove('guess-score-container')

  smallGoogleMapContainer.classList.remove('guess-map')
  
  placePinBtn.classList.remove('hide')
  placePinBtn.classList.add('place-style')


  currentPlace = places[Math.floor(Math.random() * (places.length))]
  coordinates = currentPlace[0] 
  marker = null

  score += points
  userScore.innerHTML = score

  if(round >= 5){
    showTotalScore()
  } else {
    round++
    roundsLeft.innerHTML = `${round}/5`
  }

  

  initialize()
}


// After 5 rounds this will display the users stats and allow to play a new game 
function showTotalScore(){
  finalScore.classList.remove('hide')
  finalScore.classList.add('final-score-container')
 
  yourFinalScore.innerHTML = `Your Final Score was ${score}!`

  smallGoogleMap.classList.add('hide')
  streetViewMap.classList.add('hide')
  placePinBtn.classList.add('hide')
  gameScoreCard.classList.add('hide')
  scoreCardShapes.classList.add('hide')
  guessScoreContainer.classList.add('hide')

  gsap.fromTo(".final-score-card", { y: '-100%'}, {y: '100%', ease: 'bounce', delay: .2, duration: 2})
  gsap.fromTo('.play-again-btn', { opacity: 0}, {opacity: 1, duration: 3, ease: 'expo', delay: .3})

  setTimeout(showConfetti, 2000)
}

function showConfetti(){
  confetti({
      particleCount: 100,
      spread: 70,
      origin: {
          y: 0.6
      }
  });
}

// Places the correct marker location on the map, calculates the distance between the locations and the points earned 
const guess= () => {
  const image = {
    url: "https://freepngimg.com/thumb/burger%20sandwich/38-hamburger-burger-png-image.png",
    scaledSize: new google.maps.Size(27, 27),
  };
  
  correctMarker = new google.maps.Marker({
    position: coordinates,
    icon: image,
    map: map
  })

  addLatLng(marker.getPosition(), correctMarker.getPosition())
  
  poly.setMap(map);

  map.panTo(correctMarker.position)
  map.setZoom(6)

  calculateDistance(marker, correctMarker)

  placePinBtn.classList.add('hide')

  smallGoogleMapContainer.classList.add('guess-map')

  guessBtn.classList.add('hide')
  

  smallGoogleMap.classList.remove('map-box')
  smallGoogleMap.classList.add('map-box-guess')
    
  guessScoreContainer.classList.remove('hide')
  guessScoreContainer.classList.add('guess-score-container')


  guessedDistance.textContent = `Your guess was ${distance.toFixed(0)} km from the correct location`


  if(distance <= 150){
    points = 1000
  } else if (distance > 150 && distance < 500){
    points = 800
  } else if (distance > 500 && distance < 1000){
    points = 750
  } else if (distance > 1000 && distance < 2000){
    points = 500
  } else if (distance > 2000 && distance < 3000){
    points = 400
  } else if (distance > 3000 && distance < 5000){
    points = 250 
  } else {
    points = 50
  }

  pointsAdded.innerHTML = `+ ${points}`
}

// Adds guessed lat/lng and correct lat/lng to polyline 
function addLatLng(latLng, latLngCorrectMarker) {
  path = poly.getPath();
  path.push(latLng);
  path.push(latLngCorrectMarker)
}

// Calculates the distance of the google maps polyline then converts it to km 
function calculateDistance(mk1, mk2) {
  let radius = 3958.8
  let rlat1 = mk1.position.lat() * (Math.PI/180)
  let rlat2 = mk2.position.lat() * (Math.PI/180)
  let difflat = rlat2-rlat1; 
  let difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180)

  distance = 2 * radius * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  distance = distance * 1.609344 
}



// Places a marker on the map, changes the "place-a-pin..." to a guess button 
function placeMarker(latLng, map) {
  
  placePinBtn.classList.add('hide')

  guessBtn.classList.remove('hide')
  guessBtn.classList.add('guess-btn')

  if (marker == null){
    marker = new google.maps.Marker({
      position: latLng,
      map: map,
  });
  } else {
    marker.setPosition(latLng)
  }
}


