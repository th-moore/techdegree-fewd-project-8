/////////////////////////////////////////////////
// GLOBAL VARIABLES
/////////////////////////////////////////////////


// Prepare a variable that will eventually contain the array of users
let userList = [];
// Prepare a variable that will eventually contain each of the user card DOM elements
// let userCards = [];
// Prepare a variable that will eventually contain the index of the user currently viewed in the modal
let modalIndex = 1;
// Variable containing the number of users to be requested
const numberOfUsers = 12;

// Get the modal
const modal = document.getElementById("myModal");
// Get the 'close' button in the modal
const closeBtn = document.getElementsByClassName("m-close")[0];
// Get the 'previous' button in the modal
const prevBtn = document.getElementsByClassName("m-prev")[0];
// Get the 'next' button in the modal
const nextBtn = document.getElementsByClassName("m-next")[0];

// Get the search bar
const searchBar = document.getElementById("searchbar");


/////////////////////////////////////////////////
// FETCH API
/////////////////////////////////////////////////


// FETCH FUNCTIONS ==============================

function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .catch(error => console.log('Looks like there was a problem!', error))
}

fetchData(`https://randomuser.me/api/?results=${numberOfUsers}&nat=us`)
  .then(data => {
    userList = data.results;
    console.log(userList);
    generateCards(userList);
  })
  .then(addEventListenerToEmployees);


// HELPER FUNCTIONS =============================

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function generateCards(data) {
  const employeeListHTML = data.map(item => `
  <li class="employeeCard">
    <div>  
      <img id="c-photo" src="${item.picture.medium}">
    </div>
    <div class="card-details">
      <h3 id="c-name">${item.name.first} ${item.name.last}</h3>
      <p id="c-email">${item.email}</p>
      <p id="c-city">${item.location.city}</p>
    </div>
  </li>
  `)
  .join('');

  document.getElementById('employeeList').innerHTML = employeeListHTML;
};

function setModalContent(currentIndex) {
  document.getElementById('m-photo').src = `${userList[currentIndex].picture.medium}`;
  document.getElementById('m-name').textContent = `${userList[currentIndex].name.first} ${userList[currentIndex].name.last}`;
  document.getElementById('m-email').textContent = `${userList[currentIndex].email}`;
  document.getElementById('m-mobile').textContent = `${userList[currentIndex].cell}`;
  document.getElementById('m-address').innerHTML = `${userList[currentIndex].location.street}<br> ${userList[currentIndex].location.city}<br> ${userList[currentIndex].location.state}<br> ${userList[currentIndex].location.postcode}`;
    let birthday = userList[currentIndex].dob.date;  
    let bDate = birthday.substring(8,10);
    let bMonth = birthday.substring(5,7);
    let bYear = birthday.substring(2,4);;
  document.getElementById('m-dob').textContent = `Birthday: ${bDate}/${bMonth}/${bYear}`;
  document.getElementById('m-index').textContent = `Employee ${currentIndex + 1} of ${userList.length}`;
  
  prevBtn.style.display = "block";
  nextBtn.style.display = "block";

  if (currentIndex == numberOfUsers - 1) {
    nextBtn.style.display = "none";
  } else if (currentIndex == 0) {
    prevBtn.style.display = "none";
  }
};


// EVENT LISTENERS ==============================

// Function to add event listeners to each of the list items as they're created.
function addEventListenerToEmployees() {
  let listCards = document.querySelectorAll(".employeeCard");

  for (let i = 0; i < listCards.length; i += 1) {
    listCards[i].addEventListener('click', displayModal);
  }
};

// Event listener so when the 'next' arrow is clicked, the modal is updated with the next user's data.
nextBtn.addEventListener('click', nextUserModal);

// Event listener so when the 'previous' arrow is clicked, the modal is updated with the previous user's data.
prevBtn.addEventListener('click', previousUserModal);

// Event listener so when someone enters a term in the search bar, the list of users is filtered.
searchBar.addEventListener('keyup', filterUsers);


/////////////////////////////////////////////////
// MODAL BEHAVIOURS
/////////////////////////////////////////////////

function displayModal(e) {  
  let clickedCard = e.target.closest('li');
  let arrayOfCards = Array.from(clickedCard.closest('ul').children);
  modalIndex = arrayOfCards.indexOf(clickedCard);
  
  modal.style.display = "block";
  prevBtn.style.display = "block";
  nextBtn.style.display = "block";
  
  setModalContent(modalIndex);
};

function nextUserModal() {
  modalIndex = modalIndex + 1;
  setModalContent(modalIndex);
};

function previousUserModal() {
  modalIndex = modalIndex - 1;
  setModalContent(modalIndex);
}

// When the user clicks on <span> (x), close the modal
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


/////////////////////////////////////////////////
// SEARCH FUNCTIONALITY
/////////////////////////////////////////////////

function filterUsers() {
  let input = searchBar.value.toLowerCase();
  let listCards = document.querySelectorAll(".employeeCard");
  
  for (let i = 0; i < listCards.length; i += 1) {
    let name = listCards[i].lastElementChild.firstElementChild.textContent;
    if (name.includes(input)) {
      listCards[i].style.display = "flex";
    } else {
      listCards[i].style.display = "none";
    }
  }
};