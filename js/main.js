// Variables
let searchResultEl = document.querySelector(".search-result");
let cardsHolderEl = document.querySelector(".cards-holder");
let recipeDetailsEl = document.querySelector(".recipe-content");
let searchInput = document.getElementById("searchInput");
let searchBtn = document.getElementById("searchBtn");
let mealBaseUrl = "https://www.themealdb.com/api/json/v1/1";
let closeBtn = document.querySelector(".btn-close");

// Event Listeners
// Close Btn
closeBtn.addEventListener("click", (e) => {
  e.currentTarget.parentElement.classList.remove("show");
});
// Search Input
searchInput.addEventListener("keypress", (e) => {
  if (e.key == "Enter") searchBtn.click();
});
// Search Btn
searchBtn.addEventListener("click", () => {
  let searchValue = searchInput.value.trim();
  if (searchValue != "") {
    searchMealsByName(searchValue);
  }
});
document.addEventListener("click", (e) => {
  // Recipe Btn
  if (e.target.classList.contains("recipe-btn")) {
    let mealId = e.target.dataset.mealid;
    getMealDescById(mealId);
  }
  // Close Btn When clicking Outside
  if (!document.querySelector(".recipe-details-modal").contains(e.target)) {
    closeBtn.click();
  }
});

// Functions
function searchMealsByName(mealName) {
  fetch(`${mealBaseUrl}/search.php?s=${mealName}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw response.status;
      }
    })
    .then(({ meals }) => {
      displayRecipes(meals);
    })
    .catch((error) => {
      console.log(error);
    });
}
function displayRecipes(meals) {
  cardsHolderEl.innerHTML = "";
  showSearchResultElement();
  if (meals) {
    for (let { strMealThumb: mealImgUrl, strMeal: mealName, idMeal } of meals) {
      cardsHolderEl.innerHTML += `
          <div class="col-md-6 col-lg-4">
            <div class="card text-center shadow border-0">
              <img src=${mealImgUrl} class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title user-select-all" title="${mealName}">${mealName}</h5>
                <button class="recipe-btn btn btn-primary my-2" data-mealid=${idMeal}>Get Recipe</button>
              </div>
            </div>
          </div>
      `;
    }
  } else {
    let noResultEl = document.createElement("div");
    let noResultSpan = document.createElement("span");
    let noResultSpanText = document.createTextNode("No Results found");
    noResultEl.className =
      "noresult d-flex align-items-center justify-content-center fw-bold fs-3 text-info";
    noResultSpan.appendChild(noResultSpanText);
    noResultEl.appendChild(noResultSpan);
    cardsHolderEl.appendChild(noResultEl);
  }
}
function getMealDescById(mealId) {
  fetch(`${mealBaseUrl}/lookup.php?i=${mealId}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw response.status;
      }
    })
    .then(({ meals: [meal] }) => {
      fillRecipeDetailsEl(meal);
    })
    .catch((error) => {
      console.log(error);
    });
}
function fillRecipeDetailsEl({
  strMealThumb: mealImg,
  strMeal: mealName,
  strYoutube: mealVideoUrl,
  strInstructions: mealInstructions,
}) {
  recipeDetailsEl.scrollTop = 0;
  recipeDetailsEl.innerHTML = `
      <div class="recipe-img text-center mt-3">
        <img src="${mealImg}" alt="meal image" class="img-fluid rounded" />
      </div>
      <h3 class="recipe-title text-center my-3">
        ${mealName}
      </h3>
      <div class="recipe-instructions">
        <span class="d-block mb-4 h4">Insturctions:</span>
        <p class="lead">
          ${mealInstructions}
        </p>
      </div>
      <a href="${mealVideoUrl}" class="btn btn-primary btn-lg d-block">Watch Video</a>
      `;
  recipeDetailsEl.parentElement.classList.add("show");
}
function showSearchResultElement() {
  searchResultEl.classList.remove("d-none");
}
