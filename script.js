// ===============================
// Class abbreviations
// ===============================
const classNames = ["As", "Ba", "Ca", "Cl", "Dr", "Il", "Kn", "Ma", "Mo", "Mu", "Ni", "Pa", "Ps", "Ra", "Th", "Wa", "Wi", "il"];

let tableData = [];

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



// ===============================
// CSV Loader
// ===============================
function loadCSV(file = "eqlist_formatted.csv") {
  fetch(file)
    .then(response => {
      if (!response.ok) throw new Error("Load failed");
      return response.text();
    })
    .then(csvText => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          tableData = results.data.map(row => convertClassNumbersToAbbreviations(row));
          populateSlotFilter(tableData);
          displayTableAsDivs(tableData);
        }
      });
    })
    .catch(err => console.warn("⚠ CSV Auto-load failed:", err.message));
}

// ===============================
// Class translation
// ===============================
function convertClassNumbersToAbbreviations(row) {
  if (row["Classes"] && /^[01]+$/.test(row["Classes"])) {
    let classValues = row["Classes"]
      .split("")
      .map((num, index) => num === "1" ? classNames[index] : null)
      .filter(Boolean);
    row["Classes"] = classValues.join(", ") || "None";
  }
  return row;
}

// ===============================
// Slot filter population
// ===============================
function populateSlotFilter(data) {
  let slotFilter = document.getElementById("slotFilter");
  let slots = new Set(data.map(row => row["Slot"]).filter(slot => slot));
  slotFilter.innerHTML = '<option value="">All</option>' + Array.from(slots).map(slot => `<option value="${slot}">${slot}</option>`).join('');
}

// ===============================
// Category div builder
// ===============================
function createCategoryDiv(categoryName, values) {
    if (!values || values.trim() === "" || values === "-") return null;
  
    let container = document.createElement("div");
    container.className = `category ${categoryName.toLowerCase().replace(/ & | /g, "-")}`;
  
    values.split(/\s+/).forEach(val => {
      let span = document.createElement("span");
      span.textContent = val;
  
      if (/^HR/i.test(val)) span.className = "stat hr";
      else if (/^DR/i.test(val)) span.className = "stat dr";
      else if (/^AC/i.test(val)) span.className = "stat ac";
  
      // Attributes
      else if (/^Str/i.test(val)) span.className = "attr str";
      else if (/^Dex/i.test(val)) span.className = "attr dex";
      else if (/^Con/i.test(val)) span.className = "attr con";
      else if (/^Int/i.test(val)) span.className = "attr int";
      else if (/^Wis/i.test(val)) span.className = "attr wis";
      else if (/^Cha/i.test(val)) span.className = "attr cha";
  
      // Health & Mana
      else if (/^Hp/i.test(val)) span.className = "resource hp";
      else if (/^Mana/i.test(val)) span.className = "resource mana";
      else if (/^Move/i.test(val)) span.className = "resource move";
  
      else span.className = "misc";
  
      container.appendChild(span);
    });
  
    return container;
  }
  


// ===============================
// Main table renderer (as divs)
// ===============================
function displayTableAsDivs(data) {
  const container = document.getElementById("itemContainer");
  container.innerHTML = "";

  data.forEach(row => {
    let itemDiv = document.createElement("div");
    itemDiv.className = "item";

    // Row 1: Name + Alignment
    let row1 = document.createElement("div");
    row1.className = "row row-name";
    row1.innerHTML = `<div class="name">${row["Name"]}</div>
                      <div class="alignment">${row["Other Identifiers"] || ""}</div>`;
    itemDiv.appendChild(row1);

    // Row 2: Slot + Weight
    let row2 = document.createElement("div");
    row2.className = "row row-slot";
    row2.innerHTML = `<div class="slot">${row["Slot"]}</div>
                      <div class="weight">${row["Weight"]}</div>`;
    itemDiv.appendChild(row2);

    // Row 3: Categories
    let row3 = document.createElement("div");
    row3.className = "row row-stats";
    [
      ["Combat Stats", row["Combat Stats"]],
      ["Special Effects", row["Special Effects"]],
      ["Attributes", row["Attributes"]],
      ["Magic Resistance", row["Magic Resistance"]],
      ["Health & Mana", row["Health & Mana"]],
      ["Spells", row["Spells"]],
      ["Other Identifiers", row["Other Identifiers"]]
    ].forEach(([label, value]) => {
      let catDiv = createCategoryDiv(label, value);
      if (catDiv) row3.appendChild(catDiv);
    });
    itemDiv.appendChild(row3);

    // Spacer row
    itemDiv.appendChild(document.createElement("div"));

    // Row 5: Classes
    let row5 = document.createElement("div");
    row5.className = "row row-classes";
    row5.textContent = row["Classes"];
    itemDiv.appendChild(row5);

    // Row 6: Monster + Location
    let row6 = document.createElement("div");
    row6.className = "row row-source";
    row6.innerHTML = `<div class="monster">${row["Monster"]}</div>
                      <div class="location">${row["Location"]}</div>`;
    itemDiv.appendChild(row6);

    container.appendChild(itemDiv);
  });
}

// ===============================
// Init
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  loadCSV(); // Auto-load eqlist_formatted.csv from root
});

  
  


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
