import { readJson, writeJson } from './storageHelper';
import { caseRepository } from './caseRepository';
import { documentRepository } from './documentRepository';
import { taskRepository } from './taskRepository';

const SETTINGS_KEY = 'gs_settings_v1';

const DEFAULT_SETTINGS = {
  defaultState: '',
  confirmBeforeDelete: true,
};

export const settingsRepository = {
  async getSettings() {
    const stored = readJson(SETTINGS_KEY, {});
    return { ...DEFAULT_SETTINGS, ...stored };
  },

  async saveSettings(patch) {
    const current = await this.getSettings();
    const updated = { ...current, ...patch };
    writeJson(SETTINGS_KEY, updated);
    return updated;
  },

  async getStorageSummary() {
    const [cases, documents, tasks] = await Promise.all([
      caseRepository.listCases(),
      documentRepository.listAllDocuments(),
      taskRepository.listAllTasks(),
    ]);

    return {
      caseCount: cases.length,
      documentCount: documents.length,
      taskCount: tasks.length,
    };
  },

  async clearAllLocalData() {
    caseRepository.clearAll();
    taskRepository.clearAll();
    await documentRepository.clearAll();
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem('gs_preferred_language');
    return { ...DEFAULT_SETTINGS };
  },
};
