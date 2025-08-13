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
            displayTable(tableData);
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

function displayTable(data) {
    const container = document.getElementById("itemContainer");
    container.innerHTML = "";

    if (data.length === 0) return;

    data.forEach(row => {
        let card = document.createElement("div");
        card.classList.add("item-card");

        Object.keys(row).forEach(key => {
            let propDiv = document.createElement("div");
            propDiv.classList.add("item-property", `prop-${key.replace(/\s+/g, '-').toLowerCase()}`);

            let label = document.createElement("span");
            label.classList.add("prop-label");
            label.textContent = `${key}: `;

            let value = document.createElement("span");
            value.classList.add("prop-value");
            value.textContent = row[key];

            propDiv.appendChild(label);
            propDiv.appendChild(value);
            card.appendChild(propDiv);
        });

        container.appendChild(card);
    });
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

    displayTable(filteredData);
}
