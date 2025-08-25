// render.js — card rendering helpers

const listChips = (items, className='') =>
  items?.length ? `<div class="chips">${items.map(x => `<span class="chip ${className}">${x}</span>`).join('')}</div>` : '';

const section = (title, html) => html ? `<div class="section"><div class="small">${title}</div>${html}</div>` : '';

const fmtKV = (obj, labelMap={}) => {
  if (!obj || typeof obj !== 'object') return '';
  const entries = Object.entries(obj);
  if (!entries.length) return '';
  return `
    <div class="kv">
      ${entries.map(([k,v]) => {
        const label = labelMap[k] || k;
        const val = Array.isArray(v) ? v.join(', ') : (typeof v === 'object' ? JSON.stringify(v) : v);
        return `<div><b>${label}</b><div class="mono">${val}</div></div>`;
      }).join('')}
    </div>
  `;
};

export const renderItem = (it) => {
  const topLine = [
    it.Slot, it.Type, (typeof it.Weight === 'number' ? `Wg${it.Weight}` : null),
    it.Minimumlevel != null ? `Min Lvl ${it.Minimumlevel}` : null
  ].filter(Boolean).join(' • ');

  const alignChips = [];
  if (it['Alignment Indicators']) {
    if (it['Alignment Indicators'].Good) alignChips.push('<span class="chip good">Good</span>');
    if (it['Alignment Indicators'].Neutral) alignChips.push('<span class="chip neutral">Neutral</span>');
    if (it['Alignment Indicators'].Evil) alignChips.push('<span class="chip evil">Evil</span>');
  }

  const archObj = it['Class Archetypes'] || {};
  const archChips = Object.keys(archObj).filter(k => archObj[k]).map(k => `<span class="chip">${k}</span>`);

  const combat = it['Combat Stats'];
  let combatHTML = '';
  if (combat && typeof combat === 'object') {
    const map = { Dice:'Dice', AC:'AC', DR:'DR', HR:'HR' };
    const kvs = Object.keys(combat).map(k => `<div><b>${map[k]||k}</b><div class="mono">${combat[k]}</div></div>`).join('');
    if (kvs) combatHTML = `<div class="kv">${kvs}</div>`;
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

  const footBits = [];
  if (it.Monster) footBits.push(`Mob: ${it.Monster}`);
  if (it.Location) footBits.push(`Zone: ${it.Location}`);
  if (it.Classes && it.Classes !== 'All') footBits.push(`Classes: ${it.Classes}`);

  return `
    <div class="card">
      <div class="heading">
        <div class="name">${it.Name || 'Unnamed item'}</div>
        ${it.ID ? `<span class="pill mono">#${it.ID}</span>` : ''}
      </div>
      ${topLine ? `<div class="small">${topLine}</div>` : ''}
      ${alignChips.length ? `<div class="chips" style="margin-top:6px;">${alignChips.join('')}</div>` : ''}
      ${archChips.length ? `<div class="chips">${archChips.join('')}</div>` : ''}

      ${section('Combat', combatHTML)}
      ${section('Attributes', fmtKV(it.Attributes, attrMap))}
      ${section('Resources', fmtKV(it['Resources'], resMap))}
      ${section('Magic Res', fmtKV(it['Magic Res'], mrMap))}
      ${section('Special Effects', specialsHTML)}
      ${section('Spells', spellsHTML)}
      ${it.Misc && it.Misc.length ? section('Misc', `<div class="small mono">${it.Misc.join(', ')}</div>`) : ''}

      ${footBits.length ? `<div class="footer">${footBits.join(' • ')}</div>` : ''}
    </div>
  `;
};
