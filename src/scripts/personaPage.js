import "../styles/personaPage.scss";

import { getPersonaDetails } from "./handleCompendiumData.js";
import {
    getSkillDetails,
    getInheritedElements,
    getItemDetails,
} from "../scripts/hadleSkills.js";
import { images, indentifyImgShape, indentifyImgSize } from "./handleImages.js";

import {
    aggregateForwardFusionResults,
    aggregateReverseFusionResults,
} from "./handleFusions.js";

window.addEventListener("load", () => {
    document.querySelector(".loader-backdrop").classList.remove("open");
});

const name = new URL(window.location.href).searchParams.get("name");
document.querySelector("title").innerText =
    `${name} | Persona 5 Fusion Calculator`;

const {
    arcana,
    inherits,
    item,
    lvl,
    resists,
    skills,
    stats,
    type,
    max,
    area,
    floor,
    personality,
    skillCard,
} = getPersonaDetails(name);

const forwardFusionsArray = aggregateForwardFusionResults({
    name,
    arcana,
    lvl,
    type,
});

const reverseFusionsArray = aggregateReverseFusionResults({
    name,
    arcana,
    lvl,
    type,
});

initPage();

function initPage() {
    renderTitle();
    renderImage();
    renderResistances();
    renderSkills();
    renderInheritance();
    renderMementos();
    renderItem();
    renderStats();
    renderReverseFusionList();
    renderForwardFusionList();
}

function renderTitle() {
    document.querySelector(".title__grid").innerHTML = `
        <div class="title__arcana arcana--title">${arcana}</div>
        <div class="title__name">${name}</div>
        <div class="title__lvl">
        <span class="lvl--title">Lv</span>
        <span class="numbers--italic">${lvl}</span>
        </div>
        <div class="title__badge badge--large ${type ? "badge--" + type : ""}">${type}</div>
        `;
}

function renderImage() {
    const image = new Image();
    image.src = images[name];

    image.addEventListener("load", () => {
        let width = image.naturalWidth;
        let height = image.naturalHeight;

        let imgShape = indentifyImgShape(width, height);
        let imgSize = indentifyImgSize(imgShape, width, height);

        image.classList.add("image__persona");
        image.classList.add(imgSize);

        document.querySelector(".image").appendChild(image);
    });
}

function renderResistances() {
    const resistancesTable = document.querySelectorAll(".resistance__elem");

    resistancesTable.forEach((resistance) => {
        const elementName = resistance.dataset.elemName;

        if (Object.keys(resists).includes(elementName)) {
            resistance.classList.add(`affinity--${resists[elementName]}`);
        }
    });
}

function renderSkills() {
    const skillsTableHtml = document.querySelector(".js-skills");
    const skillsSortedByLevel = Object.entries(skills).sort((a, b) => {
        return a[1] - b[1];
    });

    let html = "";

    skillsSortedByLevel.forEach((skill) => {
        const [name, lvl] = skill;
        const { element, effect, cost } = getSkillDetails(name);

        html += `
        <div class="skills__row">
            <div class="skills__elem icon elem--${element} hovertext" data-elem-name="${element}"></div>
            <div class="skills__name">${name}</div>
            <div class="skills__cost">
                <span class="cost">${formatSkillCost(cost)}</span>
            </div>
            <div class="skills__effect">${effect}</div>
            <div class="skills__lvl">${lvl > 0 ? lvl + " lvl" : "Innate"}</div>
        </div>
        `;
    });

    skillsTableHtml.innerHTML = html;
}

function formatSkillCost(cost) {
    if (cost) return cost > 100 ? `${cost / 100}SP` : `${cost}%HP`;
    return "";
}

function renderInheritance() {
    const inheritedElements = getInheritedElements(inherits);

    document.querySelector(".js-inheritance-type").innerText = `${inherits}`;

    let inheritanceHtml = "";

    inheritedElements.forEach((element) => {
        inheritanceHtml += `<div class="inheritance__elem icon elem--${element} hovertext" data-elem-name="${element}"></div>`;
    });

    document.querySelector(".js-inheritance-grid").innerHTML = inheritanceHtml;
}

function renderMementos() {
    if (area || floor || personality) {
        document.querySelector(".mementos").innerHTML = `
                <p class="mementos__place">Location: ${area || "No info"}</p>
                <p> Floors: ${floor || "No info"}</p>
                <p class="mementos__personality">Personality: ${personality || "Unknown"}</p>`;
    }
}

