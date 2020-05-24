#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { FoodItem } from '../types';

const MAIN_DIRECTORY = 'static/food-composition';
const EXPORT_DIRECTORY = 'static/export';

const jsonFiles = fs
  .readdirSync(MAIN_DIRECTORY)
  .filter(f =>f.indexOf('.json') > -1);

let exportJson = [];

jsonFiles.forEach((jsonFile) => {
  const json = JSON.parse(fs.readFileSync(path.join(MAIN_DIRECTORY, jsonFile), 'utf-8')).data as FoodItem[];
  const items = json
    .filter(item => item.name && item.name.length > 0)
    .map(item => ({ value: item.name, synonyms: [item.name] }));

  exportJson = [...exportJson, ...items];
});

fs.writeFileSync(path.join(EXPORT_DIRECTORY, 'exported.json'), JSON.stringify(exportJson, null, 2));
