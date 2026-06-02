import type {
  AsyncStorage,
  PersistedQuery,
} from '@tanstack/query-persist-client-core'

const DB_NAME = 'ced'
const STORE_NAME = 'query-cache'
const VERSION = 1

let dbPromise: Promise<IDBDatabase> | null = null

function getDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)

    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    req.onsuccess = () => {
      const conn = req.result
      conn.onversionchange = () => {
        conn.close()
        dbPromise = null
      }
      resolve(conn)
    }

    req.onblocked = () => {
      console.warn('[IDB] open blocked by another connection')
    }

    req.onerror = () => {
      dbPromise = null
      reject(req.error ?? new Error('IndexedDB open failed'))
    }
  })

  return dbPromise
}

export const idbStorage: AsyncStorage<PersistedQuery> = {
  async getItem(key: string) {
    const db = await getDb()
    return new Promise<PersistedQuery | undefined>((resolve, reject) => {
      const req = db
        .transaction(STORE_NAME, 'readonly')
        .objectStore(STORE_NAME)
        .get(key)
      req.onsuccess = () => resolve(req.result as PersistedQuery | undefined)
      req.onerror = () => reject(req.error ?? new Error('getItem failed'))
    })
  },

  async setItem(key: string, value: PersistedQuery) {
    try {
      const db = await getDb()
      await new Promise<void>((resolve, reject) => {
        const req = db
          .transaction(STORE_NAME, 'readwrite')
          .objectStore(STORE_NAME)
          .put(value, key)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error ?? new Error('setItem failed'))
      })
    } catch (err) {
      console.trace('[IDB] skipping setItem:', err)
    }
  },

  async removeItem(key: string) {
    try {
      const db = await getDb()
      await new Promise<void>((resolve, reject) => {
        const req = db
          .transaction(STORE_NAME, 'readwrite')
          .objectStore(STORE_NAME)
          .delete(key)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error ?? new Error('removeItem failed'))
      })
    } catch (err) {
      console.trace('[IDB] skipping removeItem:', err)
    }
  },

  async entries() {
    const db = await getDb()
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const out: [string, PersistedQuery][] = []

    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve()
      tx.onerror = () => reject(tx.error)

      const req = store.openCursor()
      req.onerror = () => reject(req.error)
      req.onsuccess = () => {
        const cursor = req.result
        if (!cursor) return
        out.push([String(cursor.key), cursor.value as PersistedQuery])
        cursor.continue()
      }
    })

    return out
  },
}
