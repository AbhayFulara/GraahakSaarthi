import { useCallback, useEffect, useState } from 'react';
import { settingsRepository } from '../data/repositories/settingsRepository';

export function useSettings() {
  const [settings, setSettings] = useState({
    defaultState: '',
    confirmBeforeDelete: true,
  });
  const [storageSummary, setStorageSummary] = useState({
    caseCount: 0,
    documentCount: 0,
    taskCount: 0,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [loadedSettings, summary] = await Promise.all([
        settingsRepository.getSettings(),
        settingsRepository.getStorageSummary(),
      ]);
      setSettings(loadedSettings);
      setStorageSummary(summary);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateSettings = useCallback(async (patch) => {
    const saved = await settingsRepository.saveSettings(patch);
    setSettings(saved);
    return saved;
  }, []);

  const clearAllData = useCallback(async () => {
    const defaults = await settingsRepository.clearAllLocalData();
    setSettings(defaults);
    setStorageSummary({ caseCount: 0, documentCount: 0, taskCount: 0 });
    return defaults;
  }, []);

  return {
    settings,
    storageSummary,
    loading,
    refresh,
    updateSettings,
    clearAllData,
  };
}
