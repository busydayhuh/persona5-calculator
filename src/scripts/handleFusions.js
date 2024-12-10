import { uniqWith } from "lodash";

import {
    normalFusions,
    specialFusions,
    treasureCombos,
} from "../data/fusions/index.js";

import {
    getAllAvailablePersonasArray,
    sortPersonasArray,
    getPersonaKeyInfo,
} from "./handleCompendiumData.js";

const checkedDLC = JSON.parse(localStorage.getItem("checkedDLC")) || [];

const gemsFilteredOut = getAllAvailablePersonasArray(checkedDLC).filter(
    (persona) => persona.type !== "gem",
);
const specialsFilteredOut = getAllAvailablePersonasArray(checkedDLC).filter(
    (persona) => persona.type !== "gem" && persona.type !== "special",
);
const gemPersonas = getAllAvailablePersonasArray(checkedDLC).filter(
    (persona) => persona.type === "gem",
);

const allPossibleMaterilas = sortPersonasArray(
    gemsFilteredOut,
    "groupedByArcana",
);
const allPossibleResults = sortPersonasArray(
    specialsFilteredOut,
    "groupedByArcana",
);

export function aggregateReverseFusionResults(resultPersona) {
    const { name: nameR, type: typeR, arcana: arcanaR } = resultPersona;

    if (typeR === "gem") return [];
    if (typeR === "special") return getSpecialRecipe(resultPersona);

    const allMatchingResults = findMatchingResults(
        [
            getStandardReverseResults(arcanaR),
            getPersonaWithGemsResults(arcanaR),
            performGemWithGemFusion(),
        ],
        nameR,
    );

    return allMatchingResults;
}

function getSpecialRecipe(resultPersona) {
    const recipe = specialFusions.find(
        (recipe) => recipe.result === resultPersona.name,
    );
    recipe.result = resultPersona;
    recipe.source = recipe.source.map((personaName) =>
        getPersonaKeyInfo(personaName),
    );

    return [recipe];
}

function findMatchingResults(allResultsArray, resultPersonaName) {
    const allMatchingResults = [];

    allResultsArray.forEach((array) => {
        const matches = array.filter(
            (recipe) => recipe && recipe.result.name === resultPersonaName,
        );
        const uniqMatches = uniqWith(
            matches,
            (a, b) =>
                a.source[0].name === b.source[1].name &&
                a.source[1].name === b.source[0].name,
        );
        allMatchingResults.push(uniqMatches);
    });

    return allMatchingResults.flat();
}

const compareSourceArrays = (a, b) =>
    a.source[0].name === b.source[1].name &&
    a.source[1].name === b.source[0].name;

function getStandardReverseResults(arcanaR) {
    const arcanaChartPairs = normalFusions
        .filter((recipe) => recipe.result === arcanaR)
        .map((recipe) => recipe.source);

    const standardFusionsResults = [];

    arcanaChartPairs.forEach((pair) => {
        const arcanaAPersonas = allPossibleMaterilas[pair[0]];
        const arcanaBPersonas = allPossibleMaterilas[pair[1]];

        for (const personaA of arcanaAPersonas) {
            for (const personaB of arcanaBPersonas) {
                if (personaA.name === personaB.name) continue;

                const fusionResult = performStandardFusion(
                    personaA,
                    personaB,
                    arcanaR,
                );
                standardFusionsResults.push(fusionResult);
            }
        }
    });

    return standardFusionsResults;
}

function getPersonaWithGemsResults(arcanaR, personaA = null) {
    const arcanaAPersonas = personaA
        ? [personaA]
        : allPossibleMaterilas[arcanaR];

    const personaWithGemResults = [];
    for (const personaA of arcanaAPersonas) {
        for (const gem of gemPersonas) {
            if (personaA.name === gem.name) continue;

            const fusionResult = performPersonaWithGemFusion(personaA, gem);
            personaWithGemResults.push(fusionResult);
        }
    }

    return personaWithGemResults;
}

function performStandardFusion(personaA, personaB, arcanaR) {
    const { name: nameA, lvl: lvlA, arcana: arcanaA } = personaA;
    const { name: nameB, lvl: lvlB, arcana: arcanaB } = personaB;

    const resultArcana = arcanaR ? arcanaR : findResultArcana(arcanaA, arcanaB);
    const resultLvl = calcResultLvl(lvlA, lvlB);
    const personasOfResultArcana = allPossibleResults[resultArcana];

    const exactMatch = personasOfResultArcana.find(
        (persona) => persona.lvl === resultLvl,
    );
    if (exactMatch) return { source: [personaA, personaB], result: exactMatch };

    if (arcanaA === arcanaB) {
        const lowerMatch = personasOfResultArcana
            .filter(
                (persona) => persona.name !== nameA && persona.name !== nameB,
            )
            .reverse()
            .find((persona) => persona.lvl < resultLvl);

        return lowerMatch
            ? { source: [personaA, personaB], result: lowerMatch }
            : null;
    }

    const upperMatch = personasOfResultArcana.find(
        (persona) => persona.lvl > resultLvl,
    );

    return upperMatch
        ? { source: [personaA, personaB], result: upperMatch }
        : null;
}

