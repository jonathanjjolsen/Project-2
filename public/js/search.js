console.log("hello")
const searchInput = document.querySelector('#search');
const searchBar = document.querySelector('#searchBar');
searchBar.addEventListener('submit', (event) => {
    event.preventDefault();
    const category = searchInput.value.trim(); // Retrieve the input value and remove leading/trailing whitespace
    window.location.href = "/?category=" + category;
});











