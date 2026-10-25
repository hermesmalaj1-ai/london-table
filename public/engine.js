// Original recipes; prices and nutrition are illustrative estimates per serving.
export const recipes = [
['Chickpea & spinach curry','vegan',25,580,2.1,[['chickpeas',200,'g',0.5],['spinach',80,'g',0.4],['rice',75,'g',0.2],['chopped tomatoes',200,'g',0.4],['curry paste',30,'g',0.6]],['Cook the rice following its packet instructions.','Simmer chickpeas, tomatoes and curry paste for 15 minutes.','Stir in spinach until wilted and serve with rice.'],'🍛'],
['Lemon chicken traybake','omnivore',35,620,3.2,[['chicken breast',150,'g',1.6],['potatoes',200,'g',0.4],['broccoli',100,'g',0.5],['lemon',0.5,'each',0.3],['olive oil',15,'ml',0.4]],['Heat the oven to 200°C fan. Chop potatoes into small pieces and toss with oil.','Roast potatoes for 15 minutes, then add chicken, broccoli and lemon juice.','Roast until chicken is cooked through; its centre must reach 75°C.'],'🍋'],
['Roasted veg & feta couscous','vegetarian',25,540,2.5,[['couscous',80,'g',0.3],['courgette',150,'g',0.5],['peppers',150,'g',0.7],['feta',50,'g',0.7],['olive oil',10,'ml',0.3]],['Dice vegetables, toss in oil and roast at 200°C fan for 20 minutes.','Prepare couscous following its packet instructions.','Combine with the vegetables and crumble over feta.'],'🥗'],
['Tomato & lentil pasta','vegan',25,610,1.8,[['pasta',90,'g',0.2],['lentils',150,'g',0.5],['chopped tomatoes',200,'g',0.4],['onion',100,'g',0.2],['olive oil',10,'ml',0.5]],['Soften chopped onion in oil.','Add cooked, drained lentils and tomatoes; simmer for 15 minutes.','Cook pasta following the packet instructions, drain and stir into sauce.'],'🍝'],
['Salmon rice bowl','omnivore',25,650,4.2,[['salmon',150,'g',2.7],['rice',75,'g',0.2],['broccoli',100,'g',0.5],['soy sauce',15,'ml',0.3],['carrots',100,'g',0.5]],['Cook rice following its packet instructions.','Bake salmon at 180°C fan until fully cooked and opaque throughout.','Steam vegetables and serve with rice, salmon and soy sauce.'],'🍚'],
['Smoky bean jacket potato','vegan',50,520,1.6,[['potatoes',300,'g',0.5],['kidney beans',200,'g',0.5],['chopped tomatoes',150,'g',0.3],['smoked paprika',3,'g',0.3]],['Prick potatoes and bake at 200°C fan until tender, about 45–60 minutes.','Simmer drained cooked beans, tomatoes and paprika for 15 minutes.','Split the potatoes and spoon the beans over.'],'🥔'],
['Mushroom & pea risotto','vegan',30,570,2.2,[['risotto rice',90,'g',0.5],['mushrooms',150,'g',0.8],['peas',100,'g',0.3],['vegetable stock',400,'ml',0.2],['olive oil',15,'ml',0.4]],['Fry sliced mushrooms in oil, then stir in rice.','Add hot stock a ladle at a time, stirring until absorbed.','Add peas for the final 5 minutes and cook until rice is tender.'],'🍄'],
['Egg fried rice','vegetarian',20,590,1.9,[['rice',80,'g',0.2],['eggs',2,'each',0.6],['peas',100,'g',0.3],['carrots',100,'g',0.3],['soy sauce',15,'ml',0.5]],['Cook rice fresh following packet instructions and drain well.','Stir-fry diced carrots and peas until tender.','Push aside, scramble eggs until set, then add rice and soy sauce; fry until steaming hot.'],'🥢'],
['Peanut chickpea noodles','vegan',20,640,2.3,[['rice noodles',90,'g',0.6],['chickpeas',150,'g',0.4],['peppers',100,'g',0.4],['peanut butter',25,'g',0.5],['soy sauce',15,'ml',0.4]],['Cook noodles following their packet instructions.','Stir-fry peppers and drained cooked chickpeas.','Loosen peanut butter with hot water and soy sauce, then toss everything together.'],'🍜'],
['Butter bean & tomato stew','vegan',25,480,1.9,[['butter beans',200,'g',0.6],['chopped tomatoes',200,'g',0.4],['spinach',80,'g',0.4],['bread',80,'g',0.5]],['Simmer drained cooked butter beans and tomatoes for 20 minutes.','Stir through spinach until wilted.','Season to taste and serve with toasted bread.'],'🍲']
].map(([name,diet,minutes,kcal,cost,ingredients,steps,emoji],id)=>({id,name,diet,minutes,kcal,cost,ingredients,steps,emoji}));
// Dinner IDs remain stable so existing browser plans can migrate.
for(const recipe of recipes)recipe.meals=['dinner'];
const additionalRecipes=[
 ['Banana porridge','vegan',10,340,0.75,[['oats',50,'g',0.15],['banana',1,'each',0.25],['water',200,'ml',0],['raisins',20,'g',0.35]],['Simmer oats with water for 5 minutes, stirring until soft.','Mash or slice banana and stir into porridge with raisins.'],'🥣','breakfast'],
 ['Berry yoghurt bowl','vegetarian',5,320,1.3,[['plain yoghurt',180,'g',0.5],['berries',100,'g',0.6],['oats',30,'g',0.2]],['Spoon yoghurt into a bowl.','Top with washed berries and oats.'],'🫐','breakfast'],
 ['Scrambled eggs on toast','vegetarian',10,400,1.1,[['eggs',2,'each',0.6],['bread',70,'g',0.35],['olive oil',5,'ml',0.15]],['Toast the bread.','Beat eggs and cook gently in oil, stirring until fully set.','Serve eggs over the toast.'],'🍳','breakfast'],
 ['Apple & cinnamon porridge','vegan',12,330,0.85,[['oats',50,'g',0.15],['apple',1,'each',0.4],['water',220,'ml',0],['cinnamon',1,'g',0.3]],['Grate the washed apple.','Simmer oats, apple, water and cinnamon for 8 minutes, stirring until soft.'],'🍎','breakfast'],
 ['Breakfast potato & tomato hash','vegan',25,390,1.2,[['potatoes',200,'g',0.4],['tomatoes',150,'g',0.5],['olive oil',10,'ml',0.3]],['Dice potatoes small and boil until tender, then drain.','Pan-fry in oil until golden.','Add chopped tomatoes and cook until softened.'],'🥔','breakfast'],
 ['Banana & rice breakfast bowl','vegan',20,370,0.8,[['rice',60,'g',0.2],['banana',1,'each',0.25],['raisins',20,'g',0.35],['water',200,'ml',0]],['Cook rice following its packet instructions, using extra water for a softer texture if desired.','Mash banana into the hot rice, stir in raisins and serve freshly cooked.'],'🍌','breakfast'],
 ['Chickpea & cucumber rice salad','vegan',20,470,1.7,[['rice',60,'g',0.2],['chickpeas',150,'g',0.4],['cucumber',100,'g',0.3],['tomatoes',100,'g',0.3],['lemon',0.5,'each',0.3],['olive oil',5,'ml',0.2]],['Cook rice following its packet instructions.','Chop washed cucumber and tomatoes. Drain cooked chickpeas.','Combine with the rice, oil and lemon juice and serve promptly.'],'🥗','lunch'],
 ['Cheese & tomato toastie','vegetarian',10,460,1.5,[['bread',80,'g',0.4],['cheddar',50,'g',0.7],['tomatoes',100,'g',0.3],['olive oil',5,'ml',0.1]],['Fill the bread with cheddar and thinly sliced tomato.','Brush the outside with oil.','Toast in a hot pan on both sides until golden and the filling is hot.'],'🥪','lunch'],
 ['Quick lentil & carrot soup','vegan',25,410,1.3,[['lentils',180,'g',0.6],['carrots',150,'g',0.3],['onion',80,'g',0.2],['water',300,'ml',0],['olive oil',10,'ml',0.2]],['Soften diced onion and carrot in oil.','Add cooked drained lentils and water. Simmer for 15 minutes until carrots are soft.','Mash or blend to your preferred texture.'],'🥕','lunch'],
 ['Chicken & avocado rice bowl','omnivore',25,550,2.8,[['chicken breast',120,'g',1.3],['rice',60,'g',0.2],['avocado',0.5,'each',0.8],['cucumber',100,'g',0.3],['olive oil',5,'ml',0.2]],['Cook rice according to its packet instructions.','Dice chicken and pan-fry in oil until cooked through, reaching 75°C in the centre.','Serve with rice, sliced avocado and washed cucumber.'],'🥑','lunch'],
 ['Warm butter bean & potato salad','vegan',25,450,1.6,[['butter beans',180,'g',0.6],['potatoes',150,'g',0.3],['spinach',60,'g',0.3],['lemon',0.5,'each',0.2],['olive oil',10,'ml',0.2]],['Dice potatoes and boil until tender.','Warm drained cooked beans with the spinach and a splash of water until steaming hot.','Toss with potatoes, oil and lemon juice.'],'🥬','lunch'],
 ['Hummus & pepper wrap','vegan',10,490,1.8,[['wraps',1,'each',0.4],['hummus',80,'g',0.6],['peppers',100,'g',0.4],['carrots',80,'g',0.2],['cucumber',80,'g',0.2]],['Wash vegetables, slice peppers and cucumber and grate the carrot.','Spread hummus over the wrap, add vegetables and roll up.'],'🌯','lunch'],
 ['Chicken & pepper skillet rice','omnivore',25,610,2.8,[['chicken breast',150,'g',1.6],['rice',75,'g',0.2],['peppers',100,'g',0.4],['chopped tomatoes',150,'g',0.3],['olive oil',10,'ml',0.3]],['Cook rice following its packet instructions.','Cut chicken into small pieces. Pan-fry in oil with sliced peppers until chicken is cooked through, reaching 75°C in the centre.','Add tomatoes, simmer until steaming hot and serve with the rice.'],'🍗','dinner'],
 ['Beef & tomato rice bowl','omnivore',25,650,3.0,[['beef mince',150,'g',1.8],['rice',75,'g',0.2],['chopped tomatoes',200,'g',0.4],['onion',80,'g',0.2],['carrots',100,'g',0.2],['olive oil',10,'ml',0.2]],['Cook rice following its packet instructions.','Soften chopped onion and grated carrot in oil. Add beef mince and break it up while frying.','Add tomatoes and simmer until mince is fully cooked, reaching 75°C throughout. Serve over rice.'],'🥩','dinner'],
 ['Turkey & tomato pasta','omnivore',25,600,2.7,[['turkey mince',150,'g',1.5],['pasta',80,'g',0.2],['chopped tomatoes',200,'g',0.4],['onion',80,'g',0.2],['spinach',50,'g',0.2],['olive oil',10,'ml',0.2]],['Cook pasta following its packet instructions.','Soften chopped onion in oil, then add turkey mince and break it up as it cooks.','Add tomatoes and simmer until turkey is cooked through, reaching 75°C throughout. Wilt in spinach and combine with pasta.'],'🍝','dinner'],
 ['Chicken & tomato potato bowl','omnivore',25,520,2.5,[['chicken breast',120,'g',1.3],['potatoes',180,'g',0.4],['tomatoes',100,'g',0.3],['spinach',50,'g',0.2],['olive oil',10,'ml',0.3]],['Dice potatoes small and boil until tender, then drain.','Cut chicken into small pieces and fry in oil until cooked through, reaching 75°C in the centre.','Add chopped tomato and spinach. Cook until steaming hot and serve with potatoes.'],'🍗','lunch']
];
for(const [name,diet,minutes,kcal,cost,ingredients,steps,emoji,meal] of additionalRecipes){
 recipes.push({id:recipes.length,name,diet,minutes,kcal,cost,ingredients,steps,emoji,meals:[meal]});
}
for(const r of recipes)r.protein=r.ingredients.some(([n])=>['chicken breast','beef mince','turkey mince'].includes(n))?'meat':r.ingredients.some(([n])=>n==='salmon')?'fish':'plant';
export const mealTypes=['breakfast','lunch','dinner'];
export function mealSlots(p){
 const selected=Array.isArray(p.meals)?mealTypes.filter(m=>p.meals.includes(m)):mealTypes;
 return Array.from({length:7},(_,day)=>selected.map(meal=>({day,meal}))).flat();
}
export function generateWeek(p,pantry=[],random=Math.random){
 const pools=new Map(mealTypes.map(meal=>[meal,eligible(p,meal).map(r=>({r,score:random()*1.5+r.ingredients.filter(i=>pantry.includes(i[0])).length*.7-r.cost*.12})).sort((a,b)=>b.score-a.score).map(x=>x.r.id)]));
 const used=new Map(mealTypes.map(meal=>[meal,new Set()]));
 return mealSlots(p).map(({day,meal})=>{
  const pool=pools.get(meal);if(!pool.length)return null;
  // Reserve visible meat slots for mixed diets; never bypass eligibility filters.
  const includeMeat=p.diet==='omnivore'&&((meal==='dinner'&&(day===0||day===3))||(meal==='lunch'&&day===1));
  const meat=includeMeat?pool.filter(id=>recipes[id].protein==='meat'):[];
  const candidates=meat.length?meat:pool;
  const chosen=candidates.find(id=>!used.get(meal).has(id))??candidates[day%candidates.length];
  used.get(meal).add(chosen);return chosen;
 });
}
export function validWeek(p,plan){
 const slots=mealSlots(p);
 return Array.isArray(plan)&&plan.length===slots.length&&slots.every(({meal},i)=>{
  const options=eligible(p,meal);return plan[i]===null?options.length===0:options.some(r=>r.id===plan[i]);
 });
}
export const allergens = [
 ['fish','Fish'],['crustaceans','Crustaceans (prawns, crab)'],['molluscs','Molluscs (mussels, squid)'],
 ['peanuts','Peanuts'],['nuts','Tree nuts'],['milk','Milk'],['eggs','Eggs'],
 ['gluten','Cereals containing gluten'],['soya','Soya'],['sesame','Sesame'],
 ['celery','Celery'],['mustard','Mustard'],['lupin','Lupin'],['sulphites','Sulphites']
];
// Includes recipe ingredients and conservative flags for variable compound ingredients.
// These are recipe-screening tags, not verified product labels or cross-contact data.
const ingredientAllergens = {
 'oats':['gluten'], 'plain yoghurt':['milk'], 'cheddar':['milk'],
 'wraps':['gluten','milk','eggs','soya','sesame','lupin'], 'hummus':['sesame'],
 'raisins':['sulphites'],
 'salmon':['fish'], 'feta':['milk'], 'eggs':['eggs'], 'peanut butter':['peanuts'],
 'couscous':['gluten'], 'pasta':['gluten','eggs'], 'soy sauce':['soya','gluten'],
 'bread':['gluten','milk','eggs','soya','sesame','lupin'],
 'curry paste':['mustard','celery','fish','crustaceans','molluscs','peanuts','nuts','sesame','soya','gluten','milk','sulphites'],
 'vegetable stock':['celery','gluten','soya','milk','mustard','sulphites']
};
export function recipeAllergens(recipe){
 return [...new Set(recipe.ingredients.flatMap(([name])=>ingredientAllergens[name]||[]))];
}
export function portions(p){
 const adults=Math.max(1,Math.min(8,Number(p.adults ?? p.people)||1));
 const children=Math.max(0,Math.min(8,Number(p.children)||0));
 const childPortion=[0.5,0.75,1].includes(Number(p.childPortion))?Number(p.childPortion):1;
 return adults+children*childPortion;
}
export function eligible(p,meal='dinner'){
 const excluded=Array.isArray(p.allergies)?p.allergies:[];
 return recipes.filter(r=>r.meals.includes(meal)&&(p.diet==='omnivore'||r.diet==='vegan'||r.diet===p.diet)&&r.minutes<=p.minutes&&!recipeAllergens(r).some(a=>excluded.includes(a)));
}
export function generate(p,pantry=[],random=Math.random){
 const pool=eligible(p); if(!pool.length) return [];
 const scored=pool.map(r=>({r,score:random()*1.5 + r.ingredients.filter(i=>pantry.includes(i[0])).length*.7-r.cost*.12})).sort((a,b)=>b.score-a.score);
 return Array.from({length:7},(_,i)=>scored[i%scored.length].r.id);
}
export function shopping(plan,people,pantry=[]){
 const items=new Map();for(const id of plan){const r=recipes.find(r=>r.id===id);if(!r)continue;for(const [name,qty,unit,cost] of r.ingredients){if(pantry.includes(name))continue;const old=items.get(name)||{name,qty:0,unit,cost:0};old.qty+=qty*people;old.cost+=cost*people;items.set(name,old);}}
 return [...items.values()].sort((a,b)=>a.name.localeCompare(b.name));
}
