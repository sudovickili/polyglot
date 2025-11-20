export class AsyncCache<T, Key = string> {
  private map: Map<Key, T> = new Map();
  constructor(private load: (key: Key) => Promise<T>) { }

  async get(key: Key): Promise<T | undefined> {
    if (this.map.has(key)) {
      return this.map.get(key);
    }
    const value = await this.load(key);
    this.map.set(key, value);
    return value;
  }
}