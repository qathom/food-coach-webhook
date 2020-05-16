export class TextNormalizer {
  normalize(input: string): string {
    return input
      .toLowerCase()
      .replace(/\/|"|’|@|\.|,|\?|\(|\)|!|:|;|\.{2,5}/g, '')
  
      // Accents, diacritics
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .trim();
  }
}
