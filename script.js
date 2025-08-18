let tableData = [];
const classNames = ["As", "Ba", "Ca", "Cl", "Dr", "Il", "Kn", "Ma", "Mo", "Mu", "Ni", "Pa", "Ps", "Ra", "Th", "Wa", "Wi", "il"];

const locations = [
    "All", "Unknown", "Ancient Battlefield", "Arachnos", "Assassin Caves", "Bandit Caves",
    "Barrow Citadel of the Crimson Fists", "Black Lagoon", "Catacombs", "Chessboard", "City of Midgaard",
    "Crete", "Demon Empire", "Dirt Path", "Draconia", "Drow Underground City", "Dwarf 'n' Glob Iron Mill",
    "Dwarfen Undermountain Harbour", "Dwarven Kingdom", "Elemental Canyon", "Elven Forest of Namir", "Elysium Faire",
    "Galaxy", "Geldenrock", "Gigantia", "Gnome Village", "Godforsaken Slum (PKOK)", "Gragloy Castle", "Graveyard",
    "Great Elven City of Illir", "Great Pyramid", "Heaven", "Heavy Forest", "Hell", "High Tower of Sorcerery",
    "Hobbit Village", "Hobgoblin Mines", "Japan", "King Welmar's Castle", "Lizardmen Hometown",
    "Ma Glob's Dancing Parlor", "Mahn-Tor", "Midgaard Sewers", "Moria Mountains", "Myconoid Temple", "Nomad Camp",
    "Northern Road", "Pirates of Silven Raven", "Pirates of Silver Raven", "Psionicist School", "Quifael's House",
    "Rage of the Gods", "Rand's Tower", "Redferne's Residence", "Rome", "Samurai Tower", "Shaalziran'dar",
    "Small Temple", "Stanneg", "Storm Dragons Fortress", "Swamp", "Thalos", "The Lost City of Delray",
    "The Newbie Zoo", "Three of Swords", "Troll Caves", "Tynstri", "Ultima", "Undertemple", "Village of Faerise",
    "Village of Miqi'erke", "Village of the Merkins", "Werehome"
];

// Populate location dropdown
const dropdown = document.getElementById("locationDropdown");
locations.forEach(location => {
    let option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    dropdown.appendChild(option);
});

// 🔹 Auto-load CSV from root folder
window.addEventListener("DOMContentLoaded", () => {
    fetch("eqlist_formatted.csv")
        .then(response => {
            if (!response.ok) throw new Error("CSV file not found in root folder");
            return response.text();
        })
        .then(csvText => {
            const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
            tableData = results.data.map(row => convertClassNumbersToAbbreviations(row));
            populateSlotFilter(tableData);
            displayTableAsDivs(tableData);
        })
        .catch(err => console.warn("Auto-load failed:", err.message));
});

function convertClassNumbersToAbbreviations(row) {
    if (row["Classes"] && /^[01]+$/.test(row["Classes"])) {
        let classValues = row["Classes"].split('')
            .map((num, index) => num === "1" ? classNames[index] : null)
            .filter(Boolean);
        row["Classes"] = classValues.join(", ") || "None";
    }
    return row;
}

function populateSlotFilter(data) {
    let slotFilter = document.getElementById("slotFilter");
    let slots = new Set(data.map(row => row["Slot"]).filter(slot => slot));
    slotFilter.innerHTML = '<option value="">All</option>' +
        Array.from(slots).map(slot => `<option value="${slot}">${slot}</option>`).join('');
}

