console.log("hello")
const searchInput = document.querySelector('#search');
const searchButton = document.querySelector('#searchButton');
searchButton.addEventListener('click', () => {
  const category = searchInput.value.trim(); // Retrieve the input value and remove leading/trailing whitespace
  fetch(`/api/item?category=${category}`)
  .then(response => response.json())
  .then(data => {
    // Handle the response data here
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occurred during the request
    console.error('Error:', error);
  })};
  
searchInput.addEventListener('keydown', (event) => {
    event.preventDefault();
    if (event.key === 'Enter') {
    const category = searchInput.value.trim();
    fetch(`/api/item?category=${category}`)
  .then(response => response.json())
  .then(data => {
    // Handle the response data here
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occurred during the request
    console.error('Error:', error);
  })};

});









