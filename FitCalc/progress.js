const PROGRESS_HISTORY_KEY = "fitcalc_history";


/*
 * STORAGE
 */

function getProgressHistoryStorage() {

    try {

        return JSON.parse(
            localStorage.getItem(
                PROGRESS_HISTORY_KEY
            )
        ) || {};

    } catch (error) {

        return {};

    }
}


function saveProgressHistoryStorage(history) {

    localStorage.setItem(
        PROGRESS_HISTORY_KEY,
        JSON.stringify(history)
    );
}


/*
 * DATE
 */

function getProgressDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


/*
 * NORMALIZE RECORD
 *
 * Makes old and new history records
 * use the same structure.
 */

function normalizeProgressRecord(
    dateKey,
    record
) {

    record =
        record && typeof record === "object"
            ? record
            : {};


    const recordDate =
        typeof record.date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(
            record.date
        )
            ? record.date
            : dateKey;


    let weight = null;


    if (
        record.weight !== null &&
        record.weight !== undefined &&
        Number.isFinite(
            Number(record.weight)
        )
    ) {

        weight =
            Number(record.weight);

    }


    return {

        date:
            recordDate,

        weight:
            weight,

        calories:
            Math.round(
                Number(
                    record.calories
                ) || 0
            ),

        protein:
            Math.round(
                Number(
                    record.protein
                ) || 0
            ),

        carbs:
            Math.round(
                Number(
                    record.carbs
                ) || 0
            ),

        fat:
            Math.round(
                Number(
                    record.fat
                ) || 0
            ),

        fiber:
            Math.round(
                Number(
                    record.fiber
                ) || 0
            ),

        steps:
            Math.round(
                Number(
                    record.steps
                ) || 0
            ),

        workouts:
            Math.round(
                Number(
                    record.workouts
                ) || 0
            ),

        tasks:
            Math.round(
                Number(
                    record.tasks
                ) || 0
            )

    };
}


/*
 * GET NUTRITION FOR DATE
 */

function getProgressNutrition(dateKey) {

    let nutrition = {};

    try {

        nutrition =
            JSON.parse(
                localStorage.getItem(
                    NUTRITION_KEY
                )
            ) || {};

    } catch (error) {

        nutrition = {};

    }


    return nutrition[dateKey] || {

        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0

    };
}


/*
 * GET PLANNER FOR DATE
 */

function getProgressPlanner(dateKey) {

    let planners = {};

    try {

        planners =
            JSON.parse(
                localStorage.getItem(
                    PLANNER_KEY
                )
            ) || {};

    } catch (error) {

        planners = {};

    }


    return planners[dateKey] || {

        date: dateKey,
        steps: 0,
        weight: null,
        workouts: [],
        tasks: []

    };
}


/*
 * CREATE DAILY RECORD
 */

function createProgressRecord(dateKey) {

    const nutrition =
        getProgressNutrition(
            dateKey
        );


    const planner =
        getProgressPlanner(
            dateKey
        );


    const workouts =
        Array.isArray(
            planner.workouts
        )
            ? planner.workouts
            : [];


    const tasks =
        Array.isArray(
            planner.tasks
        )
            ? planner.tasks
            : [];


    const completedWorkouts =
        workouts.filter(
            function (workout) {

                return (
                    workout &&
                    workout.completed === true
                );

            }
        ).length;


    const completedTasks =
        tasks.filter(
            function (task) {

                return (
                    task &&
                    task.completed === true
                );

            }
        ).length;


    let weight = null;


    if (
        planner.weight !== null &&
        planner.weight !== undefined &&
        Number.isFinite(
            Number(planner.weight)
        )
    ) {

        weight =
            Number(
                planner.weight
            );

    }


    return {

        date:
            dateKey,

        weight:
            weight,

        calories:
            Math.round(
                Number(
                    nutrition.calories
                ) || 0
            ),

        protein:
            Math.round(
                Number(
                    nutrition.protein
                ) || 0
            ),

        carbs:
            Math.round(
                Number(
                    nutrition.carbs
                ) || 0
            ),

        fat:
            Math.round(
                Number(
                    nutrition.fat
                ) || 0
            ),

        fiber:
            Math.round(
                Number(
                    nutrition.fiber
                ) || 0
            ),

        steps:
            Math.round(
                Number(
                    planner.steps
                ) || 0
            ),

        workouts:
            completedWorkouts,

        tasks:
            completedTasks

    };
}


/*
 * SAVE DAILY RECORD
 */

