const foodDatabase = [
    {
        name: "chicken breast",
        calories: 165,
        protein: 31,
        carbs: 0,
        fat: 3.6,
        fiber: 0
    },
    {
        name: "white rice",
        calories: 130,
        protein: 2.7,
        carbs: 28,
        fat: 0.3,
        fiber: 0.4
    },
    {
        name: "banana",
        calories: 89,
        protein: 1.1,
        carbs: 23,
        fat: 0.3,
        fiber: 2.6
    }
];


/*
 * DATE
 */

function getNutritionDateKey(date) {

    const year = date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/*
 * TARGETS
 */

function getNutritionTargets() {

    try {

        return JSON.parse(
            localStorage.getItem(TARGETS_KEY)
        ) || {};

    } catch (error) {

        return {};

    }
}


/*
 * STORAGE
 */

function getAllNutrition() {

    try {

        return JSON.parse(
            localStorage.getItem(NUTRITION_KEY)
        ) || {};

    } catch (error) {

        return {};

    }
}


/*
 * EMPTY DAY
 */

function createEmptyNutritionDay() {

    return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        water: 0,
        foods: []
    };
}


/*
 * GET TODAY'S NUTRITION
 */

function getNutrition() {

    const allNutrition =
        getAllNutrition();

    const todayKey =
        getNutritionDateKey(new Date());


    if (!allNutrition[todayKey]) {

        allNutrition[todayKey] =
            createEmptyNutritionDay();

        localStorage.setItem(
            NUTRITION_KEY,
            JSON.stringify(allNutrition)
        );

    }


    const nutrition =
        allNutrition[todayKey];


    nutrition.calories =
        Number(nutrition.calories) || 0;

    nutrition.protein =
        Number(nutrition.protein) || 0;

    nutrition.carbs =
        Number(nutrition.carbs) || 0;

    nutrition.fat =
        Number(nutrition.fat) || 0;

    nutrition.fiber =
        Number(nutrition.fiber) || 0;

    nutrition.water =
        Number(nutrition.water) || 0;


    if (!Array.isArray(nutrition.foods)) {

        nutrition.foods = [];

    }


    return nutrition;
}


/*
 * SAVE NUTRITION
 */

function saveNutrition(nutrition) {

    const allNutrition =
        getAllNutrition();

    const todayKey =
        getNutritionDateKey(new Date());


    allNutrition[todayKey] =
        nutrition;


    localStorage.setItem(
        NUTRITION_KEY,
        JSON.stringify(allNutrition)
    );
}


/*
 * FIND FOOD
 */

function findFood(name) {

    const searchName =
        String(name)
            .toLowerCase()
            .trim();


    if (!searchName) {

        return null;

    }


    return foodDatabase.find(
        function (food) {

            const foodName =
                String(food.name)
                    .toLowerCase();


            return (
                foodName.includes(searchName) ||
                searchName.includes(foodName)
            );

        }
    );
}


/*
 * REMAINING
 */

function getRemaining(target, current) {

    const targetValue =
        Number(target) || 0;

    const currentValue =
        Number(current) || 0;


    return Math.max(
        targetValue - currentValue,
        0
    );
}


/*
 * PROGRESS PERCENTAGE
 */

function getNutritionPercentage(
    current,
    target
) {

    const currentValue =
        Number(current) || 0;

    const targetValue =
        Number(target) || 0;


    if (targetValue <= 0) {

        return 0;

    }


    return Math.min(
        (currentValue / targetValue) * 100,
        100
    );
}


/*
 * PROGRESS BAR
 */

function updateNutritionProgressBar(
    id,
    current,
    target
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    const percentage =
        getNutritionPercentage(
            current,
            target
        );


    element.style.width =
        percentage + "%";


    const percentageIdMap = {

        "calorie-progress":
            "total-calories-progress",

        "protein-progress":
            "total-protein-progress",

        "carbs-progress":
            "total-carbs-progress",

        "fat-progress":
            "total-fat-progress",

        "fiber-progress":
            "total-fiber-progress"

    };


    const percentageElement =
        document.getElementById(
            percentageIdMap[id]
        );


    if (percentageElement) {

        percentageElement.textContent =
            `${Math.round(percentage)}%`;

    }
}


