// this is the original version of the javascript, saving it as a reference incase I need to revert back while testing the main file.

document.querySelector(".make-fetch").addEventListener("click", getFetch)
document.querySelector(".toggle-view").addEventListener("click", toggleView)

function getFetch() {
  document.querySelector("ul").textContent = "" // clear these on new search
  document.querySelector(".rover-name").textContent = ""
  document.querySelector(".cam-type").textContent = ""
  const date = document.querySelector("input").value // get date

  // changing api query parameters using DOM elements
  const camChoice = document.getElementById("camera") // get "options" from the "select" elements
  const roverChoice = document.getElementById("rover")
  const roverCam = camChoice.options[camChoice.selectedIndex].value // get camera option value
  const userRover = roverChoice.options[roverChoice.selectedIndex].value // get rover option value

  // use these to check if correct value is being obtained
  // console.log(userRover)
  // console.log(roverCam)

  const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${userRover}/photos?earth_date=${date}&camera=${roverCam}&page=1&api_key=637bWjPJ74JSOXq2SpTNqvOldsEceDSnYGNOILfX`

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      let roverName = data.photos[0].rover.name
      let camName = data.photos[0].camera["full_name"]

      document.querySelector(".cam-type").textContent = camName
      document.querySelector(".rover-name").textContent = roverName

      // if "li" elements are on the page, display the "change layout" button and activate the "return to search" button
      if(document.querySelector('.cam-type').textContent != ''){
        document.querySelector('.toggle-view').classList.remove('hidden')

        window.onscroll = function() {scrollFunction()}
      }

      // the forEach creates and adds images and their ids to the dom as "li" elements
      data.photos.forEach(el => {
        let marsPics = el["img_src"]
        let liElm = document.createElement("li")
        let roverPic = document.createElement("img")
        let liText = document.createElement("span")
        let id = el.id

        roverPic.src = marsPics
        liText.textContent = `Image ID: ${id}`

        liElm.appendChild(liText)
        liElm.appendChild(roverPic)
        document.querySelector("ul").appendChild(liElm)
      })
    })
    .catch((err) => {
      console.log(`error: ${err}`)
      document.querySelector(".rover-name").textContent =
        "No data available. Try a different date or camera."
    })
}

function toggleView(){
  document.querySelector("ul").classList.toggle("change-view")
}

function scrollFunction(){
  const mybutton = document.querySelector('#scroll-btn')
  if (document.body.scrollTop > 2500 || document.documentElement.scrollTop > 2500){
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction(){
  let menus = document.querySelector('.middle')
  menus.scrollIntoView({behavior: 'smooth'});
} 