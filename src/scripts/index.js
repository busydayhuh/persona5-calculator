import { compendiumData } from "../data/fullCompendium.js";
import { arcanaOrder } from "../data/arcanaOrder.js";
import { DLC } from "../data/dlcList.js";
import * as _ from "lodash";

const fullCompendium = Object.keys(compendiumData).map((persona) =>
  Object.defineProperty(compendiumData[persona], "name", { value: persona })
);

const personas = fullCompendium.filter((persona) => !persona.dlc);

renderIndexPage();

function renderIndexPage() {
  renderDlcSettings();
  renderPersonaTable();
}

function renderDlcSettings() {
  const dlcForm = document.getElementById("dlc-form");
  let html = "";
  DLC.forEach((dlc) => {
    html += `<div>
                <input type="checkbox" id="${dlc[0]}" name="dlc" value="${dlc[0]}">
                <label for="${dlc[0]}">${dlc[0]} and ${dlc[1]}</label>
            </div>`;
  });
  dlcForm.innerHTML = html;
}

function renderPersonaTable(sorting = "arcana", dlc = []) {
  let sortedPersonas;

  if (sorting === "arcana") {
    const byArcana = _.groupBy(personas, sorting);
    sortedPersonas = arcanaOrder.flatMap((arcana) => byArcana[arcana]);
  } else if (sorting === "lvl") {
    sortedPersonas = _.orderBy(personas, ["lvl"], ["asc"]);
  }

  let html = "";
  for (let persona of sortedPersonas) {
    html += `<tr><td>${persona["arcana"]}</td><td>${persona["lvl"]}</td><td>${
      persona["name"]
    }</td><td>${hasType(persona)}</td></tr>`;
  }

  document.getElementById("compendium").innerHTML = html;
}

function sortPersonas(sorting, base) {}

function hasType(p) {
  if (p.special) return "special recipe";
  if (p.max) return "max arcana";
  if (p.treasure) return "gem shadow";
  if (p.dlc) return "DLC";
  return "—";
}
