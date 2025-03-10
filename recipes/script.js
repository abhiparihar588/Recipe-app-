const searchBox = document.querySelector(".searchBox");
const submit = document.querySelector(".submit");
const recipeContainer = document.querySelector("#recipe-container");
const recipeDetails = document.getElementById("recipe-details");
const closeButton = document.getElementById("close-details");

const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = "Fetching Recipes..."; // Loading text
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();

    recipeContainer.innerHTML = ""; // Clear any previous results

    if (response.meals) {
        response.meals.forEach(meal => {
            const recipeDiv = document.createElement("div");
            recipeDiv.classList.add("recipe");
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <h3>${meal.strMeal}</h3>
                <p>${meal.strArea}</p>
                <p>${meal.strCategory}</p>
            `;

            const button = document.createElement("button");
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            // When "View Recipe" button is clicked, show the recipe details in a modal
            button.addEventListener("click", () => {
                showRecipeDetails(meal);
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } else {
        recipeContainer.innerHTML = "No recipes found.";
    }
}

// Function to display the recipe details in the modal
const showRecipeDetails = (meal) => {
    const recipeTitle = document.getElementById("recipe-title");
    const recipeIngredients = document.getElementById("recipe-ingredients");
    const recipeInstructions = document.getElementById("recipe-instructions");

    recipeTitle.textContent = meal.strMeal;
    recipeIngredients.innerHTML = ''; // Clear previous ingredients
    recipeInstructions.innerHTML = ''; // Clear previous instructions

    // Loop through the ingredients and display them
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient) {
            const li = document.createElement("li");
            li.textContent = `${ingredient} - ${measure}`;
            recipeIngredients.appendChild(li);
        } else {
            break;
        }
    }

    // Display the instructions
    const instructions = document.createElement("p");
    instructions.textContent = meal.strInstructions;
    recipeInstructions.appendChild(instructions);

    // Show the modal
    recipeDetails.style.display = "block";
}

// Event listener to close the modal
closeButton.addEventListener("click", () => {
    recipeDetails.style.display = "none";
});

submit.addEventListener("click", (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim(); 
    if (searchInput) {
        fetchRecipes(searchInput);
    } else {
        recipeContainer.innerHTML = "Please enter a search term.";
    }
});
