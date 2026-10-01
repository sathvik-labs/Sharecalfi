let selectedDate = new Date();

const collapsedWorkouts = {};


/*
 * DATE
 */

function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function updateSelectedDay() {
    const today = new Date();

    const selectedKey = getDateKey(selectedDate);
    const todayKey = getDateKey(today);

    let label;

    if (selectedKey === todayKey) {
        label = "Today";
    } else {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        if (selectedKey === getDateKey(yesterday)) {
            label = "Yesterday";
        } else if (selectedKey === getDateKey(tomorrow)) {
            label = "Tomorrow";
        } else {
            label = selectedDate.toLocaleDateString("en-US", {
                weekday: "long"
            });
        }
    }

    document.getElementById(
        "selected-day-label"
    ).textContent = label;

    document.getElementById(
        "selected-date"
    ).textContent = selectedDate.toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );
}


/*
 * STORAGE
 */

function savePlanner(planner) {
    const allPlanners =
        JSON.parse(
            localStorage.getItem(PLANNER_KEY)
        ) || {};

    allPlanners[planner.date] = planner;

    localStorage.setItem(
        PLANNER_KEY,
        JSON.stringify(allPlanners)
    );
}


function getPlanner() {
    const allPlanners =
        JSON.parse(
            localStorage.getItem(PLANNER_KEY)
        ) || {};

    const dateKey = getDateKey(selectedDate);

    return allPlanners[dateKey] || {
        date: dateKey,
        steps: 0,
        weight: null,
        workouts: [],
        tasks: []
    };
}

/*
 * STEPS
 */

function saveSteps() {
    const planner = getPlanner();

    const steps = Number(
        document.getElementById(
            "steps-input"
        ).value
    );

    if (
        !Number.isFinite(steps) ||
        steps < 0
    ) {
        alert("Enter a valid step count");
        return;
    }

    planner.steps += steps;

    savePlanner(planner);

    updateStepsDisplay();

    document.getElementById(
        "steps-input"
    ).value = "";
}


function updateStepsDisplay() {
    const planner = getPlanner();

    const stepsElement =
        document.getElementById(
            "planner-steps"
        );

    if (stepsElement) {
        stepsElement.textContent =
            planner.steps;
    }

    const progressElement =
        document.getElementById(
            "steps-progress"
        );

    if (progressElement) {
        progressElement.style.width =
            Math.min(
                (planner.steps / 10000) * 100,
                100
            ) + "%";
    }
}


const saveStepsButton =
    document.getElementById(
        "save-steps"
    );

if (saveStepsButton) {
    saveStepsButton.addEventListener(
        "click",
        saveSteps
    );
}


const resetStepsButton =
    document.getElementById(
        "reset-steps"
    );

if (resetStepsButton) {
    resetStepsButton.addEventListener(
        "click",
        function () {

            const planner = getPlanner();

            planner.steps = 0;

            savePlanner(planner);

            updateStepsDisplay();
        }
    );
}


/*
 * WORKOUTS
 */

function createWorkout() {
    const input =
        document.getElementById(
            "workout-name"
        );

    const workoutName =
        input.value.trim();

    if (!workoutName) {
        alert("Enter a workout name");
        return;
    }

    const planner = getPlanner();

    planner.workouts.push({
        name: workoutName,
        completed: false,
        exercises: []
    });

    savePlanner(planner);

    input.value = "";

    updateWorkoutList();
    updateDailyProgress();
}


