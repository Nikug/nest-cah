import { GameOptionsConfig } from '../consts/games.consts';
import { clamp } from './math.helper';

export const limitOptions = <T>(
  options: Record<string, any>,
  path: string[],
): T => {
  for (const [key, value] of Object.entries(options)) {
    if (typeof value === 'object' && value !== null) {
      options[key] = limitOptions(value, [...path, key]);
    } else if (typeof value === 'number') {
      const limits = getAtPath(GameOptionsConfig, [...path, key]);
      options[key] = clamp(value, limits.min, limits.max);
    }
  }

  return options as T;
};

const getAtPath = (obj: any, path: string[]) => {
  return path.reduce((acc, key) => acc[key], obj);
};
