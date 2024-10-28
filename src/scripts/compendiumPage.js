import { makePersonaList } from "./fullCompendim.js";
import { arcanaOrder } from "../data/arcanaOrder.js";
import { dlcNames } from "../data/dlcList.js";

import * as _ from "lodash";
import "../styles/compendiumPage.scss";

// Globals saved in local storage:

let sortBy = localStorage.getItem("sortBy") || "arcana";
let checkedDLC = JSON.parse(localStorage.getItem("checkedDLC")) || [];

// Render dynamic HTML:

(function () {
    renderDlcSettings();
    renderPersonaTable();
})();

//Dynamic HTML components:

function renderDlcSettings() {
    const dlcForm = document.getElementById("dlc-form");
    let html = "";
    dlcNames.forEach((name) => {
        html += `<div>
                <input type="checkbox" id="${name[0]}" name="dlc" value="${
                    name[0]
                }" ${isChecked(name[0])}>
                <label for="${name[0]}">${name[0]} and ${name[1]}</label>
            </div>`;
    });
    dlcForm.innerHTML = html;

    function isChecked(dlc) {
        return checkedDLC.includes(dlc) ? "checked" : "";
    }
}

function renderPersonaTable(personaList = makePersonaList(checkedDLC)) {
    if (personaList.length === 0) {
        document.getElementById("compendium").innerHTML = `<p>No results.</p>`;
        return;
    }

    let sortedPersonaList = sortPersonaList(personaList);

    let html = "";
    for (let persona of sortedPersonaList) {
        if (persona === undefined) continue;

        html += `<tr><td>${persona["arcana"]}</td><td>${
            persona["lvl"]
        }</td><td><a href="personaPage.html?name=${persona["name"]}" target="_blank">${persona["name"]}</a></td><td>${hasType(persona)}</td></tr>`;
    }

    document.getElementById("compendium").innerHTML = html;

    function hasType(p) {
        if (p.special) return "special recipe";
        if (p.max) return "max arcana";
        if (p.treasure) return "gem shadow";
        if (p.dlc) return "DLC";
        return "—";
    }
}

function sortPersonaList(personaList) {
    let sortedList;

    if (sortBy === "arcana") {
        const groupedByArcana = _.groupBy(personaList, sortBy);
        sortedList = arcanaOrder.flatMap((arcana) => groupedByArcana[arcana]);
    } else if (sortBy === "lvl") {
        sortedList = _.orderBy(personaList, [sortBy], ["asc"]);
    }

    return sortedList;
}

// Events (re-render persona list):

const sortOptions = document.getElementById("sorting");
sortOptions.addEventListener("change", (e) => {
    sortBy = e.target.value;
    localStorage.setItem("sortBy", sortBy);
    renderPersonaTable();
});

const dlcFilters = document.querySelectorAll('input[name = "dlc"]');
dlcFilters.forEach((option) =>
    option.addEventListener("click", () => {
        checkedDLC = [...dlcFilters]
            .filter((el) => el.checked)
            .map((el) => el.id);
        localStorage.setItem("checkedDLC", JSON.stringify(checkedDLC));
        makePersonaList(checkedDLC);
        renderPersonaTable();
    }),
);

document
    .querySelector(".js-search-bar")
    .addEventListener("keyup", searchForItem);

function searchForItem() {
    const query = document.querySelector(".js-search-bar").value;
    const personaList = makePersonaList(checkedDLC);

    const searchResult = personaList.filter(
        (persona) =>
            persona["name"]
                .toLowerCase()
                .includes(query.trim().toLowerCase()) ||
            persona["arcana"]
                .toLowerCase()
                .includes(query.trim().toLowerCase()),
    );

    renderPersonaTable(searchResult);
}

document
    .querySelector(".js-delete-button")
    .addEventListener("click", clearSearchBar);

function clearSearchBar() {
    document.querySelector(".js-search-bar").value = "";
    renderPersonaTable();
}
