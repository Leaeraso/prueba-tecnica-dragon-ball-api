import { SuffixesEnum } from '../data/enums/suffixes.enum';

const parseKi = (ki: string): number | null => {
  const normalizedKi = ki.toLowerCase().replace(/[,.]/g, '');

  if (!isNaN(Number(normalizedKi))) {
    return Number(normalizedKi);
  }

  const match = normalizedKi.match(/^([\d\.]+)\s*([a-zA-Z]+)$/);
  if (!match) {
    return null;
  }

  const numberPart = parseFloat(match[1]);
  const suffix = match[2] as keyof typeof SuffixesEnum;

  if (!SuffixesEnum[suffix]) {
    return null;
  }
  return numberPart * SuffixesEnum[suffix];
};

export default parseKi;
