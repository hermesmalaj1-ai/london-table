import test from 'node:test';
import assert from 'node:assert/strict';
test('app migrates dinners, submits family/allergy settings, swaps and displays a combined list',async()=>{
 const nodes=new Map(),events={},meals=['breakfast','lunch','dinner'].map(value=>({value,checked:true})),allergyInputs=[{value:'fish',checked:true}];
 function node(id){if(!nodes.has(id))nodes.set(id,{value:'',innerHTML:'',textContent:'',dataset:{},classList:{toggle(){}},addEventListener(type,fn){this[type]=fn;},showModal(){this.open=true;},close(){this.open=false;}});return nodes.get(id);}
 globalThis.document={querySelector:node,querySelectorAll(s){if(s==='input[name="meal"]')return meals;if(s==='input[name="meal"]:checked')return meals.filter(x=>x.checked);if(s==='input[name="allergy"]:checked')return allergyInputs.filter(x=>x.checked);return [];},addEventListener(type,fn){events[type]=fn;}};
 let stored=JSON.stringify({people:2,diet:'omnivore',minutes:25,budget:30,plan:[3,3,3,3,3,3,3]});globalThis.localStorage={getItem(){return stored;},setItem(k,v){stored=v;}};
 await import('../public/app.js');
 let state=JSON.parse(stored);assert.equal(state.adults,2);assert.equal(state.plan.length,21);assert.equal(state.plan[2],3);assert.match(node('#panel').innerHTML,/Breakfast/);assert.match(node('#panel').innerHTML,/Lunch/);
 node('#adults').value='2';node('#children').value='2';node('#childPortion').value='0.5';node('#budget').value='60';node('#prefs').submit({preventDefault(){}});
 state=JSON.parse(stored);assert.equal(state.children,2);assert.deepEqual(state.allergies,['fish']);assert.equal(state.plan.length,21);
 const click=b=>events.click({target:{closest(){return b;}}});click({dataset:{swap:'0'}});state=JSON.parse(stored);assert.ok(state.plan[0]>=10&&state.plan[0]<=15);
 click({dataset:{tab:'shopping'}});assert.match(node('#panel').innerHTML,/2 adults \+ 2 children/);assert.match(node('#panel').innerHTML,/data-item/);
 click({dataset:{tab:'recipes'}});assert.match(node('#recipe-results').innerHTML,/Family spaghetti bolognese/);
 events.input({target:{id:'recipe-search',value:'steak'}});assert.match(node('#recipe-results').innerHTML,/Pan-seared steak/);assert.doesNotMatch(node('#recipe-results').innerHTML,/Berry yoghurt/);
 click({dataset:{recipe:'27'}});assert.ok(node('#recipe').open);assert.match(node('#recipe-body').innerHTML,/What you’ll need/);assert.match(node('#recipe-body').innerHTML,/Equipment/);assert.match(node('#recipe-body').innerHTML,/Rest and serve/);
 click({dataset:{startCook:'27'}});assert.match(node('#recipe-body').innerHTML,/STEP 1 OF 6/);click({dataset:{cookNext:''}});assert.match(node('#cook-content').innerHTML,/STEP 2 OF 6/);
 click({dataset:{favourite:'27'}});assert.ok(JSON.parse(stored).favourites.includes(27));
 click({id:'close',dataset:{}});node('#minutes').value='60';meals.forEach(x=>x.checked=true);node('#prefs').submit({preventDefault(){}});
 click({dataset:{recipe:'26'}});node('#replace-slot').value='2';click({dataset:{place:'26'}});assert.equal(JSON.parse(stored).plan[2],26);assert.match(node('#status').textContent,/added to Monday dinner/);
 const before=stored;meals.forEach(x=>x.checked=false);node('#prefs').submit({preventDefault(){}});assert.equal(stored,before);assert.match(node('#status').textContent,/Choose at least one/);
 delete globalThis.document;delete globalThis.localStorage;
});
