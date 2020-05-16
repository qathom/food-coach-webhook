#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import { ExcelReader } from '../src/ExcelReader';
import { TextNormalizer } from '../src/TextNormalizer';
import { FoodItem, Nutrient, NutrientType, FoodUnit, FoodItemExcelRow } from '../types';
import * as natural from 'natural';

const MAIN_DIRECTORY = 'static/food-composition';

const excelFiles = fs
  .readdirSync(MAIN_DIRECTORY)
  .filter(f => f.indexOf('~$') === -1 && f.indexOf('.xlsx') > -1);


const excelReader = new ExcelReader<FoodItemExcelRow>();

const columnReference: { [key: string]: number } = {
  id: 0,
  name: 3,
  synonyms: 4,
  category: 5,
  energy: 8,
  kiloCalories: 11,
  carbohydrate: 29,
  sugar: 32,
  fiber: 38,
  protein: 41,
};

const wordTokenizer = new natural.RegexpTokenizer({ pattern: / {1,}/ });
const categoryTokenizer = new natural.RegexpTokenizer({ pattern: /\/|;| / });
const normalizer = new TextNormalizer();

excelFiles.forEach((excelFile) => {
  const range = 'A4:ZZ9999';
  const filePath = path.join(MAIN_DIRECTORY, excelFile);
  const rows = [
    // Read sheet 1 - generic food
    ...excelReader.read(0, filePath, range),
    // Read sheet 2 - branded food and drinks
    ...excelReader.read(1, filePath, range),
  ];

  const formattedData: FoodItem[] = rows.map((row) => {
    const nutrients: Nutrient[] = [
      { type: NutrientType.CARBOHYDRATE, value: parseFloat(row[columnReference.carbohydrate]) || 0, unit: FoodUnit.GRAM },
      { type: NutrientType.FIBER, value: parseFloat(row[columnReference.fiber]) || 0, unit: FoodUnit.GRAM },
      { type: NutrientType.SUGAR, value: parseFloat(row[columnReference.sugar]) || 0, unit: FoodUnit.GRAM },
      { type: NutrientType.PROTEIN, value: parseFloat(row[columnReference.protein]) || 0, unit: FoodUnit.GRAM },
    ];

    const tokens = [...new Set([
      ...wordTokenizer.tokenize(`${row[columnReference.name]} ${row[columnReference.synonyms] || ''}`),
      ...categoryTokenizer.tokenize(row[columnReference.category] || ''),
      ...(row[columnReference.synonyms] || '').split(','),
    ])].map(token => normalizer.normalize(token))
    .filter(token => token.trim().length > 0);

    return {
      id: row[columnReference.id],
      name: row[columnReference.name],
      tokens,
      category: row[columnReference.category],
      nutrients,
      energy: [
        {
          value: row[columnReference.energy],
          unit: FoodUnit.KJ,
        },
        {
          value: row[columnReference.kiloCalories],
          unit: FoodUnit.KCAL,
        },
      ],
    };
  });

  const store = JSON.stringify({
    createdAt: new Date().toISOString(),
    data: formattedData,
  }, null, 2);

  fs.writeFileSync(filePath.replace('xlsx', 'json'), store);
});
