const toyCollection = document.getElementById("toy-collection");
const addToyForm = document.querySelector(".add-toy-form");
const newToyBtn = document.getElementById("new-toy-btn");

// Fetch Toys and Display Cards
fetch("http://localhost:3000/toys")
  .then(response => response.json())
  .then(toys => {
    toys.forEach(toy => {
      const card = document.createElement("div");
      card.classList.add("card");

      const image = document.createElement("img");
      image.src = toy.image;
      image.classList.add("toy-avatar");
      card.appendChild(image);

      const name = document.createElement("h2");
      name.textContent = toy.name;
      card.appendChild(name);

      const likes = document.createElement("p");
      likes.textContent = `${toy.likes} Likes`;
      card.appendChild(likes);

      const likeBtn = document.createElement("button");
      likeBtn.classList.add("like-btn");
      likeBtn.id = toy.id;
      likeBtn.textContent = "Like ❤️";
      card.appendChild(likeBtn);

      toyCollection.appendChild(card);

      // Add event listener to like button here (explained later)
    });
  })
  .catch(error => console.error(error));

// Add Event Listener to "Create Toy" Button (provided)
addToyForm.addEventListener("submit", event => {
  event.preventDefault(); // Prevent default form submission

  const newToy = {
    name: event.target.name.value,
    image: event.target.image.value,
    likes: 0,
  };

  fetch("http://localhost:3000/toys", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(newToy),
  })
    .then(response => response.json())
    .then(createdToy => {
      // Create and add card for the new toy to the DOM
      const card = document.createElement("div");
      card.classList.add("card");

      // ... (similar to creating cards from fetched toys)

      toyCollection.appendChild(card);

      // Clear form after successful creation
      event.target.reset();
    })
    .catch(error => console.error(error));
});

// Add Event Listener to Like Buttons (after cards are rendered)
document.addEventListener("click", event => {
  const target = event.target;
  if (target.classList.contains("like-btn")) {
    const toyId = target.id;
    const likesElement = target.previousSibling; // Assuming "Like" button follows likes paragraph

    // Calculate new number of likes
    const currentLikes = parseInt(likesElement.textContent.split(" ")[0]);
    const newNumberOfLikes = currentLikes + 1;

    // Patch request to update likes
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newNumberOfLikes }),
    })
      .then(response => response.json())
      .then(updatedToy => {
        // Update likes count in the DOM
        likesElement.textContent = `${newNumberOfLikes} Likes`;
      })
      .catch(error => console.error(error));
  }
});


