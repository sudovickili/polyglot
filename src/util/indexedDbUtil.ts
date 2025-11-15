export async function openDb(name: string, version: number, onUpgrade: (e: IDBVersionChangeEvent) => void): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, version);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
    request.onupgradeneeded = (e) => {
      onUpgrade(e);
    };
  })
}

/** The response will be undefined if the key is not found */
export async function get(db: IDBDatabase, storeName: string, key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName).objectStore(storeName).get(key);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = () => {
      reject(request.error);
    };
  })
}

export async function getAll(db: IDBDatabase, storeName: string, keys: string[]): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName).objectStore(storeName).getAll(keys);
    transaction.onsuccess = () => {
      resolve(transaction.result);
    };
    transaction.onerror = () => {
      reject(transaction.error);
    };
  })
}