import {
    normalFusions,
    specialFusions,
    treasureCombos,
} from "../data/fusions/index.js";

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

function findFusionPairs(resultPersona) {
    const {
        name: resultName,
        lvl: resultLvl,
        arcana: resultArcana,
    } = resultPersona;

    if (resultPersona.special) {
        const recipe = specialFusions.find(
            (fusion) => fusion.result === resultName,
        );
        return recipe.sources;
    }

    const fusionPairs = normalFusions.filter(
        (pair) => pair.result === resultArcana,
    );

    const fusions = [];

    fusionPairs.forEach((pair) => {
        const [arcanaA, arcanaB] = pair.source;

        let arcanaAPersonas;
        let arcanaBPersonas;

        if (arcanaA === arcanaB) {
            arcanaAPersonas = fusablePersonaListSorted[arcanaA].filter(
                (p) => p.name !== resultName,
            );
            arcanaBPersonas = [...arcanaAPersonas];
        } else {
            arcanaAPersonas = fusablePersonaListSorted[arcanaA];
            arcanaBPersonas = fusablePersonaListSorted[arcanaB];
        }

        for (let personaA of arcanaAPersonas) {
            for (let personaB of arcanaBPersonas) {
                if (personaB.name === personaA.name) continue;

                const INDEX = Number.isInteger(
                    (personaA.lvl + personaB.lvl) / 2 + 1,
                )
                    ? 1
                    : 0.5;
                const calcLvl = (personaA.lvl + personaB.lvl) / 2 + INDEX;

                const resultArcanaFusables = fusablePersonaListSorted[
                    resultArcana
                ].filter(
                    (p) =>
                        p.special === undefined &&
                        p.name !== personaA.name &&
                        p.name !== personaB.name,
                );
                const resultPersonaIndex = resultArcanaFusables.findIndex(
                    (p) => p.name === resultName,
                );

                let nextPersona;
                let prevPersona;

                if (
                    resultArcanaFusables[resultPersonaIndex + 1] !== undefined
                ) {
                    nextPersona = resultArcanaFusables[resultPersonaIndex + 1];
                } else {
                    nextPersona = { lvl: 100 };
                }

                if (
                    resultArcanaFusables[resultPersonaIndex - 1] !== undefined
                ) {
                    prevPersona = resultArcanaFusables[resultPersonaIndex - 1];
                } else {
                    prevPersona = { lvl: 0 };
                }

                if (arcanaA === arcanaB) {
                    if (calcLvl >= resultLvl && calcLvl < nextPersona.lvl) {
                        fusions.push([personaA.name, personaB.name]);
                    }
                } else {
                    if (calcLvl <= resultLvl && calcLvl > prevPersona.lvl) {
                        fusions.push([personaA.name, personaB.name]);
                    }
                }
            }
        }
    });

    const uniqFusions = _.uniqWith(
        fusions,
        (a, b) => a[0] === b[1] && a[1] === b[0],
    );

    return uniqFusions;
}

function gemWithGem(resultPersona) {
    const treasurePersonas = fullPersonaList
        .filter((p) => p.treasure)
        .map((persona) => {
            return {
                name: persona.name,
                lvl: persona.lvl,
                arcana: persona.arcana,
            };
        });

    const result = [];

    for (let personaA of treasurePersonas) {
        for (let personaB of treasurePersonas) {
            if (personaA.name === personaB.name) continue;

            const match = normalFusions.find(
                (fusion) =>
                    fusion.source.includes(personaA.arcana) &&
                    fusion.source.includes(personaB.arcana),
            );

            const resultArcana = match.result;

            const INDEX = Number.isInteger(
                (personaA.lvl + personaB.lvl) / 2 + 1,
            )
                ? 1
                : 0.5;
            const calcLvl = (personaA.lvl + personaB.lvl) / 2 + INDEX;

            const resultArcanaFusables = fusablePersonaListSorted[resultArcana]
                .filter((p) => p.special === undefined)
                .map((p) => p.lvl);

            if (resultArcanaFusables.includes(calcLvl)) {
                result.push([
                    fusablePersonaListSorted[resultArcana].find(
                        (p) => p.lvl === calcLvl,
                    ).name,
                    [personaA.name, personaB.name],
                ]);
            } else {
                const calcLvlIndex = _.sortedIndex(
                    resultArcanaFusables,
                    calcLvl,
                );
                result.push([
                    fusablePersonaListSorted[resultArcana].find(
                        (p) => p.lvl === resultArcanaFusables[calcLvlIndex + 1],
                    ).name,
                    [personaA.name, personaB.name],
                ]);
            }
        }
    }

    const uniqResult = _.uniqWith(result, (a, b) => a[0] === b[0]);

    const findResultPersona = uniqResult.find(
        (combo) => combo[0] === resultPersona.name,
    );

    if (findResultPersona === undefined) return false;

    return [findResultPersona[1]];
}

function findGemPairs(resultPersona) {
    const { name: resultName, arcana: resultArcana } = resultPersona;

    const resultArcanaCombos = treasureCombos[resultArcana];
    const resultArcanaPersonas = fusablePersonaListSorted[resultArcana].filter(
        (p) => p.special === undefined,
    );

    const resultPersonaIndex = resultArcanaPersonas.findIndex(
        (p) => p.name === resultName,
    );

    const result = [];

    for (let i = 0; i < resultArcanaPersonas.length; i++) {
        for (let gem in resultArcanaCombos) {
            const calcIndex = i + resultArcanaCombos[gem];

            if (calcIndex === resultPersonaIndex) {
                result.push([resultArcanaPersonas[i]["name"], gem]);
            }
        }
    }

    if (result.length === 0) return false;

    return result;
}

export function findAllPairs(resultPersona) {
    if (resultPersona.special) return findFusionPairs(resultPersona);

    const normalFusions = findFusionPairs(resultPersona);
    const gemWithGemFusions = gemWithGem(resultPersona);
    const personaWithGemFusions = findGemPairs(resultPersona);

    const result = normalFusions
        .concat(gemWithGemFusions, personaWithGemFusions)
        .filter((el) => el);

    return result;
}
