import "../styles/personaPage.scss";
import { getType, getPersonaDetails } from "./fullCompendim.js";
import { getSkillDetails, getCost } from "../data/skills.js";
import { getInheritedElements } from "../data/skillInheritance.js";
import { findAllPairs } from "./reverseFusion.js";
import { findAllForwardPairs } from "./forwardFusion.js";
import { getItemDetails } from "../data/items.js";

const url = new URL(window.location.href);
const name = url.searchParams.get("name");

const currentPersona = getPersonaDetails(name);

const { arcana, inherits, item, lvl, resists, skills, stats } = currentPersona;

renderTitle();
renderSkills();
renderInheritance();
renderMementos();
renderReverseFusionList();
renderForwardFusionList();
renderItem();
renderStats();

function renderTitle() {
    document.querySelector(".title").innerHTML =
        `<div class="title__arcana">${arcana}</div><h2 class="title__name">${name}</h2><div class="title__lvl">Lv ${lvl}</div><div class="title__type" id="type">${getType(currentPersona)}</div>`;
}

const resistances = document.querySelectorAll(".resistance__elem");

resistances.forEach((resistance) => {
    const elementName = resistance.dataset.elemName;

    if (Object.keys(resists).includes(elementName)) {
        resistance.classList.add(resists[elementName]);
        //console.log(resists[elementName]);
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

        skillsHtml += `<div class="skills__elem elem--${element}">${element}</div>
                    <div class="skills__name">${skill[0]}</div>
                    <div class="skills__cost">${getCost(skill[0])}</div>
                    <div class="skills__effect">${effect}</div>
                    <div class="skills__lvl">${skill[1] > 0 ? skill[1] : "innate"}</div>`;
    });

    document.querySelector(".js-skills").innerHTML = skillsHtml;
}

function renderInheritance() {
    const inheritedElements = getInheritedElements(inherits);

    document.querySelector(".js-inheritance-type").innerText =
        `Inheritance type: ${inherits}`;
    let inheritanceHtml = "";
    inheritedElements.forEach((element) => {
        inheritanceHtml += `<div class="inheritance__elem elem--${element}">${element}</div>`;
    });
    document.querySelector(".js-inheritance-grid").innerHTML = inheritanceHtml;
}

function renderMementos() {
    if (
        currentPersona.area ||
        currentPersona.floor ||
        currentPersona.personality
    ) {
        document.querySelector(".mementos").innerHTML = `<h2>Mementos</h2>
                <p class="mementos__place">Area: ${currentPersona.area || "--"}, Floors: ${currentPersona.floor || "No info"}</p>
                <p class="mementos__personality"${currentPersona.personality || "--"}</p>`;
    }
}

function renderItem() {
    const itemDetails = getItemDetails(item);
    document.querySelector(".js-item-grid").innerHTML = ` 
                <div class="item__type item--${itemDetails.type}">${itemDetails.type}</div>
                <div class="item__name">${item}</div>
                <div class="item__user user--${itemDetails.user || "unisex"}">${itemDetails.user || "unisex"}</div>
                <div class="item__description">${itemDetails.description || ""}</div>
                <div class="item__cost">${itemDetails.skillcard ? getCost(item) : ""}</div>`;
}

function renderStats() {
    let statsHtml = "";
    const statsGrid = document.querySelector(".js-stats-grid");

    for (const stat in stats) {
        statsHtml += `<div class="stats__name">${stat}</div>
                    <div class="stats__value">${stats[stat]}</div>
                    <div class="stats__barcontainer">
                        <div class="stats__progressbar js-stats-progressbar" data-width="${stats[stat]}"></div>
                    </div>`;
    }

    statsGrid.innerHTML = statsHtml;

    document
        .querySelectorAll(".js-stats-progressbar")
        .forEach((progressbar) => {
            const width = progressbar.dataset.width;
            progressbar.style.width = `${width}%`;
        });
}

function renderReverseFusionList() {
    const fusionTableBody = document.querySelector(".js-fusion-list");
    const fusionsArr = findAllPairs(currentPersona);

    let html = "";

    if (currentPersona.special) {
        fusionsArr.forEach((el) => {
            const persona = getPersonaDetails(el);

            html += `<tr>
                    <td>${persona.arcana} ${persona.lvl} ${persona.name}</td>
                </tr>`;
        });

        fusionTableBody.innerHTML = html;

        return;
    }

    fusionsArr.forEach((pair) => {
        const personaA = getPersonaDetails(pair[0]);
        const personaB = getPersonaDetails(pair[1]);

        html += `<tr>
                    <td>${personaA.arcana} ${personaA.lvl} ${personaA.name}</td>
                    <td>${personaB.arcana} ${personaB.lvl} ${personaB.name}</td>
                </tr>`;
    });

    fusionTableBody.innerHTML = html;
}

function renderForwardFusionList() {
    const fusionTableBody = document.querySelector("#fusion-table-v2");
    const fusionsArr = findAllForwardPairs(currentPersona);

    let html = "";

    fusionsArr.forEach((pair) => {
        const personaB = getPersonaDetails(pair[1][1]);
        const resultPersona = getPersonaDetails(pair[0]);

        if (resultPersona === undefined) {
            console.log(pair[0]);
            getPersonaDetails;
        }

        html += `<tr>
        <td>${personaB.arcana} ${personaB.lvl} ${personaB.name}</td>
        <td>${resultPersona.arcana} ${resultPersona.lvl} ${resultPersona.name}</td>
    </tr>`;

        fusionTableBody.innerHTML = html;
    });
}
