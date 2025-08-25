// filters.js — filtering & sorting logic

export const CLASS_ORDER = ["As","Ba","Ca","Cl","Dr","Il","Kn","Ma","Mo","Mu","Ni","Pa","Ps","Ra","Th","Wa","Wi","il"];

const hasAny = (v) =>
  v != null && (
    (Array.isArray(v) && v.length) ||
    (typeof v === 'object' && Object.keys(v).length) ||
    (typeof v === 'string' && v !== '')
  );

export const canUse = (item, selectedClasses) => {
  if (!selectedClasses.length) return true;
  if (!item.Classes || item.Classes === 'All') return true;
  const bits = String(item.Classes).replace(/\s+/g,'').split('');
  return selectedClasses.some(code => {
    const idx = CLASS_ORDER.indexOf(code);
    return idx >= 0 && bits[idx] === '1';
  });
};

export const hasEffects = (item, required) => {
  if (!required.length) return true;
  const eff = item['Special Effects'] || {};
  return required.every(k => {
    const v = eff[k];
    return v === true || (typeof v === 'number' && v !== 0);
  });
};

export const hasMinResources = (item, minHP, minMN, minMV) => {
  const res = item['Resources'] || {};
  const okHP = minHP == null || (typeof res.HP === 'number' && res.HP >= minHP);
  const okMN = minMN == null || (typeof res.MN === 'number' && res.MN >= minMN);
  const okMV = minMV == null || (typeof res.MV === 'number' && res.MV >= minMV);
  return okHP && okMN && okMV;
};

export const hasStat = (item, key) => {
  if (!key) return true;
  if (key === 'Attributes') return hasAny(item.Attributes);
  if (key === 'MagicRes') return hasAny(item['Magic Res']);
  if (key === 'Spells') return Array.isArray(item.Spells) && item.Spells.length > 0;
  if (key === 'Specials') return hasAny(item['Special Effects']);
  const cs = item['Combat Stats'] || {};
  if (key in cs) {
    return cs[key] !== undefined && cs[key] !== null && cs[key] !== '';
  }
  return false;
};

export const sortItems = (items, sortBy) => {
  const out = [...items];
  out.sort((a,b) => {
    if (sortBy === 'name') return (a.Name||'').localeCompare(b.Name||'');
    if (sortBy === 'dr') return ((b['Combat Stats']?.DR ?? -1) - (a['Combat Stats']?.DR ?? -1));
    if (sortBy === 'hr') return ((b['Combat Stats']?.HR ?? -1) - (a['Combat Stats']?.HR ?? -1));
    if (sortBy === 'ac') return ((b['Combat Stats']?.AC ?? -1) - (a['Combat Stats']?.AC ?? -1));
    const al = (a.Minimumlevel ?? 999999), bl = (b.Minimumlevel ?? 999999);
    if (al !== bl) return al - bl;
    return (a.Name||'').localeCompare(b.Name||'');
  });
  return out;
};

export const applyFilters = (items, {
  hasStatKey = '',
  selectedClasses = [],
  requiredEffects = [],
  minHP = null,
  minMN = null,
  minMV = null,
  sortBy = 'lvl'
} = {}) => {
  const filtered = items.filter(it =>
    hasStat(it, hasStatKey) &&
    canUse(it, selectedClasses) &&
    hasEffects(it, requiredEffects) &&
    hasMinResources(it, minHP, minMN, minMV)
  );
  return sortItems(filtered, sortBy);
};
