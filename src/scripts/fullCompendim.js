import { compendiumData } from "../data/compendiumData.js";

export const fullCompendium = Object.keys(compendiumData).map((persona) =>
    Object.defineProperty(compendiumData[persona], "name", { value: persona }),
);

export function hasType(p) {
    if (p.special) return ["--special", "SPECIAL"];
    if (p.treasure) return ["--gem", "GEM"];
    if (p.dlc) return ["--dlc", "DLC"];
    return ["", ""];
}

export function getPersonaDetails(name) {
    return fullCompendium.find((persona) => persona.name === name);
}

export function makePersonaList(checkedDLC) {
    const noDlcCompendium = fullCompendium.filter((persona) => !persona.dlc);
    const dlcPersonas = fullCompendium.filter((persona) => persona.dlc);

    let personaList;

    if (checkedDLC.length === 0) {
        personaList = noDlcCompendium;
    } else {
        let dlcPersonasToAdd = [];

        for (const name of checkedDLC) {
            for (const persona of dlcPersonas) {
                // eslint-disable-next-line no-useless-escape
                const regex = new RegExp(`^${name}(\sPicaro)?`);
                if (regex.test(persona["name"])) dlcPersonasToAdd.push(persona);
            }
        }
        personaList = noDlcCompendium.concat(dlcPersonasToAdd);
    }

    return personaList;
}
