import * as fs from 'fs';
import * as path from 'path';
import { FoodItemStorage, FoodItem, SearchResult } from '../types';
import { TextNormalizer } from './TextNormalizer';

const lunr = require('lunr');

export class FoodMapper {
  private readonly fallbackLocale: string = 'en';
  private searcher: any;
  private textNormalizer = new TextNormalizer();
  private searchLimit = 6;
  private list: FoodItem[];

  private findFileLocale(locale: string): string {
    const directory = 'static/food-composition';

    const files = fs.readdirSync(directory);
    const localeFiles = files.filter(f => f.indexOf(`${locale}.json`) > -1);

    if (localeFiles.length === 0) {
      const fallbackFiles = files.filter(f => f.indexOf(`${this.fallbackLocale}.json`) > -1);

      if (fallbackFiles.length === 0) {
        throw new Error('No data available');
      }

      return path.join(directory, fallbackFiles[0]);
    }

    return path.join(directory, localeFiles[0]);
  }

  select(locale: string) {
    const store = JSON.parse(fs.readFileSync(this.findFileLocale(locale), 'utf-8')) as FoodItemStorage;
    this.list = store.data;
    this.searcher = lunr(function () {
      this.ref('id')
      this.field('tokens')
    
      store.data.forEach(function (doc) {
        this.add(doc);
      }, this);
    })
  }

  search(query: string): SearchResult<FoodItem>[] {
    const searchQuery = this.textNormalizer.normalize(query);
    const result = this.searcher.search(searchQuery);

    return result
      .slice(0, this.searchLimit)
      .map((result) => ({
        item: this.list.find(item => item.id === parseInt(result.ref, 10)),
        score: result.score,
      }));
  }

  get(id: number): FoodItem|undefined {
    return this.list.find((item) => item.id === id);
  }
}
