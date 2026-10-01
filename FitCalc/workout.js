const WORKOUT_TEMPLATES_KEY =
    "fitcalc_workout_templates";


function getWorkoutTemplates() {
    return JSON.parse(
        localStorage.getItem(
            WORKOUT_TEMPLATES_KEY
        )
    ) || [];
}


function saveWorkoutTemplates(templates) {
    localStorage.setItem(
        WORKOUT_TEMPLATES_KEY,
        JSON.stringify(templates)
    );
}


function createWorkoutTemplate(
    name,
    exercises = []
) {
    const templates =
        getWorkoutTemplates();

    const template = {
        name: name.trim(),

        exercises: exercises.map(
            function (exercise) {

                return {
                    name: exercise.name,

                    targetSets:
                        exercise.targetSets ||
                        exercise.sets ||
                        0,

                    targetReps:
                        exercise.targetReps ||
                        exercise.reps ||
                        0,

                    targetWeight:
                        exercise.targetWeight ||
                        exercise.weight ||
                        0
                };
            }
        )
    };

    const existingIndex =
        templates.findIndex(
            function (item) {
                return item.name === template.name;
            }
        );

    if (existingIndex !== -1) {
        templates[existingIndex] =
            template;
    } else {
        templates.push(template);
    }

    saveWorkoutTemplates(templates);

    return template;
}


function getWorkoutTemplate(name) {
    const templates =
        getWorkoutTemplates();

    return templates.find(
        function (template) {
            return template.name === name;
        }
    ) || null;
}


function deleteWorkoutTemplate(name) {
    const templates =
        getWorkoutTemplates();

    const updatedTemplates =
        templates.filter(
            function (template) {
                return template.name !== name;
            }
        );

    saveWorkoutTemplates(
        updatedTemplates
    );

    renderWorkoutTemplates();
}


function renderWorkoutTemplates() {
    const templateList =
        document.getElementById(
            "template-list"
        );

    if (!templateList) {
        return;
    }

    const templates =
        getWorkoutTemplates();

    templateList.innerHTML = "";

    if (templates.length === 0) {
        templateList.innerHTML =
            "<p>No workout templates saved.</p>";

        return;
    }

    templates.forEach(
        function (template, index) {

            const templateItem =
                document.createElement("div");

            templateItem.className =
                "workout-template-item";

            templateItem.innerHTML = `
                <strong>
                    ${template.name}
                </strong>

                <span>
                    ${template.exercises.length}
                    ${
                        template.exercises.length === 1
                            ? "exercise"
                            : "exercises"
                    }
                </span>

                <button
                    type="button"
                    class="primary-btn load-template"
                    data-index="${index}">
                    Load
                </button>

                <button
                    type="button"
                    class="primary-btn delete-template"
                    data-index="${index}">
                    Delete
                </button>
            `;

            templateList.appendChild(
                templateItem
            );
        }
    );


    /*
     * Load Template
     */

    templateList
        .querySelectorAll(".load-template")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    const templates =
                        getWorkoutTemplates();

                    const template =
                        templates[index];

                    if (!template) {
                        return;
                    }

                    const planner =
                        getPlanner();

                    planner.workouts.push({

                        name:
                            template.name,

                        completed:
                            false,

                        exercises:
                            template.exercises.map(
                                function (exercise) {

                                    return {

                                        name:
                                            exercise.name,

                                        targetSets:
                                            exercise.targetSets,

                                        targetReps:
                                            exercise.targetReps,

                                        targetWeight:
                                            exercise.targetWeight,

                                        sets: []
                                    };
                                }
                            )
                    });

                    savePlanner(planner);

                    updateWorkoutList();
                    updateDailyProgress();
                }
            );
        });


    /*
     * Delete Template
     */

    templateList
        .querySelectorAll(".delete-template")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const index =
                        Number(
                            button.dataset.index
                        );

                    const templates =
                        getWorkoutTemplates();

                    const template =
                        templates[index];

                    if (!template) {
                        return;
                    }

                    if (
                        !confirm(
                            `Delete "${template.name}" template?`
                        )
                    ) {
                        return;
                    }

                    templates.splice(
                        index,
                        1
                    );

                    saveWorkoutTemplates(
                        templates
                    );

                    renderWorkoutTemplates();
                }
            );
        });
}


renderWorkoutTemplates();