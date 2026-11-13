import { generateId, readJson, writeJson } from './storageHelper';

const DOCS_META_KEY = 'gs_documents_v1';
const DB_NAME = 'graahaksaarthi_docs_db';
const STORE_NAME = 'files';

function openDocsDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function putBlob(docId, file) {
  try {
    const db = await openDocsDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).put(file, docId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return true;
  } catch {
    return false;
  }
}

async function getBlob(docId) {
  try {
    const db = await openDocsDb();
    const result = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(docId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return result;
  } catch {
    return null;
  }
}

async function removeBlob(docId) {
  try {
    const db = await openDocsDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      tx.objectStore(STORE_NAME).delete(docId);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // Ignore cleanup errors if IndexedDB unavailable
  }
}

function getAllMeta() {
  const list = readJson(DOCS_META_KEY, []);
  return Array.isArray(list) ? list : [];
}

function saveAllMeta(docs) {
  writeJson(DOCS_META_KEY, docs);
}

export const documentRepository = {
  async listAllDocuments() {
    const docs = getAllMeta();
    return docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async listByCase(caseId) {
    const docs = getAllMeta();
    return docs
      .filter((d) => d.caseId === caseId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async addDocument(caseId, file, metadata = {}) {
    const id = generateId('doc');
    const savedBinary = await putBlob(id, file);

    const record = {
      id,
      caseId,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      documentType: metadata.documentType || 'other',
      notes: metadata.notes || '',
      storageMode: savedBinary ? 'indexeddb' : 'metadata-only',
      extractionStatus: 'unavailable',
      classification: 'UNVERIFIED',
      createdAt: new Date().toISOString(),
    };

    const existing = getAllMeta();
    saveAllMeta([record, ...existing]);
    return record;
  },

  async updateDocumentMetadata(docId, patch) {
    const docs = getAllMeta();
    const idx = docs.findIndex((d) => d.id === docId);
    if (idx === -1) throw new Error('Document not found.');
    docs[idx] = { ...docs[idx], ...patch };
    saveAllMeta(docs);
    return docs[idx];
  },

  async getDocumentPreviewUrl(docId) {
    const blob = await getBlob(docId);
    if (!blob) return null;
    return URL.createObjectURL(blob);
  },

  async deleteDocument(docId) {
    await removeBlob(docId);
    const docs = getAllMeta().filter((d) => d.id !== docId);
    saveAllMeta(docs);
    return true;
  },

  async deleteByCase(caseId) {
    const matching = getAllMeta().filter((d) => d.caseId === caseId);
    for (const doc of matching) {
      await removeBlob(doc.id);
    }
    const remaining = getAllMeta().filter((d) => d.caseId !== caseId);
    saveAllMeta(remaining);
    return true;
  },

  async clearAll() {
    localStorage.removeItem(DOCS_META_KEY);
    if (typeof indexedDB !== 'undefined') {
      await new Promise((resolve) => {
        const req = indexedDB.deleteDatabase(DB_NAME);
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
        req.onblocked = () => resolve();
      });
    }
  },
};