function saveProgressRecord(dateKey) {

    const history =
        getProgressHistoryStorage();


    const existing =
        history[dateKey];


    const record =
        createProgressRecord(
            dateKey
        );


    /*
     * Preserve historical weight if
     * planner currently has no weight.
     */

    if (
        record.weight === null &&
        existing &&
        existing.weight !== null &&
        existing.weight !== undefined &&
        Number.isFinite(
            Number(existing.weight)
        )
    ) {

        record.weight =
            Number(
                existing.weight
            );

    }


    history[dateKey] =
        record;


    saveProgressHistoryStorage(
        history
    );


    return record;
}


/*
 * GET ONE RECORD
 */

function getProgressRecord(dateKey) {

    const history =
        getProgressHistoryStorage();


    if (!history[dateKey]) {

        return null;

    }


    return normalizeProgressRecord(
        dateKey,
        history[dateKey]
    );
}


/*
 * GET ALL RECORDS
 */

function getProgressRecords() {

    const history =
        getProgressHistoryStorage();


    return Object.entries(history)

        .map(
            function ([dateKey, record]) {

                return normalizeProgressRecord(
                    dateKey,
                    record
                );

            }
        )

        .filter(
            function (record) {

                return (
                    /^\d{4}-\d{2}-\d{2}$/.test(
                        record.date
                    )
                );

            }
        )

        .sort(
            function (a, b) {

                return a.date.localeCompare(
                    b.date
                );

            }
        );
}


/*
 * GET LAST N RECORDS
 */

function getProgressRecordsForDays(
    days
) {

    const records =
        getProgressRecords();


    const count =
        Number(days);


    if (
        !Number.isFinite(count) ||
        count <= 0
    ) {

        return records;

    }


    return records.slice(
        Math.max(
            records.length - count,
            0
        )
    );
}


/*
 * WEIGHT HISTORY
 */

function getWeightProgress() {

    return getProgressRecords()

        .filter(
            function (record) {

                return (
                    record.weight !== null &&
                    Number.isFinite(
                        Number(record.weight)
                    )
                );

            }
        )

        .map(
            function (record) {

                return {

                    date:
                        record.date,

                    weight:
                        Number(
                            record.weight
                        )

                };

            }
        );
}


/*
 * AVERAGE
 */

function getProgressAverage(
    field,
    days
) {

    const records =
        days
            ? getProgressRecordsForDays(
                days
            )
            : getProgressRecords();


    const values =
        records

            .map(
                function (record) {

                    return Number(
                        record[field]
                    );

                }
            )

            .filter(
                function (value) {

                    return Number.isFinite(
                        value
                    );

                }
            );


    if (
        values.length === 0
    ) {

        return 0;

    }


    const total =
        values.reduce(
            function (
                sum,
                value
            ) {

                return sum + value;

            },
            0
        );


    return total / values.length;
}


/*
 * TOTAL
 */

function getProgressTotal(
    field,
    days
) {

    const records =
        days
            ? getProgressRecordsForDays(
                days
            )
            : getProgressRecords();


    return records.reduce(
        function (
            total,
            record
        ) {

            const value =
                Number(
                    record[field]
                );


            return Number.isFinite(value)
                ? total + value
                : total;

        },
        0
    );
}


/*
 * WEIGHT CHANGE
 */

function getWeightChange(days) {

    let weights =
        getWeightProgress();


    if (
        Number.isFinite(
            Number(days)
        ) &&
        Number(days) > 0
    ) {

        weights =
            weights.slice(
                Math.max(
                    weights.length -
                    Number(days),
                    0
                )
            );

    }


    if (
        weights.length < 2
    ) {

        return 0;

    }


    const first =
        weights[0].weight;


    const last =
        weights[
            weights.length - 1
        ].weight;


    return last - first;
}


/*
 * UPDATE TODAY
 */

function updateTodayProgress() {

    const today =
        getProgressDateKey(
            new Date()
        );


    return saveProgressRecord(
        today
    );
}


/*
 * CLEAN OLD HISTORY
 *
 * Normalizes legacy records once and
 * removes malformed date entries.
 */

function normalizeStoredProgress() {

    const history =
        getProgressHistoryStorage();


    const normalized = {};


    Object.entries(history)
        .forEach(
            function ([dateKey, record]) {

                if (
                    !/^\d{4}-\d{2}-\d{2}$/.test(
                        dateKey
                    )
                ) {

                    return;

                }


                normalized[dateKey] =
                    normalizeProgressRecord(
                        dateKey,
                        record
                    );

            }
        );


    saveProgressHistoryStorage(
        normalized
    );
}


/*
 * INITIALIZATION
 */

normalizeStoredProgress();

updateTodayProgress();