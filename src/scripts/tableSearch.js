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
        personaList.forEach((pair) => {
            if (
                pair[0].toLowerCase().includes(query.trim().toLowerCase()) ||
                pair[1].toLowerCase().includes(query.trim().toLowerCase())
            ) {
                searchResult.push(pair);
            }
        });
    } else {
        personaList.forEach((pair) => {
            if (
                pair[0].toLowerCase().includes(query.trim().toLowerCase()) ||
                pair[1][1].toLowerCase().includes(query.trim().toLowerCase())
            ) {
                searchResult.push(pair);
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
