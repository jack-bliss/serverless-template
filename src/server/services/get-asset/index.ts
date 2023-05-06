import { readFromBucket } from './read-from-bucket';
import { readFromLocal } from './read-from-local';

export function getAsset(path: string) {
  if (process.env.NODE_ENV === 'production') {
    return readFromBucket(path);
  }
  return readFromLocal(path);
}