function updateWorkoutList() {
    const planner = getPlanner();

    const workoutList =
        document.getElementById(
            "workout-list"
        );

    workoutList.innerHTML = "";

    if (planner.workouts.length === 0) {
        workoutList.innerHTML =
            "<p>No workouts planned.</p>";

        return;
    }

    planner.workouts.forEach(
        function (workout, workoutIndex) {

            const workoutSection =
                document.createElement("div");

            workoutSection.className =
                "workout-section";

            workoutSection.innerHTML = `
                <div class="workout-header">

                    <button
                        type="button"
                        class="workout-toggle"
                        data-index="${workoutIndex}"
                    >
                        <span>
                            ${workout.name}
                        </span>

                        <span class="workout-toggle-icon">
                            ${
                                collapsedWorkouts[workoutIndex]
                                    ? "›"
                                    : "⌄"
                            }
                        </span>
                    </button>

                    <button
                        type="button"
                        class="delete-workout"
                        data-index="${workoutIndex}"
                    >
                        Delete
                    </button>

                </div>

                <div
                    class="workout-content"
                    style="${
                        collapsedWorkouts[workoutIndex]
                            ? "display:none;"
                            : ""
                    }"
                >

                    <div class="exercise-list">

                        ${
                            workout.exercises.length > 0

                                ? workout.exercises
                                    .map(
                                        function (
                                            exercise,
                                            exerciseIndex
                                        ) {

                                            const sets =
                                                exercise.sets || [];

                                            return `
                                                <div class="exercise-item">

                                                    <h4>
                                                        ${exercise.name}
                                                    </h4>

                                                    ${
                                                        sets.length > 0

                                                            ? `
                                                                <div class="sets-inline">

                                                                    ${
                                                                        sets
                                                                            .map(
                                                                                function (
                                                                                    set,
                                                                                    setIndex
                                                                                ) {

                                                                                    return `
                                                                                        <span class="set-chip">

                                                                                            ${setIndex + 1})
                                                                                            ${set.reps}×${set.weight}kg

                                                                                            <button
                                                                                                type="button"
                                                                                                class="remove-set"
                                                                                                data-workout="${workoutIndex}"
                                                                                                data-exercise="${exerciseIndex}"
                                                                                                data-set="${setIndex}"
                                                                                            >
                                                                                                ✕
                                                                                            </button>

                                                                                        </span>
                                                                                    `;
                                                                                }
                                                                            )
                                                                            .join("")
                                                                    }

                                                                </div>
                                                            `

                                                            : `
                                                                <p>
                                                                    No sets yet.
                                                                </p>
                                                            `
                                                    }

                                                    <button
                                                        type="button"
                                                        class="primary-btn add-set"
                                                        data-workout="${workoutIndex}"
                                                        data-exercise="${exerciseIndex}"
                                                    >
                                                        Add Set
                                                    </button>

                                                    <button
                                                        type="button"
                                                        class="primary-btn remove-exercise"
                                                        data-workout="${workoutIndex}"
                                                        data-exercise="${exerciseIndex}"
                                                    >
                                                        Remove
                                                    </button>

                                                </div>
                                            `;
                                        }
                                    )
                                    .join("")

                                : `
                                    <p>
                                        No exercises yet.
                                    </p>
                                `
                        }

                    </div>


                    <div class="add-exercise-form">

                        <div class="field">

                            <label>
                                Exercise
                            </label>

                            <input
                                type="text"
                                class="exercise-name-input"
                                placeholder="e.g. Bench Press"
                            >

                        </div>


                        <button
                            type="button"
                            class="primary-btn add-exercise"
                            data-index="${workoutIndex}"
                        >
                            Add
                        </button>


                        <button
                            type="button"
                            class="primary-btn complete-workout"
                            data-index="${workoutIndex}"
                        >
                            ${
                                workout.completed
                                    ? "Completed"
                                    : "Complete"
                            }
                        </button>


                        <button
                            type="button"
                            class="primary-btn save-template"
                            data-index="${workoutIndex}"
                        >
                            Save
                        </button>

                    </div>

                </div>
            `;

            workoutList.appendChild(
                workoutSection
            );
        }
    );


    /*
     * COLLAPSE WORKOUT
     */

    workoutList
        .querySelectorAll(".workout-toggle")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const workoutIndex =
                        Number(
                            button.dataset.index
                        );

                    collapsedWorkouts[
                        workoutIndex
                    ] =
                        !collapsedWorkouts[
                            workoutIndex
                        ];

                    updateWorkoutList();
                }
            );
        });


    /*
     * ADD EXERCISE
     */

    workoutList
        .querySelectorAll(".add-exercise")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const workoutIndex =
                        Number(
                            button.dataset.index
                        );

                    const form =
                        button.closest(
                            ".add-exercise-form"
                        );

                    const input =
                        form.querySelector(
                            ".exercise-name-input"
                        );

                    const exerciseName =
                        input.value.trim();

                    if (!exerciseName) {
                        alert(
                            "Enter an exercise name"
                        );

                        return;
                    }

                    const planner =
                        getPlanner();

                    planner
                        .workouts[workoutIndex]
                        .exercises
                        .push({
                            name: exerciseName,
                            sets: []
                        });

                    savePlanner(planner);

                    updateWorkoutList();
                }
            );
        });


    /*
     * ADD SET
     */

    workoutList
        .querySelectorAll(".add-set")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const workoutIndex =
                        Number(
                            button.dataset.workout
                        );

                    const exerciseIndex =
                        Number(
                            button.dataset.exercise
                        );

                    const reps =
                        Number(
                            prompt("Reps")
                        );

                    if (
                        !Number.isFinite(reps) ||
                        reps <= 0
                    ) {
                        return;
                    }

                    const weight =
                        Number(
                            prompt("Weight (kg)")
                        );

                    if (
                        !Number.isFinite(weight) ||
                        weight < 0
                    ) {
                        return;
                    }

                    const planner =
                        getPlanner();

                    const exercise =
                        planner
                            .workouts[workoutIndex]
                            .exercises[exerciseIndex];

                    if (!exercise.sets) {
                        exercise.sets = [];
                    }

                    exercise.sets.push({
                        reps: reps,
                        weight: weight
                    });

                    savePlanner(planner);

                    updateWorkoutList();
                }
            );
        });


    /*
     * REMOVE SET
     */

    workoutList
        .querySelectorAll(".remove-set")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const workoutIndex =
                        Number(
                            button.dataset.workout
                        );

                    const exerciseIndex =
                        Number(
                            button.dataset.exercise
                        );

                    const setIndex =
                        Number(
                            button.dataset.set
                        );

                    const planner =
                        getPlanner();

                    planner
                        .workouts[workoutIndex]
                        .exercises[exerciseIndex]
                        .sets
                        .splice(
                            setIndex,
                            1
                        );

                    savePlanner(planner);

                    updateWorkoutList();
                }
            );
        });


    /*
     * REMOVE EXERCISE
     */

    workoutList
        .querySelectorAll(".remove-exercise")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const workoutIndex =
                        Number(
                            button.dataset.workout
                        );

                    const exerciseIndex =
                        Number(
                            button.dataset.exercise
                        );

                    if (
                        !confirm(
                            "Remove this exercise?"
                        )
                    ) {
                        return;
                    }

                    const planner =
                        getPlanner();

                    planner
                        .workouts[workoutIndex]
                        .exercises
                        .splice(
                            exerciseIndex,
                            1
                        );

                    savePlanner(planner);

                    updateWorkoutList();
                }
            );
        });


    /*
     * DELETE WORKOUT
     */

    workoutList
        .querySelectorAll(".delete-workout")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const workoutIndex =
                        Number(
                            button.dataset.index
                        );

                    if (
                        !confirm(
                            "Delete this entire workout?"
                        )
                    ) {
                        return;
                    }

                    const planner =
                        getPlanner();

                    planner.workouts.splice(
                        workoutIndex,
                        1
                    );

                    savePlanner(planner);

                    updateWorkoutList();
                    updateDailyProgress();
                }
            );
        });


    /*
     * COMPLETE WORKOUT
     */

    workoutList
        .querySelectorAll(".complete-workout")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const workoutIndex =
                        Number(
                            button.dataset.index
                        );

                    const planner =
                        getPlanner();

                    planner
                        .workouts[workoutIndex]
                        .completed = true;

                    savePlanner(planner);

                    updateWorkoutList();
                    updateDailyProgress();
                }
            );
        });


    /*
     * SAVE WORKOUT AS TEMPLATE
     */

    workoutList
        .querySelectorAll(".save-template")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const workoutIndex =
                        Number(
                            button.dataset.index
                        );

                    const planner =
                        getPlanner();

                    const workout =
                        planner.workouts[
                            workoutIndex
                        ];

                    if (!workout) {
                        return;
                    }

                    createWorkoutTemplate(
                        workout.name,
                        workout.exercises
                    );

                    renderWorkoutTemplates();

                    alert(
                        "Workout saved as template"
                    );
                }
            );
        });
}


