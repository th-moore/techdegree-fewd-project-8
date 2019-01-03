/////////////////////////////////////////////////
// GLOBAL VARIABLES
/////////////////////////////////////////////////

let listItems = [];
let listContainer = document.getElementById('employeeList');

// Get the modal
const modal = document.getElementById('myModal');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];


/////////////////////////////////////////////////
// FETCH API
/////////////////////////////////////////////////


// FETCH FUNCTIONS ==============================

function fetchData(url) {
  return fetch(url)
    .then(checkStatus)
    .then(res => res.json())
    .catch(error => console.log('Looks like there was a problem!', error))
}

fetchData('https://randomuser.me/api/?results=12')
  .then(data => {
    const userList = data.results;
    generateCards(userList);
  })


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
    <img src="${item.picture.medium}">
    <div class="card-details">
      <h3>${item.name.first} ${item.name.last}</h3>
      <p>${item.email}</p>
      <p>${item.location.city}</p>
    </div>
  </li>
  `).join('');

  document.getElementById('employeeList').innerHTML = employeeListHTML;
};


// EVENT LISTENERS ==============================

// Event listener so when cards are clicked, call the function to display the modal
listContainer.addEventListener('click', displayModal);

function displayModal(e) {  
  if (e.target.closest('.employeeCard')) {
    let clickedCard = e.target.closest('.employeeCard');
    console.log(clickedCard.parentNode);
    let listIndex = clickedCard.parentNode.dataset.index;
    console.log('Employee card has been clicked at index:' + listIndex);
    modal.style.display = "block";
    // setModalContent(listIndex);
  } 
};


/////////////////////////////////////////////////
// MODAL BEHAVIOURS
/////////////////////////////////////////////////

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}