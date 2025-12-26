// src/database/models/index.ts
import { associations } from '../../utils/associations';

export function initModels() {
  for (const { source, type, target, options } of associations) {
    (source as any)[type](target, options);
  }
}