function displayTableAsDivs(data) {
    const container = document.getElementById("itemContainer");
    container.innerHTML = "";
  
    data.forEach(row => {
      let itemDiv = document.createElement("div");
      itemDiv.className = "item";
  
      // --- Row 1: Name (left) + Alignment (right) ---
      let row1 = document.createElement("div");
      row1.className = "row row-top";
      row1.innerHTML = `
        <div class="name">${row["Name"] || ""}</div>
        <div class="alignment">${row["Alignment"] || ""}</div>
      `;
      itemDiv.appendChild(row1);
  
      // --- Row 2: Slot (left) + Weight (right) ---
      let row2 = document.createElement("div");
      row2.className = "row row-mid";
      row2.innerHTML = `
        <div class="slot">${row["Slot"] || ""}</div>
        <div class="weight">${row["Weight"] || ""}</div>
      `;
      itemDiv.appendChild(row2);
  
      // --- Row 3: Combat stats + everything else not already placed ---
      let statsRow = document.createElement("div");
      statsRow.className = "row row-stats";
      let stats = [
        row["Combat Stats"],
        row["Special Effects"],
        row["Attributes"],
        row["Magic Resistance"],
        row["Health & Mana"],
        row["Spells"],
        row["Other Identifiers"]
      ].filter(Boolean).join(" | "); // join non-empty props
      statsRow.textContent = stats;
      if (stats) itemDiv.appendChild(statsRow);
  
      // --- Row 4: Empty spacer row ---
      let spacer = document.createElement("div");
      spacer.className = "row row-spacer";
      spacer.innerHTML = "&nbsp;";
      itemDiv.appendChild(spacer);
  
      // --- Row 5: Classes ---
      let classesRow = document.createElement("div");
      classesRow.className = "row row-classes";
      classesRow.textContent = row["Classes"] || "";
      itemDiv.appendChild(classesRow);
  
      // --- Row 6: Monster + Location ---
      let row6 = document.createElement("div");
      row6.className = "row row-bottom";
      row6.innerHTML = `
        <div class="monster">${row["Monster"] || ""}</div>
        <div class="location">${row["Location"] || ""}</div>
      `;
      itemDiv.appendChild(row6);
  
      container.appendChild(itemDiv);
    });
  }
  
  function createCategoryDiv(label, value) {
    if (!value) return "";
    let div = document.createElement("div");
    div.className = label.toLowerCase().replace(/\s+/g, "-"); // e.g. "Combat Stats" -> "combat-stats"
    
    // Split values into tokens (AC-7, HR+5, Str+2, FR+10, etc.)
    let tokens = value.split(/\s+/);
    tokens.forEach(tok => {
      let span = document.createElement("span");
  
      // --- Combat Stats ---
      if (/^HR/i.test(tok)) span.className = "stat-hr";
      else if (/^DR/i.test(tok)) span.className = "stat-dr";
      else if (/^AC/i.test(tok)) span.className = "stat-ac";
      else if (/^DD/i.test(tok)) span.className = "stat-dd";
      else if (/^MR/i.test(tok)) span.className = "stat-mr";
  
      // --- Resistances ---
      else if (/^FR/i.test(tok)) span.className = "res-fire";
      else if (/^CR/i.test(tok)) span.className = "res-cold";
      else if (/^LR/i.test(tok)) span.className = "res-lightning";
      else if (/^PR/i.test(tok)) span.className = "res-poison";
  
      // --- Attributes ---
      else if (/^Str/i.test(tok)) span.className = "attr-str";
      else if (/^Dex/i.test(tok)) span.className = "attr-dex";
      else if (/^Con/i.test(tok)) span.className = "attr-con";
      else if (/^Int/i.test(tok)) span.className = "attr-int";
      else if (/^Wis/i.test(tok)) span.className = "attr-wis";
      else if (/^Cha/i.test(tok)) span.className = "attr-cha";
      else if (/^Agi/i.test(tok)) span.className = "attr-agi";
  
      // --- Health & Mana ---
      else if (/^HP/i.test(tok)) span.className = "stat-hp";
      else if (/^Mana/i.test(tok)) span.className = "stat-mana";
  
      // --- Fallback ---
      else span.className = "stat-generic";
  
      span.textContent = tok;
      div.appendChild(span);
      div.appendChild(document.createTextNode(" ")); // spacing
    });
    
    return div;
  }
  
  


function filterTable() {
    let level = document.getElementById("levelFilter").value;
    let classFilter = document.getElementById("classFilter").value.toLowerCase();
    let slotFilter = document.getElementById("slotFilter").value;
    let locationDropdown = document.getElementById("locationDropdown").value;

    let filteredData = tableData.filter(row => {
        let meetsLevel = level === "" || parseInt(row["Min Level"]) >= parseInt(level);
        let meetsClass = classFilter === "" || row["Classes"].toLowerCase().includes(classFilter);
        let meetsSlot = slotFilter === "" || row["Slot"] === slotFilter;
        let meetsLocation = locationDropdown === "" || locationDropdown === "All" || row["Location"] === locationDropdown;
        return meetsLevel && meetsClass && meetsSlot && meetsLocation;
    });

    displayTableAsDivs(filteredData)
}
