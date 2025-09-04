import { CLASS_ORDER } from './filters.js';   // at the top

const decodeClasses = (mask) => {
  if (!mask || mask === 'All') return [];
  const bits = String(mask).replace(/\s+/g,'').split('');
  const out = [];
  bits.forEach((b,i) => {
    if (b === '1') out.push(CLASS_ORDER[i]);
  });
  return out;
};


// render.js — card rendering helpers

const listChips = (items, className='') =>
  items?.length ? `<div class="chips">${items.map(x => `<span class="chip ${className}">${x}</span>`).join('')}</div>` : '';

const section = (title, html) => html ? `<div class="section"><div class="small">${title}</div>${html}</div>` : '';

const fmtKV = (obj, labelMap = {}) => {
  if (!obj || typeof obj !== 'object') return '';
  const entries = Object.entries(obj);
  if (!entries.length) return '';
  return `
    <div class="kv">
      ${entries.map(([k, v]) => {
        const label = labelMap[k] || k;
        const key = String(label).toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9_-]/g,'');
        const val = Array.isArray(v) ? v.join(', ')
                  : (typeof v === 'object' ? JSON.stringify(v) : v);
        return `
          <div class="kv-item kv-${key}" data-k="${key}">
            <b class="kv-label">${label}</b>
            <div class="mono kv-value kv-${key}-value">${val}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
};

export const renderItem = (it) => {
  const topLine = [
    it.Slot, it.Type, (typeof it.Weight === 'number' ? `Wg${it.Weight}` : null),
    it.Minimumlevel != null ? `Min Lvl ${it.Minimumlevel}` : null
  ].filter(Boolean).join('');

  const alignChips = [];
  if (it['Alignment Indicators']) {
    if (it['Alignment Indicators'].Good) alignChips.push('<span class="chip good">G</span>');
    if (it['Alignment Indicators'].Neutral) alignChips.push('<span class="chip neutral">N</span>');
    if (it['Alignment Indicators'].Evil) alignChips.push('<span class="chip evil">E</span>');
  }

 // const archObj = it['Class Archetypes'] || {};
 // const archChips = Object.keys(archObj).filter(k => archObj[k]).map(k => `<span class="chip">${k}</span>`);

  const combat = it['Combat Stats'];
  let combatHTML = '';
  if (combat && typeof combat === 'object') {
    const map = { Dice:'Dice', AC:'AC', DR:'DR', HR:'HR' };
    const kvs = Object.entries(combat).map(([k, v]) => {
    const label = map[k] || k;
    const key = String(label).toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9_-]/g,'');
    return `
      <div class="kv-item kv-${key}" data-stat="${key}">
        <span class="kv-label">${label}: </span>
        <span class="mono kv-value kv-${key}-value">${v}</span>
      </div>
    `;
  }).join('');
  combatHTML = `<div class="kv">${kvs}</div>`;
}

  const attrMap = {Str:'Str', Dex:'Dex', Int:'Int', Wis:'Wis', Cha:'Cha', Con:'Con', Agi:'Agi'};
  const resMap  = {HP:'HP', MN:'MN', MV:'MV'};
  const mrMap   = {MR:'MR', SPo:'SPo', SPh:'SPh', SMe:'SMe', SMa:'SMa'};

  const specials = it['Special Effects'];
  let specialsHTML = '';
  if (specials && typeof specials === 'object') {
    const bools = Object.entries(specials).filter(([_,v]) => v === true).map(([k]) => k.toLowerCase());
    const nums = Object.entries(specials).filter(([_,v]) => typeof v === 'number');
    if (bools.length) specialsHTML += listChips(bools);
    if (nums.length) specialsHTML += fmtKV(Object.fromEntries(nums));
  }

  let spellsHTML = '';
  if (Array.isArray(it.Spells) && it.Spells.length) {
    spellsHTML = `<div class="chips">${it.Spells.map(s => `<span class="pill">${s.count}x ${s.name}</span>`).join('')}</div>`;
  }


// --- footer lines (with CSS hooks) ---

const footLines = [];

// 1) CLASSES line FIRST (above Found)
if (it.Classes && it.Classes !== 'All') {
  const abbrevs = decodeClasses(it.Classes);
  if (abbrevs.length) {
    footLines.push(
      `<div class="footer-line classes">
         <span class="label">Classes:</span>
         <span class="classes__list">${abbrevs.join(' ')}</span>
       </div>`
    );
  }
}

// 2) FOUND line (with separate hooks for monster/location)
const monster = it.Monster;
const location = it.Location;
if (monster || location) {
  // build inner parts with specific hooks you can style separately
  const parts = [];
  if (monster)  parts.push(`<span class="found__monster">${monster}</span>`);
  if (location) parts.push(`<span class="found__location">${location}</span>`);
  footLines.push(
    `<div class="footer-line found">
       <span class="label">Found:</span>
       <span class="found__content">${parts.join('  •  ')}</span>
     </div>`
  );
}

// Final footer HTML
const footerHTML = footLines.length
  ? `<div class="footer">${footLines.join('')}</div>`
  : '';

    
  return `
    <div class="card">
      <div class="heading">
        <div class="name">${it.Name || 'Unnamed item'}</div>
        ${alignChips.length ? `<div class="chips" style="margin-top:6px;">${alignChips.join('')}</div>` : ''}
      </div>
      ${topLine ? `<div class="small">${topLine}</div>` : ''}
      ${it.ID ? `<!-- <span class="pill mono">#${it.ID}</span> -->` : ''}
      

      ${section('Combat', combatHTML)}
      ${section('Attributes', fmtKV(it.Attributes, attrMap))}
      ${section('Resources', fmtKV(it['Resources'], resMap))}
      ${section('Magic Res', fmtKV(it['Magic Res'], mrMap))}
      ${section('Special Effects', specialsHTML)}
      ${section('Spells', spellsHTML)}
      ${it.Misc && it.Misc.length ? section('Misc', `<div class="small mono">${it.Misc.join(', ')}</div>`) : ''}

      ${footerHTML}
    </div>
  `;
};