function renderItem() {
    const itemName = document.querySelector(".js-item");
    const itemTable = document.querySelector(".js-item-grid");

    if (!item) {
        itemTable.innerHTML = `<p>No item.</p>`;
        return;
    }

    let itemDetails;
    let type, user, description, cost;

    if (skillCard) {
        itemDetails = getSkillDetails(item);
        type = "skillcard";
        user = "unisex";
        description = itemDetails.effect;
        cost = itemDetails.cost;
    } else {
        itemDetails = getItemDetails(item);
        type = itemDetails.type;
        user = itemDetails.user;
        description = itemDetails.description;
        cost = null;
    }

    itemName.innerText = `${item}`;
    itemTable.innerHTML += `
        <div class="item__type icon item--${type}-${user || "unisex"} hovertext" data-elem-name="${type}"></div>
        <div class="item__name">${item}</div>
        <div class="item__user icon user--${user || "unisex"} hovertext" data-elem-name="${user || "unisex"}"></div>
        <div class="item__description">${description || ""} <span class="cost">${cost ? "Cost: " + cost : ""}</span>
        </div>`;
}

function renderStats() {
    const statsGrid = document.querySelector(".js-stats-grid");
    const statOrder = ["st", "ma", "en", "ag", "lu"];

    let html = "";

    for (const el of statOrder) {
        html += `
        <div class="stats__name">${el}</div>
        <div class="stats__value">${stats[el]}</div>
        <div class="stats__barcontainer">
            <div class="stats__progressbar js-stats-progressbar" data-width="${stats[el]}"></div>
        </div>
        `;
    }

    statsGrid.innerHTML = html;

    document
        .querySelectorAll(".js-stats-progressbar")
        .forEach((progressbar) => {
            const width = progressbar.dataset.width;
            progressbar.style.width = `${width}%`;
        });
}

function renderReverseFusionList(fusionsArr = reverseFusionsArray) {
    const fusionTableBody = document.querySelector("#fusion-table-v1");
    const fusionTableHeader = document.querySelector("#fusion-colnames-v1");
    const numOfResults = fusionsArr.length;

    if (numOfResults === 0) {
        fusionTableBody.innerHTML = `<p>No results.</p>`;
        return;
    }

    renderFusionNotes("v1", numOfResults);

    let html = "";

    if (type === "special") {
        fusionsArr[0].source.forEach((persona) => {
            html += `
            <a href="./personaPage.html?name=${persona.name}" target="_blank" class="table__cell table__cell${persona.type ? "--" + persona.type : ""}">
                <span class="table__arcana arcana--small">${persona.arcana}</span>
                <span class="table__level numbers--regular">${persona.lvl}</span>
                <span class="table__circle"></span>
                <span class="table__name">${persona.name}</span>
            </a>
            `;
        });

        fusionTableBody.innerHTML = html;
        fusionTableBody.classList.remove("table__content--two-col");
        fusionTableBody.classList.add("table__content--one-col");

        fusionTableHeader.innerHTML = `<div class="th">Recipe</div>`;

        return;
    }

    if (type === "gem") {
        fusionTableBody.innerHTML = "";
        fusionTableHeader.innerHTML = "";

        return;
    }

    fusionsArr.forEach((recipe) => {
        const personaA = recipe.source[0];
        const personaB = recipe.source[1];

        html += `
       <a href="/personaPage.html?name=${personaA.name}" target="_blank" class="table__cell table__cell${personaA.type ? "--" + personaA.type : ""}">
            <span class="table__arcana arcana--small">${personaA.arcana}</span>
            <span class="table__level numbers--regular">${personaA.lvl}</span>
            <span class="table__circle"></span>
            <span class="table__name">${personaA.name}</span>
        </a>
            <a href="/personaPage.html?name=${personaB.name}" target="_blank" class="table__cell table__cell${personaB.type ? "--" + personaB.type : ""}">
            <span class="table__arcana arcana--small">${personaB.arcana}</span>
            <span class="table__level numbers--regular">${personaB.lvl}</span>
            <span class="table__circle"></span>
            <span class="table__name">${personaB.name}</span>
        </a>`;
    });

    fusionTableBody.innerHTML = html;
}

