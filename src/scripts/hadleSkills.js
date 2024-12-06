import { elements, inheritanceChart } from "../data/skillInheritance";
import { skills } from "../data/skills";
import { items } from "../data/items";

export function getInheritedElements(inheritanceType) {
    const inheritanceList = inheritanceChart[inheritanceType];
    const inheritedElements = [];

    for (let i = 0; i < inheritanceList.length; i++) {
        if (inheritanceList[i] === "true") {
            inheritedElements.push(elements[i]);
        }
    }

    return inheritedElements;
}

export function getSkillDetails(name) {
    return skills[name];
}

export function getSkillCost(name) {
    if (skills[name]["cost"]) {
        return skills[name]["cost"] > 100
            ? `${skills[name]["cost"] / 100}SP`
            : `${skills[name]["cost"]}%HP`;
    }

    return "";
}

export function getItemDetails(name) {
    return items[name];
}