const createWorkoutButton =
    document.getElementById(
        "create-workout"
    );

if (createWorkoutButton) {
    createWorkoutButton.addEventListener(
        "click",
        createWorkout
    );
}


/*
 * TASKS
 */

function addTask() {
    const taskInput =
        document.getElementById(
            "task-name"
        );

    const taskName =
        taskInput.value.trim();

    if (!taskName) {
        alert("Enter a task");
        return;
    }

    const planner = getPlanner();

    planner.tasks.push({
        name: taskName,
        completed: false
    });

    savePlanner(planner);

    taskInput.value = "";

    updateTaskList();
    updateDailyProgress();
}


function updateTaskList() {
    const planner = getPlanner();

    const taskList =
        document.getElementById(
            "task-list"
        );

    taskList.innerHTML = "";

    if (planner.tasks.length === 0) {
        taskList.innerHTML =
            "<p>No tasks planned.</p>";

        return;
    }

    planner.tasks.forEach(
        function (task, index) {

            const taskItem =
                document.createElement("div");

            taskItem.innerHTML = `
                <p>
                    ${task.name}
                </p>

                <button
                    type="button"
                    class="primary-btn complete-task"
                    data-index="${index}"
                >
                    ${
                        task.completed
                            ? "Completed"
                            : "Complete"
                    }
                </button>
            `;

            taskList.appendChild(
                taskItem
            );

            taskItem
                .querySelector(
                    ".complete-task"
                )
                .addEventListener(
                    "click",
                    function () {

                        const planner =
                            getPlanner();

                        planner
                            .tasks[index]
                            .completed = true;

                        savePlanner(planner);

                        updateTaskList();
                        updateDailyProgress();
                    }
                );
        }
    );
}