function renderForwardFusionList(fusionsArr = forwardFusionsArray) {
    const fusionTableBody = document.querySelector("#fusion-table-v2");
    const numOfResults = fusionsArr.length;

    if (numOfResults === 0) {
        fusionTableBody.innerHTML = `<p>No results.</p>`;
        return;
    }

    renderFusionNotes("v2", numOfResults);

    let html = "";

    fusionsArr.forEach((pair) => {
        const personaB = pair.source[1];
        const resultPersona = pair.result;

        html += `
        <a href="/personaPage.html?name=${personaB.name}" target="_blank" class="table__cell table__cell${personaB.type ? "--" + personaB.type : ""}">
            <span class="table__arcana arcana--small">${personaB.arcana}</span>
            <span class="table__level numbers--regular">${personaB.lvl}</span>
            <span class="table__circle"></span>
            <span class="table__name">${personaB.name}</span>
        </a>
        <a href="/personaPage.html?name=${resultPersona.name}" target="_blank" class="table__cell table__cel${resultPersona.type ? "--" + resultPersona.type : ""} result">
            <span class="table__arcana arcana--small">${resultPersona.arcana}</span>
            <span class="table__level numbers--regular">${resultPersona.lvl}</span>
            <span class="table__circle"></span>
            <span class="table__name">${resultPersona.name}</span>
        </a>`;

        fusionTableBody.innerHTML = html;
    });
}

function renderFusionNotes(fusionVersion, numOfResults) {
    const fusionTableNote = document.querySelector(
        `#fusion-note-${fusionVersion}`,
    );

    const specialCondition = reverseFusionsArray.condition || "";

    const fusionNotesForDiffTypes = {
        special: {
            main: `Fuse Personas from the recipe below to get ${name}.`,
            optional: `${specialCondition}`,
        },
        max: {
            main: `Fuse two Personas to get ${name}. Follow recipes below ( ${numOfResults} results )`,
            optional: `This fusion requires completed ${arcana} Confidant.`,
        },
        gem: {
            main: `This Persona cannot be fused.`,
            optional: `You can find it in Mementos on The Path of ${area}.`,
        },
        dlc: {
            main: `Fuse two Personas to get ${name}. Follow recipes below ( ${numOfResults} results )`,
            optional: `Works only if you have this DLC downloaded.`,
        },
    };

    if (fusionVersion === "v1") {
        if (!type) {
            fusionTableNote.innerHTML = `
            <p class="note__main">Fuse two Personas to get ${name}. Follow recipes below ( ${numOfResults} results )</p>`;
            return;
        }

        if (max && type !== "special") {
            fusionTableNote.innerHTML = `
            <p class="note__main">${fusionNotesForDiffTypes.max.main}</p>
            <p class="note__optional">${fusionNotesForDiffTypes.max.optional}</p>
            `;
            return;
        }

        fusionTableNote.innerHTML = `
            <p class="note__main">${fusionNotesForDiffTypes[type].main}</p>
            <p class="note__optional">${fusionNotesForDiffTypes[type].optional}</p>
            `;

        return;
    }

    if (fusionVersion === "v2") {
        if (type === "gem") {
            fusionTableNote.innerHTML = `
            <p class="note__main">Fuse ${name} with another Persona to get specific Result.<br/>Follow recipes below ( ${numOfResults} results )</p>
            <p class="note__optional">Result is dependent on the current level of your second ingredient. Results may vary.</p>
        `;
            return;
        }

        fusionTableNote.innerHTML = `
            <p class="note__main">Fuse ${name} with another Persona to get specific Result.<br/>Follow recipes below ( ${numOfResults} results )</p>`;
        return;
    }
}

document.querySelectorAll(".js-search-bar").forEach((bar) => {
    bar.addEventListener("keyup", (e) => {
        import("./handleSearch.js").then(({ searchForItem }) => {
            if (e.target.id === "v1") {
                const result = searchForItem(
                    reverseFusionsArray,
                    e.target.value,
                    e.target.id,
                );

                renderReverseFusionList(result);
            } else {
                const result = searchForItem(
                    forwardFusionsArray,
                    e.target.value,
                    e.target.id,
                );

                renderForwardFusionList(result);
            }
        });
    });
});

document.querySelectorAll(".js-search-button").forEach((button) => {
    button.addEventListener("click", (e) => {
        import("./handleSearch.js").then(({ clearSearchBar }) => {
            clearSearchBar(e.target, e.target.dataset.parent);

            if (e.target.dataset.parent === "v1") {
                renderReverseFusionList();
            } else {
                renderForwardFusionList();
            }
        });
    });
});
