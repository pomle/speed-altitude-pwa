import { useEffect, useState } from "react";
import { GPSHistoryData } from "./geo";

export class HistoryStore {
  #db: IDBDatabase;

  constructor(db: IDBDatabase) {
    this.#db = db;
  }

  list() {
    return new Promise<GPSHistoryData[]>((resolve, reject) => {
      const tx = this.#db.transaction("history", "readonly");
      const request = tx.objectStore("history").getAll();
      request.addEventListener("error", reject);
      request.addEventListener("success", () => {
        resolve(request.result);
      });
    });
  }

  put(geo: GPSHistoryData) {
    const tx = this.#db.transaction("history", "readwrite");
    console.log("TX", tx, geo);
    tx.objectStore("history").put(geo);
    tx.commit();
  }
}

function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const req = window.indexedDB.open("gps_history", 2);
    req.addEventListener("error", reject);
    req.addEventListener("upgradeneeded", () => {
      req.result.createObjectStore("history", { keyPath: "timestamp" });
    });
    req.addEventListener("success", () => {
      resolve(req.result);
    });
  });
}

export function useStore() {
  const [store, setStore] = useState<HistoryStore>();

  useEffect(() => {
    openDB().then((db) => {
      setStore(new HistoryStore(db));
    });
  }, []);

  return store;
}
