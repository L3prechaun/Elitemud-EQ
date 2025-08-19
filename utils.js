export const classNames = ["As", "Ba", "Ca", "Cl", "Dr", "Il", "Kn", "Ma", "Mo", "Mu", "Ni", "Pa", "Ps", "Ra", "Th", "Wa", "Wi", "il"];

export function convertClassNumbersToAbbreviations(row) {
  if (row["Classes"] && /^[01]+$/.test(row["Classes"])) {
    let classValues = row["Classes"].split('').map((num, i) => num === "1" ? classNames[i] : null).filter(Boolean);
    row["Classes"] = classValues.join(", ") || "None";
  }
  return row;
}

export function createCategoryDiv(categoryName, values) {
  if (!values || values.trim() === "" || values === "-") return null;

  let container = document.createElement("div");
  container.className = `category ${categoryName.toLowerCase().replace(/ & | /g, "-")}`;

  values.split(/\s+/).forEach(val => {
    let span = document.createElement("span");
    span.textContent = val;

    if (/^HR/i.test(val)) span.className = "stat hr";
    else if (/^DR/i.test(val)) span.className = "stat dr";
    else if (/^AC/i.test(val)) span.className = "stat ac";

    else if (/^Str/i.test(val)) span.className = "attr str";
    else if (/^Dex/i.test(val)) span.className = "attr dex";
    else if (/^Con/i.test(val)) span.className = "attr con";
    else if (/^Int/i.test(val)) span.className = "attr int";
    else if (/^Wis/i.test(val)) span.className = "attr wis";
    else if (/^Cha/i.test(val)) span.className = "attr cha";

    else if (/^Hp/i.test(val)) span.className = "resource hp";
    else if (/^Mana/i.test(val)) span.className = "resource mana";
    else if (/^Move/i.test(val)) span.className = "resource move";

    else span.className = "misc";

    container.appendChild(span);
  });

  return container;
}
