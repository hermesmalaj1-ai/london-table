import test from 'node:test';
import assert from 'node:assert/strict';
import {recipes,generate,shopping} from '../public/engine.js';
test('vegan plan has seven meals within cooking limit',()=>{const p=generate({diet:'vegan',minutes:25},[],()=>.5);assert.equal(p.length,7);assert.ok(p.every(id=>recipes[id].diet==='vegan'&&recipes[id].minutes<=25));});
test('vegetarian plans exclude meat and fish',()=>{assert.ok(generate({diet:'vegetarian',minutes:60}).every(id=>recipes[id].diet!=='omnivore'));});
test('shopping aggregates quantities, scales portions and excludes pantry',()=>{const items=shopping([0,0],2,['rice']);assert.equal(items.find(i=>i.name==='chickpeas').qty,800);assert.equal(items.find(i=>i.name==='chickpeas').cost,2);assert.ok(!items.some(i=>i.name==='rice'));});
test('pantry matches influence recipe selection',()=>{const p=generate({diet:'vegan',minutes:25},['rice noodles','peanut butter','peppers'],()=>.5);assert.equal(p[0],8);});
test('no eligible meals yields empty plan',()=>assert.deepEqual(generate({diet:'vegan',minutes:1}),[]));
