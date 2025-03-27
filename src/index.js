document.addEventListener("DOMContentLoaded", () => {
    const dogBar = document.getElementById("dog-bar");
    const dogInfo = document.getElementById("dog-info");
    const filterButton = document.getElementById("good-dog-filter");
    let showOnlyGoodDogs = false;

    
    function fetchDogs() {
        fetch("http://localhost:3000/pups")
            .then(response => response.json())
            .then(dogs => {
                dogBar.innerHTML = "";
                dogs.forEach(dog => {
                    if (!showOnlyGoodDogs || dog.isGoodDog) {
                        addDogToBar(dog);
                    }
                });
            });
    }

    
    function addDogToBar(dog) {
        const span = document.createElement("span");
        span.textContent = dog.name;
        span.addEventListener("click", () => showDogDetails(dog));
        dogBar.appendChild(span);
    }

    
    function showDogDetails(dog) {
        dogInfo.innerHTML = `
            <img src="${dog.image}" alt="${dog.name}">
            <h2>${dog.name}</h2>
            <button id="toggle-goodness">${dog.isGoodDog ? "Good Dog!" : "Bad Dog!"}</button>
        `;

        const toggleButton = document.getElementById("toggle-goodness");
        toggleButton.addEventListener("click", () => toggleGoodness(dog));
    }

    
    function toggleGoodness(dog) {
        const updatedStatus = !dog.isGoodDog;
        fetch(`http://localhost:3000/pups/${dog.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isGoodDog: updatedStatus })
        })
        .then(response => response.json())
        .then(updatedDog => {
            showDogDetails(updatedDog);
            fetchDogs(); 
        });
    }

    filterButton.addEventListener("click", () => {
        showOnlyGoodDogs = !showOnlyGoodDogs;
        filterButton.textContent = `Filter good dogs: ${showOnlyGoodDogs ? "ON" : "OFF"}`;
        fetchDogs();
    });


    fetchDogs();
});
