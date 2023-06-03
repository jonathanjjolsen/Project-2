const newFormHandler = async (event) => {
  event.preventDefault();

  const name = document.querySelector('#item-name').value.trim();
  const price = document.querySelector('#item-price').value.trim();
  const manufacturer = document.querySelector('#item-manufacturer').value.trim();
  const color = document.querySelector('#item-color').value.trim();
  const year = document.querySelector('#item-year').value.trim();
  const description = document.querySelector('#item-desc').value.trim();
  
  document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('select');
    let instances = M.FormSelect.init(elems, options);

    choice = instances.getSelectedValues();
  });

  if (name && price && description) {
    const response = await fetch(`/api/items`, {
      method: 'POST',
      body: JSON.stringify({ name, price, manufacturer, color, year, description }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to create item');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/items/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/profile');
    } else {
      alert('Failed to delete item');
    }
  }
};

document
  .querySelector('.new-item-form')
  .addEventListener('submit', newFormHandler);

// document
//   .querySelector('.item-list')
//   .addEventListener('click', delButtonHandler);
