import "../styles/personaPage.scss";
import { hasType, getPersonaDetails } from "./fullCompendim.js";
import { getSkillDetails, getCost } from "../data/skills.js";
import { getInheritedElements } from "../data/skillInheritance.js";
import { findAllPairs } from "./reverseFusion.js";
import { getCondition } from "../data/fusions/specialFusionCombos.js";
import { findAllForwardPairs } from "./forwardFusion.js";
import { getItemDetails } from "../data/items.js";
import { images } from "./handleImages.js";
import { searchForItem, clearSearchBar } from "./tableSearch.js";

document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "interactive") {
        document.querySelector(".backdrop--loader").classList.add("open");
    } else if (event.target.readyState === "complete") {
        document.querySelector(".backdrop--loader").classList.remove("open");
    }
});

const url = new URL(window.location.href);
const name = url.searchParams.get("name");

const currentPersona = getPersonaDetails(name);

const { arcana, inherits, item, lvl, resists, skills, stats } = currentPersona;

renderTitle();
renderImage();
renderSkills();
renderInheritance();
renderMementos();
renderReverseFusionList();
renderForwardFusionList();
renderItem();
renderStats();

function renderTitle() {
    document.querySelector(".title__grid").innerHTML = `
        <div class="title__arcana arcana--title">${arcana}</div>
        <div class="title__name">${name}</div>
        <div class="title__lvl">
        <span class="lvl--title">Lv</span>
        <span class="numbers--italic">${lvl}</span>
        </div>
        <div class="title__badge badge--large badge${hasType(currentPersona)[0]}">${hasType(currentPersona)[1]}</div>
        `;
}

function renderImage() {
    const image = new Image();
    image.src = images[name];

    image.addEventListener("load", () => {
        let width = image.naturalWidth;
        let height = image.naturalHeight;

        const INDEX = width / height;

        let imgClass;
        let imgSize;

        if (INDEX < 0.7) {
            imgClass = "vertical";
        } else if (INDEX >= 0.7 && INDEX <= 1.2) {
            imgClass = "square";
        } else if (INDEX > 1.2) {
            imgClass = "horizontal";
        }

        switch (imgClass) {
            case "vertical":
                if (height <= 1000) {
                    imgSize = "vertical--small";
                } else if (height > 1000 && height <= 1300) {
                    imgSize = "vertical--medium";
                } else if (height > 1300) {
                    imgSize = "vertical--big";
                }
                break;
            case "square":
                if (height <= 800) {
                    imgSize = "square--small";
                } else if (height > 800 && height < 1000) {
                    imgSize = "square--medium";
                } else if (height >= 1000) {
                    imgSize = "square--big";
                }
                break;
            case "horizontal":
                if (width < 1200) {
                    imgSize = "horizontal--small";
                } else if (width >= 1200 && width < 1800) {
                    imgSize = "horizontal--medium";
                } else if (width >= 1800) {
                    imgSize = "horizontal--big";
                }
                break;
        }

        image.classList.add("image__persona");
        image.classList.add(imgSize);

        document.querySelector(".image").appendChild(image);
    });
}

const resistances = document.querySelectorAll(".resistance__elem");

resistances.forEach((resistance) => {
    const elementName = resistance.dataset.elemName;

    if (Object.keys(resists).includes(elementName)) {
        resistance.classList.add(`affinity--${resists[elementName]}`);
    }
});

function renderSkills() {
    let skillsHtml = "";
    let sortedByLevel = Object.entries(skills).sort((a, b) => {
        return a[1] - b[1];
    });

    sortedByLevel.forEach((skill) => {
        const skillDetails = getSkillDetails(skill[0]);
        const { element, effect } = skillDetails;

        skillsHtml += `
        <div class="skills__row">
            <div class="skills__elem icon elem--${element} hovertext" data-hover="${element}"></div>
            <div class="skills__name">${skill[0]}</div>
            <div class="skills__cost">
                <span class="cost">${getCost(skill[0])}</span>
            </div>
            <div class="skills__effect">${effect}</div>
            <div class="skills__lvl">${skill[1] > 0 ? skill[1] + " lvl" : "Innate"}</div>
        </div>
        `;
    });

    document.querySelector(".js-skills").innerHTML = skillsHtml;
}

function renderInheritance() {
    const inheritedElements = getInheritedElements(inherits);

    document.querySelector(".js-inheritance-type").innerText = `${inherits}`;

    let inheritanceHtml = "";

    inheritedElements.forEach((element) => {
        inheritanceHtml += `<div class="inheritance__elem icon elem--${element}"></div>`;
    });

    document.querySelector(".js-inheritance-grid").innerHTML = inheritanceHtml;
}

