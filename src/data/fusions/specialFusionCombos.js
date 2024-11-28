export const specialFusions = [
    {
        result: "Alice",
        sources: ["Nebiros", "Belial"],
        condition: "complete Death Confidant.",
    },
    {
        result: "Ardha",
        sources: ["Parvati", "Shiva"],
        condition: "complete Temperance Confidant.",
    },
    {
        result: "Asura-Ou",
        sources: ["Zouchouten", "Jikokuten", "Koumokuten", "Bishamonten"],
        condition: "complete Sun Confidant.",
    },
    {
        result: "Black Frost",
        sources: ["Jack-o'-Lantern", "Jack Frost", "King Frost"],
        condition: "complete 'One who bullies bullies' request.",
    },
    {
        result: "Bugs",
        sources: ["Pixie", "Pisaca", "Hariti"],
        condition: "complete 'The Lovesick Cyberstalking Girl' request.",
    },
    {
        result: "Chi You",
        sources: [
            "Hecatoncheires",
            "White Rider",
            "Thor",
            "Yoshitsune",
            "Cu Chulainn",
        ],
        condition: "complete Chariot Confidant.",
    },
    {
        result: "Flauros",
        sources: ["Berith", "Andras", "Eligor"],
    },
    {
        result: "Kohryu",
        sources: ["Genbu", "Seiryu", "Suzaku", "Byakko"],
        condition: "complete Hierophant Confidant.",
    },
    {
        result: "Lucifer",
        sources: [
            "Anubis",
            "Ananta",
            "Trumpeter",
            "Michael",
            "Metatron",
            "Satan",
        ],
        condition: "complete Star Confidant.",
    },
    {
        result: "Metatron",
        sources: [
            "Principality",
            "Power",
            "Dominion",
            "Melchizedek",
            "Sandalphon",
            "Michael",
        ],
        condition: "complete Justice Confidant.",
    },
    {
        result: "Michael",
        sources: ["Raphael", "Gabriel", "Uriel"],
    },
    {
        result: "Neko Shogun",
        sources: ["Kodama", "Sudama", "Anzu"],
    },
    {
        result: "Ongyo-Ki",
        sources: ["Kin-Ki", "Sui-Ki", "Fuu-Ki"],
        condition: "complete Hermit Confidant.",
    },
    {
        result: "Satanael",
        sources: ["Arsene", "Anzu", "Ishtar", "Satan", "Lucifer", "Michael"],
        condition: "complete the game and reach its True Ending.",
    },
    {
        result: "Seth",
        sources: ["Isis", "Thoth", "Anubis", "Horus"],
    },
    {
        result: "Shiva",
        sources: ["Rangda", "Barong"],
    },
    {
        result: "Sraosha",
        sources: ["Mitra", "Mithras", "Melchizedek", "Lilith", "Gabriel"],
    },
    {
        result: "Throne",
        sources: ["Power", "Melchizedek", "Dominion"],
    },
    {
        result: "Trumpeter",
        sources: ["White Rider", "Red Rider", "Black Rider", "Pale Rider"],
    },
    {
        result: "Vasuki",
        sources: ["Naga", "Raja Naga", "Ananta"],
    },
    {
        result: "Yoshitsune",
        sources: [
            "Okuninushi",
            "Shiki-Ouji",
            "Arahabaki",
            "Yatagarasu",
            "Futsunushi",
        ],
    },
];

export function getCondition(personaName) {
    const recipe = specialFusions.find(
        (recipe) => recipe.result === personaName,
    );
    return recipe.condition ? recipe.condition : "no special conditions.";
}
