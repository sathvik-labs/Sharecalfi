const PROFILE_KEY = "fitcalc_profile";

function getProfile() {
    return JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
}

function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function updateProfile(data) {
    const profile = getProfile();

    Object.assign(profile, data);

    saveProfile(profile);
}
const profileForm = document.getElementById("profile-form");

if (profileForm) {
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        updateProfile({
            age: Number(document.getElementById("profile-age").value),
            sex: document.getElementById("profile-sex").value,
            height: Number(document.getElementById("profile-height").value),
            weight: Number(document.getElementById("profile-weight").value),
            activity: document.getElementById("profile-activity").value,
            goal: document.getElementById("profile-goal").value
        });

        window.location.reload();
    });
}

const savedProfile = getProfile();

if (profileForm && Object.keys(savedProfile).length > 0) {
    document.getElementById("profile-age").value = savedProfile.age || "";
    document.getElementById("profile-sex").value = savedProfile.sex || "";
    document.getElementById("profile-height").value = savedProfile.height || "";
    document.getElementById("profile-weight").value = savedProfile.weight || "";
    document.getElementById("profile-activity").value = savedProfile.activity || "";
    document.getElementById("profile-goal").value = savedProfile.goal || "";
}