function renderMementos() {
    if (
        currentPersona.area ||
        currentPersona.floor ||
        currentPersona.personality
    ) {
        document.querySelector(".mementos").innerHTML = `
                <p class="mementos__place">Location: ${currentPersona.area || "No info"}</p>
                <p> Floors: ${currentPersona.floor || "No info"}</p>
                <p class="mementos__personality">Personality: ${currentPersona.personality || "Unknown"}</p>`;
    }
}

function renderItem() {
    if (!item) {
        document.querySelector(".js-item-grid").innerHTML = `<p>No item.</p>`;
        return;
    }

    let itemDetails;
    let type, user, description, cost;

    if (currentPersona.skillCard) {
        itemDetails = getSkillDetails(item);
        type = "skillcard";
        user = "unisex";
        description = itemDetails.effect;
        cost = getCost(item);
    } else {
        itemDetails = getItemDetails(item);
        type = itemDetails.type;
        user = itemDetails.user;
        description = itemDetails.description;
        cost = null;
    }

    document.querySelector(".js-item").innerText = `${item}`;

    document.querySelector(".js-item-grid").innerHTML =
        `<div class="item__type--head">Type</div>
        <div class="item__name--head">Name</div>
        <div class="item__user--head">User</div>
        <div class="item__description--head">Description</div>
        <div class="item__type icon item--${type}-${user || " unisex"}"></div>
        <div class="item__name">${item}</div>
        <div class="item__user icon user--${user || " unisex"}"></div>
        <div class="item__description">${description || ""} <span class="cost">${cost ? "Cost: " + cost : ""}</span>
        </div>`;
}

function renderStats() {
    let statsHtml = "";
    const statsGrid = document.querySelector(".js-stats-grid");
    const statOrder = ["st", "ma", "en", "ag", "lu"];

    for (const el of statOrder) {
        statsHtml += `
        <div class="stats__name">${el}</div>
        <div class="stats__value">${stats[el]}</div>
        <div class="stats__barcontainer">
            <div class="stats__progressbar js-stats-progressbar" data-width="${stats[el]}"></div>
        </div>
        `;
    }

    statsGrid.innerHTML = statsHtml;

    document
        .querySelectorAll(".js-stats-progressbar")
        .forEach((progressbar) => {
            const width = progressbar.dataset.width;
            progressbar.style.width = `${width}%`;
        });
}

function renderFusionNotes(fusionVersion, numOfResults) {
    const fusionTableNote = document.querySelector(
        `#fusion-note-${fusionVersion}`,
    );

    if (fusionVersion === "v1") {
        if (currentPersona.max && currentPersona.special) {
            fusionTableNote.innerHTML = `
            <p class="note__main">Fuse Personas from the recipe below to get ${name}.</p>
            <p class="note__optional"><strong>Condition: </strong>${getCondition(name)}`;
        } else if (currentPersona.max) {
            fusionTableNote.innerHTML = `
            <p class="note__main">Fuse two Personas to get ${name}. Follow recipes below (${numOfResults} results).</p>
            <p class="note__optional">This fusion requires completed ${currentPersona.arcana} Confidant.</p>
        `;
        } else if (currentPersona.special) {
            fusionTableNote.innerHTML = `
            <p class="note__main">Fuse Personas from the recipe below to get ${name}.</p>
            <p class="note__optional"><strong>Condition: </strong>${getCondition(name)}</p>
            `;
        } else if (currentPersona.treasure) {
            fusionTableNote.innerHTML = `
            <p class="note__optional">This Persona cannot be fused.</p>
            <p class="note__main">You can find it in Mementos on The Path of ${currentPersona.area}.</p>
        `;
        } else if (currentPersona.dlc) {
            fusionTableNote.innerHTML = `
            <p class="note__main">Fuse two Personas to get ${name}. Follow recipes below (${numOfResults} results).</p>
            <p class="note__optional">Works only if you have this DLC downloaded.</p>
        `;
        } else {
            fusionTableNote.innerHTML = `
            <p class="note__main">Fuse two Personas to get ${name}. Follow recipes below (${numOfResults} results).</p>
           
        `;
        }
    }

    if (fusionVersion === "v2") {
        if (currentPersona.treasure) {
            fusionTableNote.innerHTML = `
            <p class="note__main">Fuse ${name} with another Persona to get specific Result. Follow recipes below (${numOfResults} results).</p>
            <p class="note__optional">Result is dependent on the current level of your second ingredient. Results may vary.</p>
        `;
        } else {
            fusionTableNote.innerHTML = `
            <p class="note__main">Fuse ${name} with another Persona to get specific Result. Follow recipes below (${numOfResults} results).</p>
        `;
        }
    }
}

