import { useCallback, useEffect, useState } from 'react';
import { caseRepository } from '../data/repositories/caseRepository';

export function useCaseDetails(caseId) {
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshCase = useCallback(async () => {
    if (!caseId) {
      setCaseData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const record = await caseRepository.getCaseById(caseId);
      if (!record) {
        setError('Case not found in your local workspace.');
        setCaseData(null);
      } else {
        setCaseData(record);
      }
    } catch (err) {
      setError(err.message || 'Unable to load case details.');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    refreshCase();
  }, [refreshCase]);

  const updateCase = useCallback(
    async (patch, activitySummary) => {
      const updated = await caseRepository.updateCase(caseId, patch, activitySummary);
      setCaseData(updated);
      return updated;
    },
    [caseId]
  );

  const addTimelineEvent = useCallback(
    async (eventPayload) => {
      const updated = await caseRepository.addTimelineEvent(caseId, eventPayload);
      setCaseData(updated);
      return updated;
    },
    [caseId]
  );

  const updateTimelineEvent = useCallback(
    async (eventId, patch) => {
      const updated = await caseRepository.updateTimelineEvent(caseId, eventId, patch);
      setCaseData(updated);
      return updated;
    },
    [caseId]
  );

  const deleteTimelineEvent = useCallback(
    async (eventId) => {
      const updated = await caseRepository.deleteTimelineEvent(caseId, eventId);
      setCaseData(updated);
      return updated;
    },
    [caseId]
  );

  const addLossItem = useCallback(
    async (itemPayload) => {
      const updated = await caseRepository.addLossItem(caseId, itemPayload);
      setCaseData(updated);
      return updated;
    },
    [caseId]
  );

  const updateLossItem = useCallback(
    async (itemId, patch) => {
      const updated = await caseRepository.updateLossItem(caseId, itemId, patch);
      setCaseData(updated);
      return updated;
    },
    [caseId]
  );

  const deleteLossItem = useCallback(
    async (itemId) => {
      const updated = await caseRepository.deleteLossItem(caseId, itemId);
      setCaseData(updated);
      return updated;
    },
    [caseId]
  );

  const saveComplaintDraft = useCallback(
    async (draft) => {
      const updated = await caseRepository.saveComplaintDraft(caseId, draft);
      setCaseData(updated);
      return updated;
    },
    [caseId]
  );

  const updateTracking = useCallback(
    async (trackingPatch) => {
      const updated = await caseRepository.updateTracking(caseId, trackingPatch);
      setCaseData(updated);
      return updated;
    },
    [caseId]
  );

  return {
    caseData,
    loading,
    error,
    refreshCase,
    updateCase,
    addTimelineEvent,
    updateTimelineEvent,
    deleteTimelineEvent,
    addLossItem,
    updateLossItem,
    deleteLossItem,
    saveComplaintDraft,
    updateTracking,
  };
}
