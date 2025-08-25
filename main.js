// main.js — glue: loads data, reads UI state, applies filters, renders

import { applyFilters, CLASS_ORDER } from './filters.js';
import { renderItem } from './render.js';

const byId = id => document.getElementById(id);
const getMulti = sel => Array.from(sel.selectedOptions).map(o => o.value);

const DATA_URL = 'eqlist_min.json';
let ALL_ITEMS = [];

const readState = () => {
  const hasStatKey = byId('hasStat').value;
  const selectedClasses = getMulti(byId('classMulti'));
  const requiredEffects = getMulti(byId('effectsMulti')).map(x => x.toLowerCase());

  const hp = byId('minHP').value.trim(); const minHP = hp === '' ? null : Number(hp);
  const mn = byId('minMN').value.trim(); const minMN = mn === '' ? null : Number(mn);
  const mv = byId('minMV').value.trim(); const minMV = mv === '' ? null : Number(mv);

  const sortBy = byId('sortBy').value;
  return { hasStatKey, selectedClasses, requiredEffects, minHP, minMN, minMV, sortBy };
};

const renderList = (items) => {
  byId('count').textContent = `${items.length} / ${ALL_ITEMS.length} items`;
  byId('grid').innerHTML = items.map(renderItem).join('');
};

const applyAndRender = () => {
  const state = readState();
  const out = applyFilters(ALL_ITEMS, state);
  renderList(out);
};

const attachListeners = () => {
  ['hasStat','classMulti','effectsMulti','minHP','minMN','minMV','sortBy'].forEach(id => {
    byId(id).addEventListener('input', applyAndRender);
    byId(id).addEventListener('change', applyAndRender);
  });

  byId('resetBtn').addEventListener('click', () => {
    byId('hasStat').value = '';
    Array.from(byId('classMulti').options).forEach(o => o.selected = false);
    Array.from(byId('effectsMulti').options).forEach(o => o.selected = false);
    ['minHP','minMN','minMV'].forEach(id => byId(id).value = '');
    byId('sortBy').value = 'lvl';
    applyAndRender();
  });
};

(async function init(){
  try {
    const res = await fetch(DATA_URL, {cache:'no-store'});
    ALL_ITEMS = await res.json();

    // Example defaults (your multi-class): show DR and select Ra/Wi/Dr
    byId('hasStat').value = 'DR';
    ['Ra','Wi','Dr'].forEach(code => {
      const opt = Array.from(byId('classMulti').options).find(o => o.value === code);
      if (opt) opt.selected = true;
    });

    attachListeners();
    applyAndRender();
  } catch (e) {
    document.getElementById('count').textContent = 'Failed to load eqlist_min.json';
    console.error(e);
  }
})();
