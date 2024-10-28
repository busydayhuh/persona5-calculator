import { normalFusions, treasureCombos } from "../data/fusions/index.js";

import { makePersonaList } from "./fullCompendim.js";
import * as _ from "lodash";

const checkedDLC = JSON.parse(localStorage.getItem("checkedDLC")) || [];
const fullPersonaList = makePersonaList(checkedDLC);

const fusablePersonaList = fullPersonaList
    .filter((persona) => !persona.treasure)
    .map((persona) => {
        return {
            name: persona.name,
            lvl: persona.lvl,
            arcana: persona.arcana,
            special: persona.special,
        };
    });

const fusablePersonaListSorted = _.chain(fusablePersonaList)
    .sortBy("lvl")
    .groupBy("arcana")
    .value();

export function findForwardFusions(currentPersona) {
    const { lvl: currentLvl, arcana: currentArcana } = currentPersona;

    const fusionPairs = normalFusions.filter(
        (pair) => pair.source[0] === currentArcana,
    );

    let fusions = [];

    fusionPairs.forEach((pair) => {
        const personaA = currentPersona;
        const arcanaBPersonas = fusablePersonaListSorted[pair.source[1]];
        const resultArcana = pair.result;

        for (const personaB of arcanaBPersonas) {
            if (personaB.name === personaA.name) continue;

            const INDEX = Number.isInteger(
                (personaA.lvl + personaB.lvl) / 2 + 1,
            )
                ? 1
                : 0.5;
            const calcLvl = (currentLvl + personaB.lvl) / 2 + INDEX;

            const resultArcanaFusables = fusablePersonaListSorted[
                resultArcana
            ].filter(
                (p) =>
                    p.special === undefined &&
                    p.name !== personaA.name &&
                    p.name !== personaB.name,
            );

            const resultArcanaLevels = resultArcanaFusables.map((p) => p.lvl);

            let match;

            if (resultArcanaLevels.includes(calcLvl)) {
                match =
                    resultArcanaFusables[resultArcanaLevels.indexOf(calcLvl)];

                fusions.push([match.name, [personaA.name, personaB.name]]);
            } else {
                const calcLvlIndex = _.sortedIndex(resultArcanaLevels, calcLvl);

                if (personaA.arcana === personaB.arcana) {
                    match = resultArcanaFusables[calcLvlIndex - 1];
                } else {
                    match = resultArcanaFusables[calcLvlIndex];
                }

                if (match !== undefined) {
                    fusions.push([match.name, [personaA.name, personaB.name]]);
                } else {
                    fusions.push([
                        resultArcanaFusables.at(-1).name,
                        [personaA.name, personaB.name],
                    ]);
                }
            }
        }
    });

    console.log(fusions);
}

export function findGemPairs(currentPersona) {
    const { name: currentName, arcana: currentArcana } = currentPersona;

    const resultArcanaCombos = treasureCombos[currentArcana];
    const resultArcanaPersonas = fusablePersonaListSorted[currentArcana].filter(
        (p) => p.special === undefined,
    );

    const result = [];

    for (let i = 0; i < resultArcanaPersonas.length; i++) {
        for (let gem in resultArcanaCombos) {
            const calcIndex = i + resultArcanaCombos[gem];

            if (resultArcanaPersonas[calcIndex] !== undefined) {
                result.push([
                    resultArcanaPersonas[calcIndex],
                    [currentName, gem],
                ]);
            }
        }
    }

    console.log(result);

    return result;
}
