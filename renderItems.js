import { createCategoryDiv } from './utils.js';

export function renderItems(data) {
  const container = document.getElementById("itemContainer");
  container.innerHTML = "";

  data.forEach(item => {
    let itemDiv = document.createElement("div");
    itemDiv.className = "item";

    // Row 1: Name + Min Level
    let row1 = document.createElement("div");
    row1.className = "row row1";
    row1.innerHTML = `<span class="name">${item.Name}</span>
                      <span class="min-level">[${item["Min Level"]}]</span>`;
    itemDiv.appendChild(row1);

    // Row 2: Slot + Weight
    let row2 = document.createElement("div");
    row2.className = "row row2";
    row2.innerHTML = `<span class="slot">${item.Slot}</span>
                      <span class="weight">${item.Weight}</span>`;
    itemDiv.appendChild(row2);

    // Row 3: Stats categories
    let statsRow = document.createElement("div");
    statsRow.className = "row row3";
    [
      ["Combat Stats", item["Combat Stats"]],
      ["Special Effects", item["Special Effects"]],
      ["Attributes", item.Attributes],
      ["Magic Resistance", item["Magic Resistance"]],
      ["Health & Mana", item["Health & Mana"]],
      ["Spells", item.Spells],
      ["Other Identifiers", item["Other Identifiers"]]
    ].forEach(([category, values]) => {
      let catDiv = createCategoryDiv(category, values);
      if (catDiv) statsRow.appendChild(catDiv);
    });
    itemDiv.appendChild(statsRow);

    // Row 4: spacing
    itemDiv.appendChild(document.createElement("div")).className = "row spacer";

    // Row 5: Classes
    let row5 = document.createElement("div");
    row5.className = "row row5 classes";
    row5.textContent = "Classes: " + (item.Classes || "None");
    itemDiv.appendChild(row5);

    // Row 6: Monster + Location
    let row6 = document.createElement("div");
    row6.className = "row row6";
    row6.innerHTML = `<span class="monster">${item.Monster}</span>
                      <span class="location">${item.Location}</span>`;
    itemDiv.appendChild(row6);

    container.appendChild(itemDiv);
  });
}