function renderReverseFusionList(fusionsArr = findAllPairs(currentPersona)) {
    const fusionTableBody = document.querySelector("#fusion-table-v1");
    const fusionTableHeader = document.querySelector("#fusion-colnames-v1");
    //const fusionsArr = findAllPairs(currentPersona);
    const numOfResults = fusionsArr.length;

    renderFusionNotes("v1", numOfResults);

    let html = "";

    if (currentPersona.special) {
        fusionsArr.forEach((el) => {
            const persona = getPersonaDetails(el);

            html += `
            <a href="/personaPage.html?name=${persona.name}" target="_blank" class="table__cell table__cell${hasType(persona)[0]}">
                <span class="table__arcana arcana--small type${hasType(persona)[0]}">${persona.arcana}</span>
                <span class="table__level numbers--regular">${persona.lvl}</span>
                <span class="table__circle type${hasType(persona)[0]}"></span>
                <span class="table__name">${persona.name}</span>
            </a>
            `;
        });

        fusionTableBody.innerHTML = html;
        fusionTableBody.classList.remove("table__content--two-col");
        fusionTableBody.classList.add("table__content--one-col");

        fusionTableHeader.innerHTML = `<div class="th">RECIPE</div>`;

        return;
    }

    if (currentPersona.treasure) {
        fusionTableBody.innerHTML = "";
        fusionTableHeader.innerHTML = ``;

        return;
    }

    fusionsArr.forEach((pair) => {
        const personaA = getPersonaDetails(pair[0]);
        const personaB = getPersonaDetails(pair[1]);

        html += `
       <a href="/personaPage.html?name=${personaA.name}" target="_blank" class="table__cell table__cell${hasType(personaA)[0]}">
            <span class="table__arcana arcana--small type${hasType(personaA)[0]}">${personaA.arcana}</span>
            <span class="table__level numbers--regular">${personaA.lvl}</span>
            <span class="table__circle type${hasType(personaA)[0]}"></span>
            <span class="table__name">${personaA.name}</span>
        </a>
            <a href="/personaPage.html?name=${personaB.name}" target="_blank" class="table__cell table__cell${hasType(personaB)[0]}">
            <span class="table__arcana arcana--small type${hasType(personaB)[0]} cell">${personaB.arcana}</span>
            <span class="table__level numbers--regular">${personaB.lvl}</span>
            <span class="table__circle type${hasType(personaB)[0]}"></span>
            <span class="table__name">${personaB.name}</span>
        </a>`;
    });

    fusionTableBody.innerHTML = html;
}

function renderForwardFusionList(
    fusionsArr = findAllForwardPairs(currentPersona),
) {
    const fusionTableBody = document.querySelector("#fusion-table-v2");
    //const fusionsArr = findAllForwardPairs(currentPersona);
    const numOfResults = fusionsArr.length;

    renderFusionNotes("v2", numOfResults);

    let html = "";

    fusionsArr.forEach((pair) => {
        const personaB = getPersonaDetails(pair[1][1]);
        const resultPersona = getPersonaDetails(pair[0]);

        html += `
        <a href="/personaPage.html?name=${personaB.name}" target="_blank" class="table__cell table__cell${hasType(personaB)[0]}">
            <span class="table__arcana arcana--small type${hasType(personaB)[0]}">${personaB.arcana}</span>
            <span class="table__level numbers--regular">${personaB.lvl}</span>
            <span class="table__circle type${hasType(personaB)[0]}"></span>
            <span class="table__name">${personaB.name}</span>
        </a>
        <a href="/personaPage.html?name=${resultPersona.name}" target="_blank" class="table__cell table__cell${hasType(resultPersona)[0]} result">
            <span class="table__arcana arcana--small type${hasType(resultPersona)[0]} cell">${resultPersona.arcana}</span>
            <span class="table__level numbers--regular">${resultPersona.lvl}</span>
            <span class="table__circle type${hasType(resultPersona)[0]}"></span>
            <span class="table__name">${resultPersona.name}</span>
        </a>`;

        fusionTableBody.innerHTML = html;
    });
}

document.querySelectorAll(".js-search-bar").forEach((bar) => {
    bar.addEventListener("keyup", (e) => {
        if (e.target.id === "v1") {
            const personaList = findAllPairs(currentPersona);
            const result = searchForItem(
                personaList,
                e.target.value,
                e.target.id,
            );

            renderReverseFusionList(result);
        } else {
            const personaList = findAllForwardPairs(currentPersona);
            const result = searchForItem(
                personaList,
                e.target.value,
                e.target.id,
            );

            renderForwardFusionList(result);
        }
    });
});

document.querySelectorAll(".js-search-button").forEach((button) => {
    button.addEventListener("click", (e) => {
        clearSearchBar(e.target, e.target.dataset.parent);

        if (e.target.dataset.parent === "v1") {
            renderReverseFusionList();
        } else {
            renderForwardFusionList();
        }
    });
});
