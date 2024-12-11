import { sortBy } from "lodash";
import { groupBy } from "lodash";

import { compendiumData } from "../data/compendiumData.js";
import { gameArcanaOrder } from "../data/arcanaOrder.js";

const keyInfoFullCompendium = Object.keys(compendiumData).map((personaName) => {
    const details = compendiumData[personaName];
    return {
        name: personaName,
        arcana: details.arcana,
        lvl: details.lvl,
        type: assignType(details),
    };
});

function assignType(details) {
    if (details.special) return "special";
    if (details.dlc) return "dlc";
    if (details.treasure) return "gem";
    return "";
}

export function getPersonaDetails(name) {
    const details = compendiumData[name];
    details.type = assignType(details);

    return details;
}

export function getPersonaKeyInfo(name) {
    return keyInfoFullCompendium.find((persona) => persona.name === name);
}

export function getAllAvailablePersonasArray(checkedDLC) {
    if (checkedDLC.length === 0)
        return keyInfoFullCompendium.filter(
            (persona) => persona.type !== "dlc",
        );

    return keyInfoFullCompendium.filter((persona) => {
        if (persona.type !== "dlc") return persona;
        return checkedDLC.flat().includes(persona.name);
    });
}

export function sortPersonasArray(personasArray, sortingMode = "arcana") {
    const sortedByLevel = sortBy(personasArray, "lvl");

    if (sortingMode === "lvl") return sortedByLevel;

    const groupedByArcana = groupBy(sortedByLevel, "arcana");

    if (sortingMode === "arcana")
        return gameArcanaOrder
            .flatMap((arcana) => groupedByArcana[arcana])
            .filter((persona) => persona);

    if (sortingMode === "groupedByArcana") return groupedByArcana;
}
