import "../styles/compendiumPage.scss";

import {
    getAllAvailablePersonasArray,
    sortPersonasArray,
} from "./handleCompendiumData.js";
import { dlcNames } from "../data/dlcList.js";
import { searchForItem, clearSearchBar } from "./handleSearch.js";

let sortingMode = localStorage.getItem("sortingMode") || "arcana";
let checkedDLC = JSON.parse(localStorage.getItem("checkedDLC")) || [];
let allAvailablePersonas = getAllAvailablePersonasArray(checkedDLC);

initPage();

function initPage() {
    const sortedPersonas = sortPersonasArray(allAvailablePersonas, sortingMode);

    renderDlcChecklistHtml();
    renderPersonaTable(sortedPersonas);
}

function renderDlcChecklistHtml() {
    const dlcForm = document.getElementById("dlc-form");

    let html = "";
    dlcNames.forEach((name) => {
        html += `
        <div class="aside__checkbox">
            <input type="checkbox" class="dlc-checkbox" 
            id="${name[0]}" name="dlc" value="${name[0]}" ${isDlcChecked(name[0])}>
            <label for="${name[0]}">${name[0]} and ${name[1]}</label>
        </div>
        `;
    });
    dlcForm.innerHTML = html;
}

function isDlcChecked(dlc) {
    return checkedDLC.flat().includes(dlc) ? "checked" : "";
}

function renderPersonaTable(personasToDisplay = []) {
    const compendiumTable = document.getElementById("compendium");

    if (personasToDisplay.length === 0) {
        compendiumTable.innerHTML = `<p>No results.</p>`;
        return;
    }

    let html = "";
    for (let persona of personasToDisplay) {
        if (!persona) continue;

        const { arcana, lvl, name, type } = persona;

        html += `
        <a href="/personaPage.html?name=${name}" target="_blank" class="table__cell table__cell--${type}">
            <span class="table__arcana arcana--small type--${type}">${arcana}</span>
            <span class="table__level numbers--regular">${lvl}</span>
            <span class="table__circle type--${type}"></span>
            <span class="table__name">${name}</span>
            <span class="badge--small badge--${type}">${type.toUpperCase()}</span>
        </a>`;
    }

    compendiumTable.innerHTML = html;
}

function updatePersonaTable(
    arrayToDisplay = allAvailablePersonas,
    sortingMode = "arcana",
) {
    const sortedArray = sortPersonasArray(arrayToDisplay, sortingMode);
    renderPersonaTable(sortedArray);
    console.trace("updated table");
}

const sortingOptions = document.querySelectorAll('[name="sorting"]');

sortingOptions.forEach((option) => {
    option.addEventListener("change", (e) => {
        localStorage.setItem("sortingMode", e.target.value);

        updatePersonaTable(allAvailablePersonas, e.target.value);
    });
});

const dlcCheckboxes = document.querySelectorAll('input[name = "dlc"]');

dlcCheckboxes.forEach((option) =>
    option.addEventListener("change", () => {
        const updatedDlcArray = [...dlcCheckboxes]
            .filter((el) => el.checked)
            .map((el) => [el.id, el.id + " Picaro"]);

        const updatedAvailablePersonasArray =
            getAllAvailablePersonasArray(updatedDlcArray);
        updatePersonaTable(updatedAvailablePersonasArray);

        localStorage.setItem("checkedDLC", JSON.stringify(updatedDlcArray));
    }),
);

document.querySelector(".js-search-button").addEventListener("click", (e) => {
    clearSearchBar(e.target, e.target.dataset.parent);
    updatePersonaTable();
});

document.querySelector(".js-search-bar").addEventListener("keyup", (e) => {
    const searchResult = searchForItem(
        allAvailablePersonas,
        e.target.value,
        e.target.id,
    );
    updatePersonaTable(searchResult, sortingMode);
});

document.querySelector("#show-dlc-settings").addEventListener("click", () => {
    document.querySelector(".backdrop").classList.add("open");
    document.querySelector(".aside").classList.add("slide-in");
});

document.querySelector("#close-dlc-settings").addEventListener("click", () => {
    document.querySelector(".backdrop").classList.remove("open");
    document.querySelector(".aside").classList.remove("slide-in");
});
