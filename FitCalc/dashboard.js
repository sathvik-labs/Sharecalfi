const DASHBOARD_TODAY_KEY = "fitcalc_dashboard_today";


/*
 * DATE
 */

function getDashboardDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(date.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(date.getDate())
            .padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/*
 * STORAGE
 */

function getDashboardNutrition() {

    try {

        const allNutrition =
            JSON.parse(
                localStorage.getItem(NUTRITION_KEY)
            ) || {};

        return (
            allNutrition[
                getDashboardDateKey(new Date())
            ] || {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0,
                fiber: 0,
                water: 0,
                foods: []
            }
        );

    } catch (error) {

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
}


function getDashboardTargets() {

    try {

        return JSON.parse(
            localStorage.getItem(TARGETS_KEY)
        ) || {};

    } catch (error) {

        return {};

    }
}


function getDashboardPlanner() {

    try {

        const allPlanners =
            JSON.parse(
                localStorage.getItem(PLANNER_KEY)
            ) || {};


        return (
            allPlanners[
                getDashboardDateKey(new Date())
            ] || {
                steps: 0,
                weight: null,
                workouts: [],
                tasks: []
            }
        );

    } catch (error) {

        return {
            steps: 0,
            weight: null,
            workouts: [],
            tasks: []
        };

    }
}


/*
 * NUMBER HELPERS
 */

function dashboardNumber(value) {

    return Number(value) || 0;

}


function dashboardPercentage(
    current,
    target
) {

    const currentValue =
        dashboardNumber(current);

    const targetValue =
        dashboardNumber(target);


    if (targetValue <= 0) {

        return 0;

    }


    return Math.min(
        (currentValue / targetValue) * 100,
        100
    );
}


/*
 * DAILY PROGRESS
 */

function getDashboardDailyProgress() {

    const nutrition =
        getDashboardNutrition();

    const targets =
        getDashboardTargets();

    const planner =
        getDashboardPlanner();


    const calorieProgress =
        dashboardPercentage(
            nutrition.calories,
            targets.calories
        );


    const proteinProgress =
        dashboardPercentage(
            nutrition.protein,
            targets.protein
        );


    const waterProgress =
        dashboardPercentage(
            nutrition.water,
            4
        );


    const stepsProgress =
        dashboardPercentage(
            planner.steps,
            10000
        );


    return Math.round(
        (
            calorieProgress +
            proteinProgress +
            waterProgress +
            stepsProgress
        ) / 4
    );
}


/*
 * UPDATE TEXT
 */

function updateDashboardText() {

    const nutrition =
        getDashboardNutrition();

    const targets =
        getDashboardTargets();

    const planner =
        getDashboardPlanner();


    const calories =
        document.getElementById(
            "terminal-calories"
        );


    const protein =
        document.getElementById(
            "terminal-protein"
        );


    const carbs =
        document.getElementById(
            "terminal-carbs"
        );


    const fat =
        document.getElementById(
            "terminal-fat"
        );


    if (calories) {

        calories.textContent =
            `${Math.round(
                dashboardNumber(
                    nutrition.calories
                )
            )} / ${Math.round(
                dashboardNumber(
                    targets.calories
                )
            )}`;

    }


    if (protein) {

        protein.textContent =
            `${Math.round(
                dashboardNumber(
                    nutrition.protein
                )
            )} / ${Math.round(
                dashboardNumber(
                    targets.protein
                )
            )} g`;

    }


    if (carbs) {

        carbs.textContent =
            `${Math.round(
                dashboardNumber(
                    nutrition.carbs
                )
            )} / ${Math.round(
                dashboardNumber(
                    targets.carbs
                )
            )} g`;

    }


    if (fat) {

        fat.textContent =
            `${Math.round(
                dashboardNumber(
                    nutrition.fat
                )
            )} / ${Math.round(
                dashboardNumber(
                    targets.fat
                )
            )} g`;

    }


    const steps =
        document.getElementById(
            "terminal-steps"
        );


    if (steps) {

        steps.textContent =
            `${Math.round(
                dashboardNumber(
                    planner.steps
                )
            )} / 10000`;

    }


    const water =
        document.getElementById(
            "terminal-water"
        );


    if (water) {

        water.textContent =
            `${dashboardNumber(
                nutrition.water
            ).toFixed(2)} / 4.00 L`;

    }

}


/*
 * DAILY PROGRESS BAR
 */

function updateDashboardProgress() {

    const progress =
        getDashboardDailyProgress();


    const progressBar =
        document.getElementById(
            "terminal-daily-progress"
        );


    const progressValue =
        document.getElementById(
            "terminal-daily-progress-value"
        );


    if (progressBar) {

        progressBar.style.width =
            `${progress}%`;

    }


    if (progressValue) {

        progressValue.textContent =
            `${progress}%`;

    }

}


/*
 * PRIORITY
 */

function updateDashboardPriority() {

    const nutrition =
        getDashboardNutrition();

    const targets =
        getDashboardTargets();

    const planner =
        getDashboardPlanner();


    const priority =
        document.getElementById(
            "terminal-priority"
        );


    if (!priority) {

        return;

    }


    const remainingProtein =
        Math.max(
            dashboardNumber(
                targets.protein
            ) -
            dashboardNumber(
                nutrition.protein
            ),
            0
        );


    const remainingCalories =
        Math.max(
            dashboardNumber(
                targets.calories
            ) -
            dashboardNumber(
                nutrition.calories
            ),
            0
        );


    const remainingWater =
        Math.max(
            4 -
            dashboardNumber(
                nutrition.water
            ),
            0
        );


    const remainingSteps =
        Math.max(
            10000 -
            dashboardNumber(
                planner.steps
            ),
            0
        );


    priority.innerHTML = `

        <p>
            root@fitcalc:~ ./adaptive
        </p>

        <p>
            → Prioritize protein.
            About ${Math.round(
                remainingProtein
            )}g remains.
        </p>

        <p>
            → You have about ${Math.round(
                remainingCalories
            )} kcal remaining.
        </p>

        <p>
            → Drink about ${remainingWater.toFixed(
                1
            )}L more water.
        </p>

        <p>
            → You have about ${Math.round(
                remainingSteps
            )} steps remaining.
        </p>

    `;

}


/*
 * INITIALIZE
 */

function updateDashboard() {

    updateDashboardText();

    updateDashboardProgress();

    updateDashboardPriority();

}


updateDashboard();


/*
 * REFRESH WHEN RETURNING TO PAGE
 */

window.addEventListener(
    "focus",
    function () {

        updateDashboard();

    }
);


window.addEventListener(
    "storage",
    function () {

        updateDashboard();

    }
);