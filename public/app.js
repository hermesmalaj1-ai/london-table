import {recipes,eligible,generate,shopping,allergens,recipeAllergens,portions,mealTypes,mealSlots,generateWeek,validWeek} from './engine.js';
const $=s=>document.querySelector(s),money=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(n);
const defaults={adults:1,children:0,childPortion:1,allergies:[],meals:['breakfast','lunch','dinner'],planVersion:4,diet:'omnivore',minutes:25,budget:30,store:'Tesco',pantry:[],checked:[],plan:[]};
let state={...defaults},tab='plan';
try{
 const saved=JSON.parse(localStorage.getItem('london-table-v1'));
 if(saved&&typeof saved==='object'){
  state={...defaults,...saved,planVersion:saved.planVersion||1};
  state.adults=Math.max(1,Math.min(8,Math.floor(Number(saved.adults ?? saved.people)||1)));
  state.children=Math.max(0,Math.min(8,Math.floor(Number(saved.children)||0)));
  state.childPortion=[0.5,0.75,1].includes(Number(saved.childPortion))?Number(saved.childPortion):1;
  for(const key of ['pantry','checked','plan','allergies'])if(!Array.isArray(state[key]))state[key]=[];
  state.allergies=state.allergies.filter(a=>allergens.some(([id])=>id===a));
  if(!['omnivore','vegan','vegetarian'].includes(state.diet))state.diet='omnivore';
  if(![25,35,60].includes(Number(state.minutes)))state.minutes=25;
  state.budget=Math.max(1,Math.min(1000,Number(state.budget)||30));
 }
}catch{}
// Revalidate stored plans: an old or swapped meal cannot bypass current exclusions.
state.meals=Array.isArray(state.meals)?mealTypes.filter(m=>state.meals.includes(m)):mealTypes;
if(!state.meals.length)state.meals=[...mealTypes];
if(state.planVersion!==4||!validWeek(state,state.plan)){
 const old=state.planVersion!==4&&state.plan.length===7?[...state.plan]:null;
 state.plan=generateWeek(state,state.pantry);
 if(old)mealSlots(state).forEach(({day,meal},i)=>{if(meal==='dinner'&&eligible(state,meal).some(r=>r.id===old[day]))state.plan[i]=old[day];});
 state.checked=[];
}
state.planVersion=4;
document.querySelectorAll('input[name="meal"]').forEach(el=>el.checked=state.meals.includes(el.value));
for(const k of ['adults','children','childPortion','diet','minutes','budget','store'])$('#'+k).value=state[k];
$('#allergy-options').innerHTML=allergens.map(([id,label])=>`<label class="allergy-option"><input type="checkbox" name="allergy" value="${id}" ${state.allergies.includes(id)?'checked':''}>${label}</label>`).join('');
function household(){return `${state.adults} ${state.adults===1?'adult':'adults'}${state.children?` + ${state.children} ${state.children===1?'child':'children'} (${state.childPortion===1?'full':state.childPortion===0.75?'¾':'½'} portion each)`:''}`;}
function allergyNote(){return state.allergies.length?`Avoiding: ${state.allergies.map(a=>allergens.find(([id])=>id===a)[1]).join(', ')}.`:'';}
function updateChildField(){$('#child-portion-label').hidden=Number($('#children').value)===0;}
updateChildField();
$('#children').addEventListener('change',updateChildField);
function save(){try{localStorage.setItem('london-table-v1',JSON.stringify(state));}catch{$('#status').textContent='Browser storage is unavailable. Keep this tab open to retain your plan.';}}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function list(){return shopping(state.plan,portions(state),state.pantry);}
function render(){const items=list(),total=items.reduce((s,i)=>s+i.cost,0);$('#count').textContent=items.length;document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
const summary=`<div class="summary"><div><h2>${tab==='plan'?'Your whole week, sorted.':tab==='shopping'?'One list. Less wandering.':'Start with what you have.'}</h2><p>${tab==='pantry'?'Tap ingredients you already have enough of for this week.':`${household()} · ${state.meals.map(m=>m[0].toUpperCase()+m.slice(1)).join(', ')} · ${esc(state.store)}`}</p></div>${tab!=='pantry'?`<div class="price">${money(total)}<small>estimated ingredients used</small></div>`:''}</div>`;
let content='';if(tab==='plan'){
 const missing=state.plan.filter(id=>id===null).length;
 const budgetText=missing?'This is a partial plan. Costs exclude unfilled meals.':total>state.budget?`This plan is ${money(total-state.budget)} over your food budget. Try cheaper swaps or use pantry ingredients.`:`${money(state.budget-total)} below your ${money(state.budget)} food budget.`;
 const slots=mealSlots(state);
 content=`<div class="notice">${budgetText} Estimates exclude full pack purchases, delivery and offers.</div>${missing?'<div class="notice">Some meal slots have no matching recipes. Allergy exclusions have been kept. Try a longer cooking time; never remove an allergy just to fill a slot.</div>':''}<div class="week-days">${Array.from({length:7},(_,day)=>`<section class="day-group"><h3>${['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][day]}</h3><div class="day-meals">${slots.map((slot,i)=>({...slot,i})).filter(slot=>slot.day===day).map(({meal,i})=>{
 const r=recipes[state.plan[i]],label=meal[0].toUpperCase()+meal.slice(1);
 if(!r)return `<article class="meal empty-meal"><div><span class="day">${label}</span><h3>No matching recipe</h3><p>Your allergy and diet exclusions have been preserved.</p></div></article>`;
 return `<article class="meal"><div class="food" aria-hidden="true">${r.emoji}</div><div><span class="day">${label}</span><h3>${r.name}</h3><span class="protein-badge">${r.protein==='meat'?'Meat':r.protein==='fish'?'Fish':r.diet==='vegan'?'Vegan':'Vegetarian'}</span><p>${r.minutes} min · ~${r.kcal} kcal / full portion · ${money(r.cost*portions(state))}</p><div class="actions"><button data-recipe="${r.id}">View recipe</button><button data-swap="${i}" aria-label="Swap ${label}: ${r.name}">↻ Swap</button></div></div></article>`;
 }).join('')}</div></section>`).join('')}</div>`;
}else if(tab==='shopping'){content=`<div class="tools"><button id="download">↓ Download list</button><button id="uncheck">Clear ticks</button></div><div class="list">${items.length?items.map(i=>`<label class="${state.checked.includes(i.name)?'checked':''}"><input type="checkbox" data-item="${esc(i.name)}" ${state.checked.includes(i.name)?'checked':''}><span>${esc(i.name)}</span><span class="quantity">${Math.round(i.qty*10)/10} ${i.unit}</span></label>`).join(''):state.plan.every(id=>id===null)?'No ingredients yet: no recipes match these settings.':'Everything is covered by your pantry.'}</div><p class="muted">${state.plan.some(id=>id===null)?'Partial list: unfilled meals have no ingredients or costs included. ':''}Pantry items are excluded. Buy enough for the week; estimates reflect quantities used, not supermarket pack prices.</p>`;
}else{const names=[...new Set(recipes.flatMap(r=>r.ingredients.map(i=>i[0])))].sort();content=`<p class="muted">Selected ingredients are removed from your shopping list and prioritised when you generate a plan. Selection means you have the full weekly quantity.</p><div class="pantry-grid">${names.map(n=>`<button class="chip ${state.pantry.includes(n)?'selected':''}" data-pantry="${n}" aria-pressed="${state.pantry.includes(n)}">${state.pantry.includes(n)?'✓ ': '+ '}${n}</button>`).join('')}</div>`;}
$('#panel').innerHTML=summary+(state.allergies.length?`<p class="muted">${esc(allergyNote())} Check product labels and cross-contact.</p>`:'')+content;save();}
$('#prefs').addEventListener('submit',e=>{e.preventDefault();const selectedMeals=[...document.querySelectorAll('input[name="meal"]:checked')].map(el=>el.value);if(!selectedMeals.length){$('#status').textContent='Choose at least one meal: breakfast, lunch or dinner.';return;}for(const k of ['adults','children','childPortion','minutes','budget'])state[k]=Number($('#'+k).value);for(const k of ['diet','store'])state[k]=$('#'+k).value;state.allergies=[...document.querySelectorAll('input[name="allergy"]:checked')].map(el=>el.value);state.meals=selectedMeals;state.plan=generateWeek(state,state.pantry);state.checked=[];tab='plan';$('#status').textContent=state.plan.some(id=>id===null)?'Some meals have no matching recipes. Your exclusions have not been relaxed.':'Your new week is ready. Swap any meal to make it yours.';render();});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.tab){tab=b.dataset.tab;render();}if(b.dataset.swap!==undefined){const i=Number(b.dataset.swap),slot=mealSlots(state)[i],pool=eligible(state,slot.meal).filter(r=>r.id!==state.plan[i]);if(!pool.length){$('#status').textContent='No other recipes fit these settings. Increase your cooking time for more choices.';return;}const unused=pool.filter(r=>!state.plan.includes(r.id));state.plan[i]=(unused.length?unused:pool)[Math.floor(Math.random()*(unused.length||pool.length))].id;state.checked=[];render();}if(b.dataset.pantry){const n=b.dataset.pantry;state.pantry=state.pantry.includes(n)?state.pantry.filter(x=>x!==n):[...state.pantry,n];state.checked=[];render();}if(b.dataset.recipe!==undefined){const r=recipes[Number(b.dataset.recipe)];$('#recipe-body').innerHTML=`<div style="font-size:55px">${r.emoji}</div><h2>${r.name}</h2><p class="muted">${r.minutes} minutes · ${household()} · ~${r.kcal} kcal per full portion</p><p class="muted">Recipe allergen flags (including variable ingredients): ${recipeAllergens(r).map(a=>allergens.find(([id])=>id===a)[1]).join(", ")||"None identified in the listed ingredients"}. Check product labels; cross-contact is not assessed.</p><h3>Ingredients</h3><ul>${r.ingredients.map(([n,q,u])=>`<li>${Math.round(q*portions(state)*10)/10} ${u} ${n}</li>`).join('')}</ul><h3>Let’s cook</h3><ol>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol><p class="muted">Check all labels for allergens and follow ingredient packet instructions.</p>`;$('#recipe').showModal();}if(b.id==='close')$('#recipe').close();if(b.id==='uncheck'){state.checked=[];render();}if(b.id==='download'){const text=`London Table — ${state.store}\n${state.meals.join(', ')} ingredients for ${household()}\n${allergyNote()}\n\n`+list().map(i=>`${state.checked.includes(i.name)?'[x]':'[ ]'} ${i.name}: ${Math.round(i.qty*10)/10} ${i.unit}`).join('\n')+(state.plan.some(id=>id===null)?'\n\nPartial list: unfilled meals excluded.':'')+'\n\nCosts are illustrative; check shop prices and pack sizes.';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download='london-table-shopping.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}});
document.addEventListener('change',e=>{if(e.target.dataset.item){const n=e.target.dataset.item;state.checked=state.checked.filter(x=>x!==n);if(e.target.checked)state.checked.push(n);render();}});
render();
