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
 const before=stored;meals.forEach(x=>x.checked=false);node('#prefs').submit({preventDefault(){}});assert.equal(stored,before);assert.match(node('#status').textContent,/Choose at least one/);
 delete globalThis.document;delete globalThis.localStorage;
});