function findResultArcana(arcanaA, arcanaB) {
    if (arcanaA === arcanaB) return arcanaA;

    return normalFusions.find(
        (recipe) =>
            recipe.source.includes(arcanaA) && recipe.source.includes(arcanaB),
    ).result;
}

function calcResultLvl(lvlA, lvlB) {
    const INDEX = Number.isInteger((lvlA + lvlB) / 2) ? 1 : 0.5;
    return (lvlA + lvlB) / 2 + INDEX;
}

function performPersonaWithGemFusion(personaA, gem) {
    const { arcana: arcanaA, name: nameA } = personaA;
    const { name: gemName } = gem;

    const personasOfResultArcana = allPossibleMaterilas[arcanaA];
    const personaAIndex = allPossibleMaterilas[arcanaA].findIndex(
        (persona) => persona.name === nameA,
    );

    const GEM_INDEX = treasureCombos[arcanaA][gemName];
    const match = matchPersonaRank(
        personasOfResultArcana,
        personaAIndex,
        GEM_INDEX,
    );

    return match ? { source: [personaA, gem], result: match } : null;
}

function matchPersonaRank(personas, startIndex, GEM_INDEX) {
    const possibleMatch = personas[startIndex + GEM_INDEX];

    if (!possibleMatch) return null;
    if (possibleMatch.type !== "special") return possibleMatch;

    const step = GEM_INDEX > 0 ? 1 : -1;

    return matchPersonaRank(personas, startIndex + step, GEM_INDEX);
}

function performGemWithGemFusion() {
    const results = [];
    for (const personaA of gemPersonas) {
        for (const personaB of gemPersonas) {
            if (personaA.name === personaB.name) continue;

            const fusionResult = performStandardFusion(personaA, personaB);
            results.push(fusionResult);
        }
    }

    return results;
}

export function aggregateForwardFusionResults(sourcePersona) {
    const { name: nameS, type: typeS, arcana: arcanaS } = sourcePersona;

    if (typeS === "gem") {
        return findMatchingSources(
            [
                getGemWithPersonasResults(sourcePersona),
                performGemWithGemFusion(),
            ],
            nameS,
        );
    }

    const allMatchingSources = findMatchingSources(
        [
            getStandardForwardResults(sourcePersona),
            getPersonaWithGemsResults(arcanaS, sourcePersona),
        ],
        nameS,
    );

    return allMatchingSources;
}

function findMatchingSources(allResultsArray, sourcePersonaName) {
    const allMatchingResults = [];

    allResultsArray.forEach((array) => {
        const matches = array.filter(
            (recipe) =>
                recipe &&
                recipe.source.some(
                    (persona) => persona.name === sourcePersonaName,
                ),
        );
        const uniqMatches = uniqWith(matches, compareSourceArrays);
        allMatchingResults.push(uniqMatches);
    });

    return allMatchingResults.flat();
}

function getStandardForwardResults(sourcePersona) {
    const { arcana: arcanaS } = sourcePersona;

    const arcanaChartRecipe = normalFusions.filter((recipe) =>
        recipe.source.includes(arcanaS),
    );

    const standardFusionsResults = [];

    arcanaChartRecipe.forEach((recipe) => {
        if (recipe.source.indexOf(arcanaS) === 1) {
            recipe.source[1] = recipe.source[0];
            recipe.source[0] = arcanaS;
        }

        const personaA = sourcePersona;
        const arcanaBPersonas = allPossibleMaterilas[recipe.source[1]];

        for (const personaB of arcanaBPersonas) {
            if (personaA.name === personaB.name) continue;

            const fusionResult = performStandardFusion(
                personaA,
                personaB,
                recipe.result,
            );
            standardFusionsResults.push(fusionResult);
        }
    });

    return standardFusionsResults;
}

function getGemWithPersonasResults(gem) {
    const arcanaAPersonas = Object.values(allPossibleMaterilas).flat();

    const gemWithPersonasResults = [];
    for (const personaA of arcanaAPersonas) {
        if (personaA.name === gem.name) continue;

        const fusionResult = performPersonaWithGemFusion(personaA, gem);
        gemWithPersonasResults.push(fusionResult);
    }

    return gemWithPersonasResults;
}

export function getMaxCondition(personaName) {
    const recipe = specialFusions.find(
        (recipe) => recipe.result === personaName,
    );
    return recipe.condition ? recipe.condition : "";
}
