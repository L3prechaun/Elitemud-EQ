import { convertClassNumbersToAbbreviations } from './utils.js';
import { populateSlotFilter, populateLocationFilter, filterTable } from './filters.js';
import { renderItems } from './renderItems.js';

export let tableData = [];

export function loadCSVFromFile(file) {
  if (!file) return;

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      tableData = results.data.map(row => convertClassNumbersToAbbreviations(row));
      populateSlotFilter(tableData);
      populateLocationFilter(tableData);
      renderItems(tableData);
    }
  });
}

export function autoLoadCSV(path = "eqlist_formatted.csv") {
  fetch(path)
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
          populateLocationFilter(tableData);
          renderItems(tableData);
        }
      });
    })
    .catch(err => console.warn("⚠ Auto-load failed:", err.message));
}
