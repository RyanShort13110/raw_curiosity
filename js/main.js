// Mars rover photos

/*
todo from here...
Add relevant data from API to the DOM such as: 
- rover's name (Curiosity will be our main rover) ✔
- camera the photo(s) were taken with (FHAZ, RHAZ, NAVCAM, etc.) ✔
- photo id for each pic ✔

More advanced things to add...
- DOM api url manipulation to allow for the following...
  -) select different rovers (maybe with dropdown) ✔
  -) select different cameras (fhaz, rhaz, mast, chemcam, mahli, mardi, navcam, pancam, minites) ✔

- pagination for dates with many pics ("click to show more")
- save "favorites" using localStorage and unique image id
- search all images by id
*/

document.querySelector(".make-fetch").addEventListener("click", getFetch)
document.querySelector(".toggle-view").addEventListener("click", toggleView)

function getFetch() {
  document.querySelector("ul").textContent = "" // clear these 3 on new search
  document.querySelector(".rover-name").textContent = ""
  document.querySelector(".cam-type").textContent = ""
  const date = document.querySelector("input").value // get date

  // change api query parameters using DOM elements
  const camChoice = document.getElementById("camera")
  const roverChoice = document.getElementById("rover")
  const roverCam = camChoice.options[camChoice.selectedIndex].value
  const userRover = roverChoice.options[roverChoice.selectedIndex].value

  // add data to browser cache and check how log its been there
  const cacheKey = `${userRover}-${roverCam}-${date}`
  const cachedData = localStorage.getItem(cacheKey)
  
  if(cachedData){
    const { timestamp, data } = JSON.parse(cachedData)
    const now = Date.now()
  
    if(now - timestamp < 3600000){ // if cached data is < 1 hour old
      displayData(data)
      return
    }
  }
  
  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${userRover}/photos?earth_date=${date}&camera=${roverCam}&page=1&api_key=637bWjPJ74JSOXq2SpTNqvOldsEceDSnYGNOILfX`

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      // store the data in the cache
      localStorage.setItem(cacheKey, JSON.stringify(data))
      displayData(data)
    })
    .catch((err) => {
      console.log(`error: ${err}`)
      document.querySelector(".rover-name").textContent =
        "No data available. Try a different date or camera."
    })
}

function displayData(data) {
  let roverName = data.photos[0].rover.name
  let camName = data.photos[0].camera["full_name"]

  document.querySelector(".cam-type").textContent = camName
  document.querySelector(".rover-name").textContent = roverName

  // if "li" elements are on the page, display the "change layout" button & activate the "return to search" button
  if(document.querySelector(".cam-type").textContent != ""){
    document.querySelector(".toggle-view").classList.remove("hidden")

    window.onscroll = _ => scrollFunction();
  }

  // forEach creates and adds images and their ids to the dom as "li" elements
  data.photos.forEach(el => {
    let id = el.id
    let marsPics = el["img_src"]
    let liElm = document.createElement("li")
    let roverPic = document.createElement("img")
    let liText = document.createElement("span")

    roverPic.src = marsPics
    liText.textContent = `Image ID: ${id}`

    liElm.appendChild(liText)
    liElm.appendChild(roverPic)
    document.querySelector("ul").appendChild(liElm)
  })
}

// clear localStorage if 1 hour has elapsed since last search
function clearLocalStorage() {
  const expirationTime = 3600000 // 1 hour
  const lastUpdated = localStorage.getItem("lastUpdated");
  const currentTime = new Date().getTime();

  if (lastUpdated && currentTime - lastUpdated > expirationTime) {
    localStorage.clear();
    console.log("localStorage cleared!");
  }

  localStorage.setItem("lastUpdated", currentTime);
}
clearLocalStorage()

// layout toggle function
function toggleView(){
  document.querySelector("ul").classList.toggle("change-view")
}

// controlls when the "return to search" button appears. 
// currently after 2500 pixels from the top. want to make this more fluid.
function scrollFunction(){
  const mybutton = document.querySelector("#scroll-btn")
  if (document.body.scrollTop > 2500 || document.documentElement.scrollTop > 2500){
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// sets target & behavior for the scroll function
function topFunction(){
  let menus = document.querySelector(".middle")
  menus.scrollIntoView({behavior: "smooth"});
} 