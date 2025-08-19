import { convertClassNumbersToAbbreviations } from './utils.js';
import { populateSlotFilter, populateLocationFilter } from './filters.js';
import { renderItems } from './renderItems.js';

export let tableData = [];

export function loadCSVFromFile(file) {
  if (!file) return;

  console.log("📂 Loading CSV from file:", file.name);

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      console.log("✅ File parsed, rows loaded:", results.data.length);

      tableData = results.data.map(row => convertClassNumbersToAbbreviations(row));
      populateSlotFilter(tableData);
      populateLocationFilter(tableData);
      renderItems(tableData);

      console.log("📊 Table data ready:", tableData.slice(0, 5)); // show first 5 rows
    }
  });
}

export function autoLoadCSV(path = "eqlist_formatted.csv") {
  console.log("🌍 Trying to auto-load CSV from:", path);

  fetch(path)
    .then(response => {
      if (!response.ok) throw new Error("Load failed");
      console.log("✅ CSV file found, status:", response.status);
      return response.text();
    })
    .then(csvText => {
      console.log("📥 CSV text length:", csvText.length);

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
          console.log("✅ Auto-load parsed, rows loaded:", results.data.length);

          tableData = results.data.map(row => convertClassNumbersToAbbreviations(row));
          populateSlotFilter(tableData);
          populateLocationFilter(tableData);
          renderItems(tableData);

          console.log("📊 First few rows:", tableData.slice(0, 5));
        }
      });
    })
    .catch(err => console.warn("⚠ Auto-load failed:", err.message));
}

// 🚀 Run on page load
document.addEventListener("DOMContentLoaded", () => {
  autoLoadCSV();
});