/*
 * NUTRITION DISPLAY
 */

function updateNutritionDisplay() {

    const nutrition =
        getNutrition();

    const targets =
        getNutritionTargets();


    const values = [

        {
            total: "total-calories",
            progress: "calorie-progress",
            current: nutrition.calories,
            target: targets.calories
        },

        {
            total: "total-protein",
            progress: "protein-progress",
            current: nutrition.protein,
            target: targets.protein
        },

        {
            total: "total-carbs",
            progress: "carbs-progress",
            current: nutrition.carbs,
            target: targets.carbs
        },

        {
            total: "total-fat",
            progress: "fat-progress",
            current: nutrition.fat,
            target: targets.fat
        },

        {
            total: "total-fiber",
            progress: "fiber-progress",
            current: nutrition.fiber,
            target: targets.fiber
        }

    ];


    values.forEach(
        function (item) {

            const total =
                document.getElementById(
                    item.total
                );


            const target =
                Number(item.target) || 0;


            if (total) {

                total.textContent =
                    `${Math.round(item.current)} / ${Math.round(target)}`;

            }


            updateNutritionProgressBar(
                item.progress,
                item.current,
                target
            );

        }
    );


    updateNutritionRemaining(
        nutrition,
        targets
    );


    updateWaterDisplay(
        nutrition
    );
}


/*
 * REMAINING DISPLAY
 */

function updateNutritionRemaining(
    nutrition,
    targets
) {

    const remaining = [

        {
            id: "remaining-calories",
            value: getRemaining(
                targets.calories,
                nutrition.calories
            ),
            unit: "kcal"
        },

        {
            id: "remaining-protein",
            value: getRemaining(
                targets.protein,
                nutrition.protein
            ),
            unit: "g"
        },

        {
            id: "remaining-carbs",
            value: getRemaining(
                targets.carbs,
                nutrition.carbs
            ),
            unit: "g"
        },

        {
            id: "remaining-fat",
            value: getRemaining(
                targets.fat,
                nutrition.fat
            ),
            unit: "g"
        },

        {
            id: "remaining-fiber",
            value: getRemaining(
                targets.fiber,
                nutrition.fiber
            ),
            unit: "g"
        }

    ];


    remaining.forEach(
        function (item) {

            const element =
                document.getElementById(
                    item.id
                );


            if (element) {

                element.textContent =
                    `${Math.round(item.value)} ${item.unit}`;

            }

        }
    );
}


/*
 * FOOD LIST
 */

function updateFoodList() {

    const nutrition =
        getNutrition();


    const foodList =
        document.getElementById(
            "food-list"
        );


    if (!foodList) {

        return;

    }


    foodList.innerHTML = "";


    if (nutrition.foods.length === 0) {

        foodList.innerHTML =
            "<p>No food logged yet.</p>";

        return;

    }


    nutrition.foods.forEach(
        function (food, index) {

            const entry =
                document.createElement("div");


            entry.className =
                "nutrition-food-entry";


            entry.innerHTML = `

                <div class="nutrition-food-info">

                    <h3>
                        ${food.name}
                    </h3>

                    <p>
                        ${food.amount} g
                    </p>

                    <p>
                        ${Math.round(food.calories)} kcal ·
                        ${Math.round(food.protein)}g protein ·
                        ${Math.round(food.carbs)}g carbs ·
                        ${Math.round(food.fat)}g fat
                    </p>

                </div>

                <button
                    type="button"
                    class="primary-btn remove-food"
                    data-index="${index}"
                >
                    Remove
                </button>

            `;


            foodList.appendChild(entry);


            const removeButton =
                entry.querySelector(
                    ".remove-food"
                );


            removeButton.addEventListener(
                "click",
                function () {

                    removeFood(index);

                }
            );

        }
    );
}


/*
 * REMOVE FOOD
 */

