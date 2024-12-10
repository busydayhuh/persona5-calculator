export function searchForItem(personaList, query, barId) {
    activateSearchButton(query, barId);

    let searchResult = [];

    if (barId === "v0") {
        searchResult = personaList.filter(
            (persona) =>
                persona["name"]
                    .toLowerCase()
                    .includes(query.trim().toLowerCase()) ||
                persona["arcana"]
                    .toLowerCase()
                    .includes(query.trim().toLowerCase()),
        );
    } else if (barId === "v1") {
        personaList.forEach((recipe) => {
            const nameList = recipe.source.reduce(
                (acc, persona) => acc + persona.name + persona.arcana,
                "",
            );

            if (nameList.toLowerCase().includes(query.trim().toLowerCase()))
                searchResult.push(recipe);
        });
    } else {
        personaList.forEach((recipe) => {
            const { source, result } = recipe;
            if (
                source[1].name
                    .toLowerCase()
                    .includes(query.trim().toLowerCase()) ||
                source[1].arcana
                    .toLowerCase()
                    .includes(query.trim().toLowerCase()) ||
                result.arcana
                    .toLowerCase()
                    .includes(query.trim().toLowerCase()) ||
                result.name.toLowerCase().includes(query.trim().toLowerCase())
            ) {
                searchResult.push(recipe);
            }
        });
    }

    return searchResult;
}

export function clearSearchBar(searchButton, barId) {
    document.querySelector(`#${barId}`).value = "";
    searchButton.classList.remove("typing");
}

function activateSearchButton(query, barId) {
    document.querySelector(`[data-parent=${barId}]`).classList.add("typing");

    if (query === "") {
        document
            .querySelector(`[data-parent=${barId}]`)
            .classList.remove("typing");
    }
}
