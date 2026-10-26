import {recipes,eligible,shopping,allergens,recipeAllergens,portions,mealTypes,mealSlots,generateWeek,validWeek} from './engine.js';
const $=s=>document.querySelector(s),money=n=>new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP'}).format(n);
const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const title=s=>s[0].toUpperCase()+s.slice(1);
const defaults={adults:1,children:0,childPortion:1,allergies:[],favourites:[],meals:[...mealTypes],planVersion:4,diet:'omnivore',minutes:35,budget:30,store:'Tesco',pantry:[],checked:[],plan:[]};
let state={...defaults},tab='plan',viewDay=-1,search='',category='all',openRecipe=null,cookStep=null;
try{
 const saved=JSON.parse(localStorage.getItem('london-table-v1'));
 if(saved&&typeof saved==='object'){
  state={...defaults,...saved,planVersion:saved.planVersion||1};
  state.adults=Math.max(1,Math.min(8,Math.floor(Number(saved.adults??saved.people)||1)));
  state.children=Math.max(0,Math.min(8,Math.floor(Number(saved.children)||0)));
  state.childPortion=[.5,.75,1].includes(Number(saved.childPortion))?Number(saved.childPortion):1;
  for(const key of ['pantry','checked','plan','allergies','favourites'])if(!Array.isArray(state[key]))state[key]=[];
  state.allergies=state.allergies.filter(a=>allergens.some(([id])=>id===a));
  state.favourites=state.favourites.filter(id=>recipes.some(r=>r.id===id));
  if(!['omnivore','vegetarian','vegan'].includes(state.diet))state.diet='omnivore';
  if(![25,35,60,90].includes(Number(state.minutes)))state.minutes=35;
  state.budget=Math.max(1,Math.min(1000,Number(state.budget)||30));
 }
}catch{}
state.meals=Array.isArray(state.meals)?mealTypes.filter(m=>state.meals.includes(m)):[...mealTypes];
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
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function household(){return `${state.adults} ${state.adults===1?'adult':'adults'}${state.children?` + ${state.children} ${state.children===1?'child':'children'} (${state.childPortion===1?'full':state.childPortion===.75?'¾':'½'} portion each)`:''}`;}
function allergyNote(){return state.allergies.length?`Avoiding: ${state.allergies.map(a=>allergens.find(([id])=>id===a)[1]).join(', ')}.`:'';}
function save(){try{localStorage.setItem('london-table-v1',JSON.stringify(state));}catch{$('#status').textContent='Browser storage is unavailable. Keep this tab open to retain your plan.';}}
function status(text){$('#status').textContent=text;}
function updateChildField(){$('#child-portion-label').hidden=Number($('#children').value)===0;}
updateChildField();$('#children').addEventListener('change',updateChildField);
function list(){return shopping(state.plan,portions(state),state.pantry);}
function badge(r){return r.protein==='meat'?'Meat':r.protein==='fish'?'Fish':r.diet==='vegan'?'Vegan':'Vegetarian';}
function compatibleRecipes(){return recipes.filter(r=>r.meals.some(meal=>eligible({...state,minutes:Infinity},meal).some(option=>option.id===r.id)));}
function recipeCard(r,meal,index=null){
 const liked=state.favourites.includes(r.id);
 return `<article class="meal"><div class="meal-cover ${meal}"><span class="cover-label">${title(meal)}</span><span class="food" aria-hidden="true">${r.emoji}</span><button class="favourite ${liked?'selected':''}" data-favourite="${r.id}" aria-pressed="${liked}" aria-label="${liked?'Remove':'Save'} ${esc(r.name)} ${liked?'from':'to'} favourites">${liked?'♥':'♡'}</button></div><div class="meal-body"><h3>${esc(r.name)}</h3><span class="protein-badge">${badge(r)}</span><p class="meal-meta">${r.minutes} min${r.wait?' + chilling':''} · ${money(r.cost*portions(state))} est.</p>${index===null?`<p>${esc(r.description)}</p>`:''}<div class="actions"><button data-recipe="${r.id}">View recipe</button>${index===null?'':`<button data-swap="${index}" aria-label="Swap ${esc(r.name)}">↻ Swap</button>`}</div></div></article>`;
}
function render(){
 const items=list(),total=items.reduce((s,i)=>s+i.cost,0),missing=state.plan.some(id=>id===null);
 $('#count').textContent=items.length;
 document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));
 const headings={plan:'A good week, on the menu.',recipes:'Find your next favourite.',shopping:'One list. A simpler shop.',pantry:'Good things already at home.'};
 const summary=`<div class="summary"><div><h2>${headings[tab]}</h2><p>${tab==='recipes'?`${recipes.length} original recipes · Save favourites with ♡`:tab==='pantry'?'Tap ingredients you already have enough of for the whole week.':`${household()} · ${state.meals.map(title).join(', ')} · ${esc(state.store)}`}</p></div>${['plan','shopping'].includes(tab)?`<div class="price">${money(total)}<small>${missing?'partial estimate':'ingredients used, est.'}</small></div>`:''}</div>`;
 let content='';
 if(tab==='plan'){
  const budgetText=missing?'Partial plan: unfilled meals are excluded from this total.':total>state.budget?`${money(total-state.budget)} over your ${money(state.budget)} budget. Try cheaper swaps or use pantry ingredients.`:`${money(state.budget-total)} below your ${money(state.budget)} budget.`;
  const slots=mealSlots(state);
  const picks=compatibleRecipes().filter(r=>[26,27].includes(r.id));
  content=`<div class="notice ${total>state.budget||missing?'warning':''}">${budgetText} Estimates cover ingredients used, not full packs, delivery or offers.</div>${missing?'<div class="notice warning">Some meals have no matching recipe. Your exclusions are kept. Try a longer cooking time; never remove an allergy to fill a slot.</div>':''}<div class="week-controls" aria-label="Choose a day"><button class="day-filter ${viewDay===-1?'active':''}" data-day="-1" aria-pressed="${viewDay===-1}">Full week</button>${days.map((d,i)=>`<button class="day-filter ${viewDay===i?'active':''}" data-day="${i}" aria-pressed="${viewDay===i}">${d.slice(0,3)}</button>`).join('')}</div><div class="week-days">${days.map((day,d)=>viewDay!==-1&&viewDay!==d?'':`<section class="day-group"><div class="day-heading"><h3>${day}</h3><span>${state.meals.length} meals</span></div><div class="day-meals">${slots.map((slot,i)=>({...slot,i})).filter(slot=>slot.day===d).map(({meal,i})=>{const r=recipes[state.plan[i]];return r?recipeCard(r,meal,i):`<article class="meal empty-meal"><div class="meal-body"><span class="protein-badge">${title(meal)}</span><h3>No matching recipe</h3><p>Your diet and allergy exclusions are preserved.</p></div></article>`;}).join('')}</div></section>`).join('')}</div>${picks.length?`<div class="quick-picks"><p>Something to look forward to.</p><div>${picks.map(r=>`<button data-recipe="${r.id}">${r.emoji} ${esc(r.name)} · ${r.minutes} min ↗</button>`).join('')}<button data-tab="recipes">Explore the recipe book ↗</button></div><small>Longer recipes are available in the recipe book. Your plan still respects your cooking-time limit.</small></div>`:''}`;
 }else if(tab==='recipes'){
  content=`<p class="cookbook-note">A collection of proper family favourites and everyday meals. Recipes shown match your saved diet and allergy exclusions. Longer recipes are shown here too; your weekly plan still follows your time limit. Saved favourites are prioritised when you next generate a plan.</p><div class="recipe-toolbar"><input id="recipe-search" type="search" aria-label="Search recipes" placeholder="Try bolognese, steak, chicken…" value="${esc(search)}"><select id="recipe-category" aria-label="Filter recipes by meal"><option value="all">All meals</option>${mealTypes.map(m=>`<option value="${m}" ${category===m?'selected':''}>${title(m)}</option>`).join('')}<option value="saved" ${category==='saved'?'selected':''}>Favourites</option></select></div><div id="recipe-results"></div>`;
 }else if(tab==='shopping'){
  content=`<div class="tools"><button id="download">↓ Download list</button><button id="uncheck">Clear ticks</button></div>${missing?'<div class="notice warning">Partial list: unfilled meals have no ingredients or costs included.</div>':''}<div class="list">${items.length?items.map(i=>`<label class="${state.checked.includes(i.name)?'checked':''}"><input type="checkbox" data-item="${esc(i.name)}" ${state.checked.includes(i.name)?'checked':''}><span class="item-name">${esc(i.name)}</span><span class="quantity">${Math.round(i.qty*10)/10} ${i.unit}</span></label>`).join(''):state.plan.every(id=>id===null)?'No ingredients yet: no recipes match these settings.':'Your pantry covers all the ingredients.'}</div><p class="muted">Pantry ingredients are excluded. Costs are estimates for quantities used; supermarket pack prices will differ. Check labels and cross-contact information when shopping.</p>`;
 }else{
  const names=[...new Set(recipes.flatMap(r=>r.ingredients.map(i=>i[0])))].filter(n=>n!=='water').sort();
  content=`<p class="cookbook-note">Select an ingredient only if you have enough for the full week. It will be removed from the shopping list and prioritised in future plans.</p><div class="pantry-grid">${names.map(n=>`<button class="chip ${state.pantry.includes(n)?'selected':''}" data-pantry="${esc(n)}" aria-pressed="${state.pantry.includes(n)}">${state.pantry.includes(n)?'✓ ': '+ '}${esc(n)}</button>`).join('')}</div>`;
 }
 $('#panel').innerHTML=summary+(state.allergies.length?`<p class="allergen-note">${esc(allergyNote())} Always check product labels and cross-contact.</p>`:'')+content;
 if(tab==='recipes')renderLibrary();save();
}
function renderLibrary(){
 const candidates=compatibleRecipes().filter(r=>(category==='all'||(category==='saved'?state.favourites.includes(r.id):r.meals.includes(category)))&&`${r.name} ${r.ingredients.map(i=>i[0]).join(' ')}`.toLowerCase().includes(search.toLowerCase()));
 const featured=candidates.filter(r=>[26,27,28,29].includes(r.id)),others=candidates.filter(r=>!featured.includes(r));
 $('#recipe-results').innerHTML=`<p class="library-count">${candidates.length} ${candidates.length===1?'recipe':'recipes'} matching your preferences</p>${featured.length?`<div class="section-label">FAMILY FAVOURITES</div><div class="recipe-grid">${featured.map(r=>recipeCard(r,r.meals[0])).join('')}</div>`:''}${others.length?`<div class="section-label">EVERYDAY INSPIRATION</div><div class="recipe-grid">${others.map(r=>recipeCard(r,r.meals[0])).join('')}</div>`:''}${!candidates.length?'<div class="result-empty">No recipes match this search and your exclusions. Try a different search or meal filter; keep any allergy exclusions you need.</div>':''}`;
}
function storageNote(r){return r.ingredients.some(([n])=>n==='rice'||n==='risotto rice')?'If saving cooked rice, cool it quickly, ideally within 1 hour, refrigerate and use within 24 hours. Reheat only once until steaming hot.':'For cooked leftovers, cool and refrigerate within 2 hours. Eat within 48 hours or freeze. Reheat only once until steaming hot throughout.';}
function showRecipe(id,keepOpen=false){
 const r=recipes[id];if(!r)return;openRecipe=id;const g=r.guide,flags=recipeAllergens(r),slots=mealSlots(state).map((slot,i)=>({...slot,i})).filter(slot=>r.meals.includes(slot.meal));
 const canPlace=slots.length&&slots.some(slot=>eligible(state,slot.meal).some(recipe=>recipe.id===id));
 $('#recipe-body').innerHTML=`<div class="recipe-header"><span class="eyebrow">${r.emoji} ${badge(r)} · ${r.meals.map(title).join(' / ')}</span><h2 id="recipe-title">${esc(r.name)}</h2><p>${esc(r.description)}</p><div class="recipe-stats"><span><strong>${g.prep} min</strong>preparation</span><span><strong>${g.cook} min</strong>cooking</span><span><strong>${money(r.cost*portions(state))}</strong>household estimate</span><span><strong>~${r.kcal} kcal</strong>per full portion</span></div>${r.wait?`<p><strong>Plan ahead:</strong> ${esc(r.wait)} in addition to active preparation time.</p>`:''}</div><div class="recipe-main"><p class="muted">Ingredients scaled for ${household()} (${portions(state)} full portions). Timings are estimates; larger batches may need extra time and pans.</p><div class="recipe-controls"><button data-start-cook="${r.id}">${cookStep===null?'▶ Start step-by-step cooking':'Show full method'}</button><button data-favourite="${r.id}">${state.favourites.includes(r.id)?'♥ Saved favourite':'♡ Save favourite'}</button></div><div class="recipe-layout"><section class="ingredients"><h3>What you’ll need</h3><div class="ingredient-list">${r.ingredients.map(([n,q,u])=>`<label><input type="checkbox" aria-label="Prepared ${esc(n)}"><span><span class="ingredient-qty">${Math.round(q*portions(state)*10)/10} ${u}</span>${esc(n)}</span></label>`).join('')}</div><div class="equipment"><strong>Equipment</strong>${g.equipment.map(esc).join(' · ')}</div></section><section><div id="cook-content">${cookStep===null?`<h3>Let’s cook</h3><ol class="method">${g.steps.map(step=>`<li><h4>${esc(step.title)}</h4><p>${esc(step.text)}</p></li>`).join('')}</ol>`:cookView(r)}</div><div class="recipe-note"><strong>A little help in the kitchen</strong>${esc(g.tip)}</div></section></div><div class="recipe-note"><strong>Save it safely</strong>${r.wait?'Keep chilled and use within 24 hours of preparation.':g.cook===0?'Keep perishable ingredients chilled until needed and follow their use-by dates.':esc(storageNote(r))}</div><p class="allergen-note"><strong>Recipe allergen flags:</strong> ${flags.map(a=>allergens.find(([id])=>id===a)[1]).join(', ')||'None identified in the listed ingredients'}. Compound ingredients can vary. Check actual product labels, “may contain” information and cross-contact. This is not an allergen-free guarantee.</p>${slots.length?`<div class="place-recipe"><label>Use this meal in your week<select id="replace-slot">${slots.map(slot=>`<option value="${slot.i}">${days[slot.day]} · ${title(slot.meal)}</option>`).join('')}</select></label><button data-place="${r.id}" ${canPlace?'':'disabled'}>Add to my week ↗</button></div>${!canPlace?`<p class="muted">This recipe needs ${r.minutes} minutes. Update and apply your cooking-time preference to plan this meal, while keeping your diet and allergy exclusions.</p>`:''}`:'<p class="muted">Select this meal type in your preferences before adding it to your week.</p>'}<p class="muted">Cooking safety reference: <a href="https://www.food.gov.uk/safety-hygiene/cooking-your-food" target="_blank" rel="noopener noreferrer">Food Standards Agency</a>. Recipes are original guides and have not been kitchen-tested by us.</p></div>`;
 if(!keepOpen)$('#recipe').showModal();
}
function cookView(r){const last=cookStep===r.guide.steps.length,step=r.guide.steps[cookStep];return `<div class="cook-panel"><span class="cook-progress">${last?'READY TO SERVE':`STEP ${cookStep+1} OF ${r.guide.steps.length}`}</span><progress value="${last?r.guide.steps.length:cookStep+1}" max="${r.guide.steps.length}" aria-label="Cooking step progress"></progress><h3>${last?'Time to gather around.':esc(step.title)}</h3><p>${last?'Check the food is cooked as described, serve at a comfortable temperature, and enjoy your meal.':esc(step.text)}</p><div class="recipe-controls"><button data-cook-back ${cookStep===0?'disabled':''}>← Previous</button><button data-cook-next ${last?'disabled':''}>${cookStep===r.guide.steps.length-1?'Finish cooking':'Next step'} →</button></div></div>`;}
$('#prefs').addEventListener('submit',e=>{
 e.preventDefault();const selectedMeals=[...document.querySelectorAll('input[name="meal"]:checked')].map(el=>el.value);
 if(!selectedMeals.length){status('Choose at least one meal: breakfast, lunch or dinner.');return;}
 for(const k of ['adults','children','childPortion','minutes','budget'])state[k]=Number($('#'+k).value);
 for(const k of ['diet','store'])state[k]=$('#'+k).value;
 state.allergies=[...document.querySelectorAll('input[name="allergy"]:checked')].map(el=>el.value);state.meals=selectedMeals;
 state.plan=generateWeek(state,state.pantry);state.checked=[];tab='plan';viewDay=-1;
 status(state.plan.some(id=>id===null)?'Some meal slots have no matching recipe. Your exclusions are preserved.':'Your new week is ready. Swap a meal or explore the recipe book to make it yours.');render();
});
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b||b.disabled)return;
 if(b.dataset.tab){tab=b.dataset.tab;render();}
 if(b.dataset.day!==undefined){viewDay=Number(b.dataset.day);render();}
 if(b.dataset.recipe!==undefined){cookStep=null;showRecipe(Number(b.dataset.recipe));}
 if(b.dataset.swap!==undefined){const i=Number(b.dataset.swap),slot=mealSlots(state)[i],pool=eligible(state,slot.meal).filter(r=>r.id!==state.plan[i]);if(!pool.length){status('No other recipes fit these settings. Try a longer cooking time; keep your allergy exclusions.');return;}const unused=pool.filter(r=>!state.plan.includes(r.id));const choices=unused.length?unused:pool;state.plan[i]=choices[Math.floor(Math.random()*choices.length)].id;state.checked=[];render();}
 if(b.dataset.favourite!==undefined){const id=Number(b.dataset.favourite);state.favourites=state.favourites.includes(id)?state.favourites.filter(x=>x!==id):[...state.favourites,id];save();render();if(openRecipe!==null)showRecipe(openRecipe,true);status('Favourites updated. They are prioritised the next time you make a plan.');}
 if(b.dataset.pantry){const n=b.dataset.pantry;state.pantry=state.pantry.includes(n)?state.pantry.filter(x=>x!==n):[...state.pantry,n];state.checked=[];render();}
 if(b.dataset.startCook!==undefined){cookStep=cookStep===null?0:null;showRecipe(Number(b.dataset.startCook),true);}
 if(b.dataset.cookNext!==undefined){const r=recipes[openRecipe];cookStep=Math.min(r.guide.steps.length,cookStep+1);$('#cook-content').innerHTML=cookView(r);}
 if(b.dataset.cookBack!==undefined){cookStep=Math.max(0,cookStep-1);$('#cook-content').innerHTML=cookView(recipes[openRecipe]);}
 if(b.dataset.place!==undefined){const id=Number(b.dataset.place),i=Number($('#replace-slot').value),slot=mealSlots(state)[i];if(!slot||!eligible(state,slot.meal).some(r=>r.id===id)){status('This recipe does not fit the current plan preferences.');return;}state.plan[i]=id;state.checked=[];tab='plan';viewDay=slot.day;$('#recipe').close();openRecipe=null;cookStep=null;status(`${recipes[id].name} added to ${days[slot.day]} ${slot.meal}. Your shopping list has been updated.`);render();}
 if(b.id==='close'){$('#recipe').close();openRecipe=null;cookStep=null;}
 if(b.id==='uncheck'){state.checked=[];render();}
 if(b.id==='download'){const text=`London Table — ${state.store}\n${state.meals.join(', ')} ingredients for ${household()}\n${allergyNote()}\n\n`+list().map(i=>`${state.checked.includes(i.name)?'[x]':'[ ]'} ${i.name}: ${Math.round(i.qty*10)/10} ${i.unit}`).join('\n')+(state.plan.some(id=>id===null)?'\n\nPartial list: unfilled meals excluded.':'')+'\n\nCosts are illustrative; check shop prices and pack sizes. Check all product allergen labels.';const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:'text/plain'}));a.download='london-table-shopping.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
});
document.addEventListener('change',e=>{
 if(e.target.dataset.item){const n=e.target.dataset.item;state.checked=state.checked.filter(x=>x!==n);if(e.target.checked)state.checked.push(n);render();}
 if(e.target.id==='recipe-category'){category=e.target.value;renderLibrary();}
});
document.addEventListener('input',e=>{if(e.target.id==='recipe-search'){search=e.target.value;renderLibrary();}});
$('#recipe').addEventListener('close',()=>{openRecipe=null;cookStep=null;});
render();
