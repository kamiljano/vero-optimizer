import { Calculation } from './vero/calculation';
import TaxCard from './vero/tax-card';
import hash from 'object-hash';
import * as fs from 'node:fs';
import * as path from 'node:path';

const cacheFile = path.join(__dirname, 'cache.json');

export default class TaxCardCache {
  private readonly cache: Record<string, TaxCard | undefined>;
  private tempIterator = 0;

  constructor() {
    if (fs.existsSync(cacheFile)) {
      this.cache = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
    } else {
      this.cache = {};
    }
  }

  get(calculation: Calculation) {
    const key = hash(calculation);
    return this.cache[key];
  }

  set(calculation: Calculation, val: TaxCard) {
    const key = hash(calculation);
    this.cache[key] = val;
    const tempFile = path.join(
      __dirname,
      `temp.${++this.tempIterator}.cache.json`,
    );
    fs.writeFileSync(tempFile, JSON.stringify(this.cache));
    fs.renameSync(tempFile, cacheFile);
  }
}
