import { useCallback, useEffect, useState } from 'react';
import { caseRepository } from '../data/repositories/caseRepository';
import { documentRepository } from '../data/repositories/documentRepository';
import { taskRepository } from '../data/repositories/taskRepository';

export function useCases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await caseRepository.listCases();
      setCases(data);
    } catch (err) {
      setError(err.message || 'Unable to load cases from local storage.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCases();
  }, [refreshCases]);

  const createCase = useCallback(async (payload) => {
    const created = await caseRepository.createCase(payload);
    setCases((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateCase = useCallback(async (caseId, patch, activitySummary) => {
    const updated = await caseRepository.updateCase(caseId, patch, activitySummary);
    setCases((prev) => prev.map((c) => (c.id === caseId ? updated : c)));
    return updated;
  }, []);

  const deleteCase = useCallback(async (caseId) => {
    await documentRepository.deleteByCase(caseId);
    await taskRepository.deleteByCase(caseId);
    await caseRepository.deleteCase(caseId);
    setCases((prev) => prev.filter((c) => c.id !== caseId));
  }, []);

  return {
    cases,
    loading,
    error,
    refreshCases,
    createCase,
    updateCase,
    deleteCase,
  };
}