function removeFood(index) {

    const nutrition =
        getNutrition();


    const removedFood =
        nutrition.foods[index];


    if (!removedFood) {

        return;

    }


    nutrition.calories -=
        Number(removedFood.calories) || 0;

    nutrition.protein -=
        Number(removedFood.protein) || 0;

    nutrition.carbs -=
        Number(removedFood.carbs) || 0;

    nutrition.fat -=
        Number(removedFood.fat) || 0;

    nutrition.fiber -=
        Number(removedFood.fiber) || 0;


    nutrition.calories =
        Math.max(
            nutrition.calories,
            0
        );

    nutrition.protein =
        Math.max(
            nutrition.protein,
            0
        );

    nutrition.carbs =
        Math.max(
            nutrition.carbs,
            0
        );

    nutrition.fat =
        Math.max(
            nutrition.fat,
            0
        );

    nutrition.fiber =
        Math.max(
            nutrition.fiber,
            0
        );


    nutrition.foods.splice(
        index,
        1
    );


    saveNutrition(
        nutrition
    );


    updateNutritionDisplay();

    updateFoodList();

}


/*
 * ADD FOOD
 */

const addFoodButton =
    document.getElementById(
        "add-food"
    );


if (addFoodButton) {

    addFoodButton.addEventListener(
        "click",
        function () {

            const foodName =
                document.getElementById(
                    "food-name"
                ).value;


            const foodAmount =
                Number(
                    document.getElementById(
                        "food-amount"
                    ).value
                );


            if (!foodName.trim()) {

                alert(
                    "Enter a food name"
                );

                return;

            }


            if (
                !Number.isFinite(foodAmount) ||
                foodAmount <= 0
            ) {

                alert(
                    "Enter a valid amount"
                );

                return;

            }


            const foodData =
                findFood(foodName);


            if (!foodData) {

                alert(
                    "Food not found"
                );

                return;

            }


            const multiplier =
                foodAmount / 100;


            const food = {

                name:
                    foodData.name,

                amount:
                    foodAmount,

                calories:
                    foodData.calories *
                    multiplier,

                protein:
                    foodData.protein *
                    multiplier,

                carbs:
                    foodData.carbs *
                    multiplier,

                fat:
                    foodData.fat *
                    multiplier,

                fiber:
                    foodData.fiber *
                    multiplier

            };


            const nutrition =
                getNutrition();


            nutrition.calories +=
                food.calories;

            nutrition.protein +=
                food.protein;

            nutrition.carbs +=
                food.carbs;

            nutrition.fat +=
                food.fat;

            nutrition.fiber +=
                food.fiber;


            nutrition.foods.push(
                food
            );


            saveNutrition(
                nutrition
            );


            document.getElementById(
                "food-name"
            ).value = "";


            document.getElementById(
                "food-amount"
            ).value = "";


            updateNutritionDisplay();

            updateFoodList();

        }
    );

}


/*
 * WATER
 */

function updateWaterDisplay(
    nutrition
) {

    if (!nutrition) {

        nutrition =
            getNutrition();

    }


    const water =
        Number(nutrition.water) || 0;


    const waterEl =
        document.getElementById(
            "planner-water"
        );


    if (waterEl) {

        waterEl.textContent =
            water.toFixed(2);

    }


    const waterProgressEl =
        document.getElementById(
            "water-progress"
        );


    if (waterProgressEl) {

        const percentage =
            Math.min(
                (water / 4) * 100,
                100
            );


        waterProgressEl.style.width =
            percentage + "%";

    }

}


/*
 * ADD WATER
 */

const addWaterButton =
    document.getElementById(
        "add-water"
    );


if (addWaterButton) {

    addWaterButton.addEventListener(
        "click",
        function () {

            const nutrition =
                getNutrition();


            nutrition.water +=
                0.25;


            saveNutrition(
                nutrition
            );


            updateWaterDisplay(
                nutrition
            );

        }
    );

}


/*
 * RESET WATER
 */

const resetWaterButton =
    document.getElementById(
        "reset-water"
    );


if (resetWaterButton) {

    resetWaterButton.addEventListener(
        "click",
        function () {

            const nutrition =
                getNutrition();


            nutrition.water = 0;


            saveNutrition(
                nutrition
            );


            updateWaterDisplay(
                nutrition
            );

        }
    );

}


/*
 * INITIALIZE
 */

updateNutritionDisplay();

updateFoodList();

updateWaterDisplay();