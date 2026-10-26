import test from 'node:test';
import assert from 'node:assert/strict';
import {recipes,generate,shopping} from '../public/engine.js';
test('vegan plan has seven meals within cooking limit',()=>{const p=generate({diet:'vegan',minutes:25},[],()=>.5);assert.equal(p.length,7);assert.ok(p.every(id=>recipes[id].diet==='vegan'&&recipes[id].minutes<=25));});
test('vegetarian plans exclude meat and fish',()=>{assert.ok(generate({diet:'vegetarian',minutes:60}).every(id=>recipes[id].diet!=='omnivore'));});
test('shopping aggregates quantities, scales portions and excludes pantry',()=>{const items=shopping([0,0],2,['rice']);assert.equal(items.find(i=>i.name==='chickpeas').qty,800);assert.equal(items.find(i=>i.name==='chickpeas').cost,2);assert.ok(!items.some(i=>i.name==='rice'));});
test('pantry matches influence recipe selection',()=>{const p=generate({diet:'vegan',minutes:25},['rice noodles','peanut butter','peppers'],()=>.5);assert.equal(p[0],8);});
test('no eligible meals yields empty plan',()=>assert.deepEqual(generate({diet:'vegan',minutes:1}),[]));

test('fish exclusion removes salmon and variable curry paste recipes',async()=>{
 const {eligible}=await import('../public/engine.js');const ids=eligible({diet:'omnivore',minutes:60,allergies:['fish']}).map(r=>r.id);
 assert.ok(!ids.includes(4));assert.ok(!ids.includes(0));assert.ok(ids.includes(1));
});
test('multiple exclusions apply to generation and swap candidates',async()=>{
 const {eligible,recipeAllergens}=await import('../public/engine.js');const p={diet:'omnivore',minutes:60,allergies:['fish','peanuts','gluten','milk','eggs']};
 const plan=generate(p);assert.equal(plan.length,7);for(const r of eligible(p))assert.ok(!recipeAllergens(r).some(a=>p.allergies.includes(a)));
 for(const id of plan)assert.ok(!recipeAllergens(recipes[id]).some(a=>p.allergies.includes(a)));
});
test('family portions scale quantity and cost for children',async()=>{
 const {portions}=await import('../public/engine.js');assert.equal(portions({adults:2,children:2,childPortion:.5}),3);
 const items=shopping([1],portions({adults:2,children:2,childPortion:.5}));assert.equal(items.find(i=>i.name==='chicken breast').qty,450);assert.ok(Math.abs(items.reduce((s,i)=>s+i.cost,0)-9.6)<.00001);
 assert.equal(portions({adults:1,children:0,childPortion:.5}),1);
 assert.equal(portions({people:2}),2);
});
test('combined exclusions with no matches do not fall back to excluded meals',()=>{
 assert.deepEqual(generate({diet:'vegan',minutes:20,allergies:['peanuts']}),[]);
});

test('all-day plan fills 21 slots with correct recipe types',async()=>{
 const {generateWeek,mealSlots,validWeek}=await import('../public/engine.js');const p={diet:'omnivore',minutes:25,meals:['breakfast','lunch','dinner']};const plan=generateWeek(p,[],()=>.5);
 assert.equal(plan.length,21);assert.ok(validWeek(p,plan));mealSlots(p).forEach(({meal},i)=>assert.ok(recipes[plan[i]].meals.includes(meal)));
 assert.equal(shopping(plan,1).reduce((s,i)=>s+i.cost,0).toFixed(2),plan.reduce((s,id)=>s+recipes[id].cost,0).toFixed(2));
});
test('all-day exclusions apply to every filled slot and leave missing slots explicit',async()=>{
 const {generateWeek,mealSlots,recipeAllergens,validWeek}=await import('../public/engine.js');const p={diet:'vegan',minutes:25,meals:['breakfast','lunch','dinner'],allergies:['gluten','peanuts','fish','milk','eggs','soya','sesame','sulphites']};const plan=generateWeek(p);
 assert.ok(validWeek(p,plan));assert.equal(plan.length,21);mealSlots(p).forEach(({meal},i)=>{if(plan[i]===null)return;const r=recipes[plan[i]];assert.ok(r.meals.includes(meal));assert.ok(!recipeAllergens(r).some(a=>p.allergies.includes(a)));});assert.ok(plan.some(id=>id===null));
});
test('selected meals only generate requested slots; old dinner plans are invalid full weeks',async()=>{
 const {generateWeek,mealSlots,validWeek}=await import('../public/engine.js');const p={diet:'omnivore',minutes:25,meals:['breakfast','dinner']};assert.equal(generateWeek(p).length,14);assert.equal(mealSlots(p)[1].meal,'dinner');assert.equal(validWeek(p,generate(p)),false);assert.equal(generateWeek({...p,meals:[]}).length,0);
});
test('combined list aggregates shared breakfast/lunch ingredients and respects family pantry',async()=>{
 const {portions}=await import('../public/engine.js');const items=shopping([10,13],portions({adults:2,children:2,childPortion:.5}),['water']);assert.equal(items.find(i=>i.name==='oats').qty,300);assert.ok(!items.some(i=>i.name==='water'));
});

