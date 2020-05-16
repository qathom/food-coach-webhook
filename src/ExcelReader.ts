import path from 'path';
import xlsx from 'xlsx';
import { Reader } from '../types';

export class ExcelReader<Entity> implements Reader<Entity> {
  read(sheetIndex = 0, filePath: string, range: null|string = null): Entity[] {
    const wb = xlsx.readFile(path.join(filePath));
    const sheetsList = wb.SheetNames;

    return xlsx.utils.sheet_to_json(wb.Sheets[sheetsList[sheetIndex]], { range, header: 1 }) as Entity[];
  }
}
