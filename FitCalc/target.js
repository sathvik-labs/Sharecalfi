const profile = getProfile();

function calculateBMR(profile) {
    if (profile.sex === "male") {
        return (10 * profile.weight) +
               (6.25 * profile.height) -
               (5 * profile.age) +
               5;
    }

    if (profile.sex === "female") {
        return (10 * profile.weight) +
               (6.25 * profile.height) -
               (5 * profile.age) -
               161;
    }

    return 0;
}

function calculateTDEE(bmr, activity) {
    const multipliers = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        very_active: 1.9
    };

    return bmr * (multipliers[activity] || 1.2);
}

function calculateCalorieTarget(tdee, goal) {
    if (goal === "lose") {
        return tdee - 500;
    }

    if (goal === "gain") {
        return tdee + 300;
    }

    if (goal === "maintain") {
        return tdee;
    }

    return tdee;
}

function saveTargets(targets) {
    localStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
}

function calculateProteinTarget(profile) {
    const proteinMultipliers = {
        lose: 2.0,
        maintain: 1.6,
        gain: 1.8
    };

    const multiplier = proteinMultipliers[profile.goal] || 1.6;

    return profile.weight * multiplier;
}

function calculateMacroTargets(calories, protein) {
    const proteinCalories = protein * 4;
    const remainingCalories = calories - proteinCalories;

    const fatCalories = calories * 0.25;
    const carbCalories = remainingCalories - fatCalories;

    return {
        protein: Math.round(protein),
        carbs: Math.round(carbCalories / 4),
        fat: Math.round(fatCalories / 9)
    };
}

function calculateFatTarget(profile) {
    return profile.weight * 0.8;
}

function calculateCarbTarget(calories, protein, fat) {
    const proteinCalories = protein * 4;
    const fatCalories = fat * 9;

    const remainingCalories =
        calories - proteinCalories - fatCalories;

    return remainingCalories / 4;
}

function calculateFiberTarget(calories) {
    return calories * 14 / 1000;
}

if (
    profile.sex &&
    profile.age &&
    profile.height &&
    profile.weight &&
    profile.activity &&
    profile.goal
) {
    const bmr = calculateBMR(profile);
    const tdee = calculateTDEE(bmr, profile.activity);
    const calorieTarget = calculateCalorieTarget(tdee, profile.goal);

    console.log("Calorie target:", calorieTarget);

    const proteinTarget = calculateProteinTarget(profile);
    const macroTargets = calculateMacroTargets(calorieTarget, proteinTarget);
    const fatTarget = calculateFatTarget(profile);
    const carbTarget = calculateCarbTarget(calorieTarget, proteinTarget, fatTarget);
    const fiberTarget = calculateFiberTarget(calorieTarget);

    saveTargets({
        calories: Math.round(calorieTarget),
        protein: Math.round(proteinTarget),
        carbs: Math.round(carbTarget),
        fat: Math.round(fatTarget),
        fiber: Math.round(fiberTarget),
        bmr: Math.round(bmr),
        tdee: Math.round(tdee)
    });
}