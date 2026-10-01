function getAdaptivePlan() {
    const remaining = getRemainingTargets();

    const suggestions = [];

    if (remaining.protein > 20) {
        suggestions.push(
            `Prioritize protein. About ${Math.round(remaining.protein)}g remains.`
        );
    }

    if (remaining.calories > 200) {
        suggestions.push(
            `You have about ${Math.round(remaining.calories)} kcal remaining.`
        );
    }

    if (remaining.water > 0.5) {
        suggestions.push(
            `Drink about ${remaining.water.toFixed(1)}L more water.`
        );
    }

    if (remaining.steps > 1000) {
        suggestions.push(
            `You have about ${Math.round(remaining.steps)} steps remaining.`
        );
    }

    return suggestions;
}


function displayAdaptivePlan() {
    const suggestions = getAdaptivePlan();

    const container =
        document.getElementById("adaptive-suggestions");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (suggestions.length === 0) {
        container.innerHTML =
            `<p><span class="green">[ OK ]</span> Daily targets are on track.</p>`;

        return;
    }
    suggestions.forEach(function (suggestion) {
        const item = document.createElement("p");

        item.textContent = `→ ${suggestion}`;

        container.appendChild(item);
    });
}


function setupTerminalSectionToggles() {
    const toggles =
        document.querySelectorAll(".terminal-section-toggle");

    toggles.forEach(function (toggle) {
        const label =
            toggle.textContent
                .replace("[ − ] ", "")
                .replace("[ + ] ", "")
                .trim();

        toggle.addEventListener("click", function () {
            const panel =
                document.getElementById(toggle.dataset.section);

            if (!panel) {
                return;
            }

            const isOpen =
                toggle.getAttribute("aria-expanded") === "true";

            toggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            panel.hidden = isOpen;

            toggle.innerHTML =
                isOpen
                    ? `<span>[ + ] ${label}</span>`
                    : `<span>[ − ] ${label}</span>`;
        });
    });
}


function setupAdaptiveToggle() {
    const toggle =
        document.getElementById("adaptive-toggle");

    const panel =
        document.getElementById("adaptive-panel");

    if (!toggle || !panel) {
        return;
    }

    toggle.addEventListener("click", function () {
        const isOpen =
            toggle.getAttribute("aria-expanded") === "true";

        toggle.setAttribute(
            "aria-expanded",
            String(!isOpen)
        );

        panel.hidden = isOpen;

        toggle.innerHTML =
            isOpen
                ? "<span>[ + ] PRIORITY</span>"
                : "<span>[ − ] PRIORITY</span>";
    });
}


displayAdaptivePlan();
setupTerminalSectionToggles();
setupAdaptiveToggle();