import { compendiumData } from "../data/fullCompendium.js";
import { arcanaOrder } from "../data/arcanaOrder.js";
import { DLC } from "../data/dlcList.js";
import * as _ from "lodash";

const fullCompendium = Object.keys(compendiumData).map((persona) =>
    Object.defineProperty(compendiumData[persona], "name", { value: persona }),
);

const dlcFilteredOut = fullCompendium.filter((persona) => !persona.dlc);
const dlcPersonas = fullCompendium.filter((persona) => persona.dlc);

let currentSort = localStorage.getItem("currentSort") || "arcana";
let checkedDLC = JSON.parse(localStorage.getItem("checkedDLC")) || [];

renderIndexPage();

function renderIndexPage() {
    renderDlcSettings();
    renderPersonaTable(currentSort, findSortingBase(checkedDLC));
}

function renderDlcSettings() {
    const dlcForm = document.getElementById("dlc-form");
    let html = "";
    DLC.forEach((dlc) => {
        html += `<div>
                <input type="checkbox" id="${dlc[0]}" name="dlc" value="${
                    dlc[0]
                }" ${isChecked(dlc[0])}>
                <label for="${dlc[0]}">${dlc[0]} and ${dlc[1]}</label>
            </div>`;
    });
    dlcForm.innerHTML = html;
}

function isChecked(dlc) {
    return checkedDLC.includes(dlc) ? "checked" : "";
}

function findSortingBase(checkedDLC) {
    let sortingBase;

    if (checkedDLC.length === 0) {
        sortingBase = dlcFilteredOut;
    } else {
        let checked = [];
        for (const name of checkedDLC) {
            for (const persona of dlcPersonas) {
                if (persona["name"].includes(name)) checked.push(persona);
            }
        }
        sortingBase = dlcFilteredOut.concat(checked);
    }

    return sortingBase;
}

function renderPersonaTable(sorting = "arcana", sortingBase) {
    if (sortingBase.length === 0) {
        document.getElementById("compendium").innerHTML = `<p>No results.</p>`;
        return;
    }

    let sortedPersonas;

    if (sorting === "arcana") {
        const byArcana = _.groupBy(sortingBase, sorting);
        sortedPersonas = arcanaOrder.flatMap((arcana) => byArcana[arcana]);
    } else if (sorting === "lvl") {
        sortedPersonas = _.orderBy(sortingBase, ["lvl"], ["asc"]);
    }

    let html = "";
    for (let persona of sortedPersonas) {
        if (persona === undefined) continue;

        html += `<tr><td>${persona["arcana"]}</td><td>${
            persona["lvl"]
        }</td><td>${persona["name"]}</td><td>${hasType(persona)}</td></tr>`;
    }

    document.getElementById("compendium").innerHTML = html;
}

function hasType(p) {
    if (p.special) return "special recipe";
    if (p.max) return "max arcana";
    if (p.treasure) return "gem shadow";
    if (p.dlc) return "DLC";
    return "—";
}

document.getElementById("sorting").addEventListener("change", (e) => {
    currentSort = e.target.value;
    localStorage.setItem("currentSort", currentSort);
    renderPersonaTable(currentSort, findSortingBase(checkedDLC));
});

const dlcFilters = document.querySelectorAll('input[name = "dlc"]');
dlcFilters.forEach((option) =>
    option.addEventListener("change", () => {
        checkedDLC = [...dlcFilters]
            .filter((el) => el.checked)
            .map((el) => el.id);
        localStorage.setItem("checkedDLC", JSON.stringify(checkedDLC));

        renderPersonaTable(currentSort, findSortingBase(checkedDLC));
    }),
);

function searchForItem() {
    const search = document.querySelector(".js-search-bar").value;

    const list = findSortingBase(checkedDLC);

    const filteredList = list.filter(
        (elem) =>
            elem["name"].toLowerCase().includes(search.toLowerCase()) ||
            elem["arcana"].toLowerCase().includes(search.toLowerCase()),
    );

    renderPersonaTable(currentSort, filteredList);
}

document
    .querySelector(".js-search-bar")
    .addEventListener("keyup", searchForItem);