test('mixed diets include visible meat dinners at 25 and 60 minutes even with plant pantry bias',async()=>{
 const {generateWeek,mealSlots}=await import('../public/engine.js');
 for(const minutes of [25,60])for(const random of [()=>0,()=>.99]){
  const p={diet:'omnivore',minutes,meals:['breakfast','lunch','dinner'],allergies:['fish','milk','gluten']};
  const pantry=['chickpeas','spinach','rice','chopped tomatoes','lentils','onion','olive oil','butter beans'];
  const plan=generateWeek(p,pantry,random),slots=mealSlots(p);
  for(const day of [0,3])assert.equal(recipes[plan[slots.findIndex(s=>s.day===day&&s.meal==='dinner')]].protein,'meat');
  assert.equal(recipes[plan[slots.findIndex(s=>s.day===1&&s.meal==='lunch')]].protein,'meat');
 }
});
test('meat variety fix preserves vegetarian, vegan, allergy and no-match behaviour',async()=>{
 const {generateWeek,recipeAllergens}=await import('../public/engine.js');
 for(const diet of ['vegetarian','vegan']){
  const p={diet,minutes:25,meals:['breakfast','lunch','dinner'],allergies:['gluten','milk']};
  const plan=generateWeek(p);for(const id of plan){if(id===null)continue;assert.ok(!['meat','fish'].includes(recipes[id].protein));assert.ok(!recipeAllergens(recipes[id]).some(a=>p.allergies.includes(a)));}
 }
 const plan=generateWeek({diet:'omnivore',minutes:10,meals:['dinner']});assert.ok(plan.every(id=>id===null));
});

test('every recipe includes a complete structured cooking guide and consistent timings',()=>{
 assert.equal(recipes.length,34);
 for(const r of recipes){assert.ok(r.guide.equipment.length>=2,r.name);assert.ok(r.guide.steps.length>=5,r.name);assert.equal(r.minutes,r.guide.prep+r.guide.cook);for(const s of r.guide.steps){assert.ok(s.title.length>4);assert.ok(s.text.length>65,r.name+': '+s.title);}}
 for(const name of ['Family spaghetti bolognese','Pan-seared steak, garlic potatoes & green beans'])assert.ok(recipes.some(r=>r.name===name));
});
test('bolognese has gluten screening and is preferred only within allowed time',async()=>{
 const {eligible,generateWeek}=await import('../public/engine.js');const p={diet:'omnivore',minutes:60,meals:['dinner'],favourites:[26]};assert.equal(generateWeek(p,[],()=>0)[0],26);assert.ok(!eligible({...p,allergies:['gluten']}).some(r=>r.id===26));assert.ok(!eligible({...p,minutes:25}).some(r=>r.id===26));
});
test('overnight recipes show a separate waiting requirement and tap water is not a purchase',()=>{
 const oats=recipes.find(r=>r.name==='Apple & yoghurt overnight oats');assert.match(oats.wait,/6 hours/);assert.ok(!shopping([oats.id],1).some(i=>i.name==='water'));
});
