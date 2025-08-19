import { renderItems } from './renderItems.js';
import { tableData } from './dataLoader.js';

export function populateSlotFilter(data) {
  let slotFilter = document.getElementById("slotFilter");
  let slots = new Set(data.map(row => row["Slot"]).filter(slot => slot));
  slotFilter.innerHTML = '<option value="">All</option>' +
    Array.from(slots).map(slot => `<option value="${slot}">${slot}</option>`).join('');
}

export function populateLocationFilter(data) {
  let locationFilter = document.getElementById("locationDropdown");
  let locations = new Set(data.map(row => row["Location"]).filter(loc => loc));
  locationFilter.innerHTML = '<option value="All">All</option>' +
    Array.from(locations).map(loc => `<option value="${loc}">${loc}</option>`).join('');
}

export function filterTable() {
  let level = document.getElementById("levelFilter").value;
  let classFilter = document.getElementById("classFilter").value.toLowerCase();
  let slotFilter = document.getElementById("slotFilter").value;
  let locationFilter = document.getElementById("locationDropdown").value;

  let filteredData = tableData.filter(row => {
    let meetsLevel = level === "" || parseInt(row["Min Level"]) >= parseInt(level);
    let meetsClass = classFilter === "" || row["Classes"].toLowerCase().includes(classFilter);
    let meetsSlot = slotFilter === "" || row["Slot"] === slotFilter;
    let meetsLocation = locationFilter === "All" || row["Location"] === locationFilter;
    return meetsLevel && meetsClass && meetsSlot && meetsLocation;
  });

  renderItems(filteredData);
}
document.getElementById("levelFilter").addEventListener("input", filterTable);
document.getElementById("classFilter").addEventListener("input", filterTable);
document.getElementById("slotFilter").addEventListener("change", filterTable);
document.getElementById("locationDropdown").addEventListener("change", filterTable);