const addTaskButton =
    document.getElementById(
        "add-task"
    );

if (addTaskButton) {
    addTaskButton.addEventListener(
        "click",
        addTask
    );
}


/*
 * DAILY PROGRESS
 */

function updateDailyProgress() {
    const planner = getPlanner();

    const completedWorkouts =
        planner.workouts.filter(
            function (workout) {
                return workout.completed;
            }
        ).length;

    const completedTasks =
        planner.tasks.filter(
            function (task) {
                return task.completed;
            }
        ).length;

    document.getElementById(
        "completed-workouts"
    ).textContent =
        completedWorkouts;

    document.getElementById(
        "completed-tasks"
    ).textContent =
        completedTasks;
}


/*
 * DAY NAVIGATION
 */

const previousDayButton =
    document.getElementById(
        "previous-day"
    );

if (previousDayButton) {

    previousDayButton.addEventListener(
        "click",
        function () {

            selectedDate.setDate(
                selectedDate.getDate() - 1
            );

            Object.keys(
                collapsedWorkouts
            ).forEach(function (key) {
                delete collapsedWorkouts[key];
            });

            updateSelectedDay();
            updateStepsDisplay();
            updateWorkoutList();
            updateTaskList();
            updateDailyProgress();
        }
    );
}


const nextDayButton =
    document.getElementById(
        "next-day"
    );

if (nextDayButton) {

    nextDayButton.addEventListener(
        "click",
        function () {

            selectedDate.setDate(
                selectedDate.getDate() + 1
            );

            Object.keys(
                collapsedWorkouts
            ).forEach(function (key) {
                delete collapsedWorkouts[key];
            });

            updateSelectedDay();
            updateStepsDisplay();
            updateWorkoutList();
            updateTaskList();
            updateDailyProgress();
        }
    );
}


/*
 * INITIAL RENDER
 */

updateStepsDisplay();
updateWorkoutList();
updateTaskList();
updateDailyProgress();
updateSelectedDay();