import { useCallback, useEffect, useState } from 'react';
import { documentRepository } from '../data/repositories/documentRepository';

export function useDocuments(caseId = null) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = caseId
        ? await documentRepository.listByCase(caseId)
        : await documentRepository.listAllDocuments();
      setDocuments(list);
    } catch (err) {
      setError(err.message || 'Unable to load locally stored documents.');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  const addDocument = useCallback(
    async (targetCaseId, file, metadata) => {
      const created = await documentRepository.addDocument(targetCaseId, file, metadata);
      setDocuments((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const updateDocument = useCallback(async (docId, patch) => {
    const updated = await documentRepository.updateDocumentMetadata(docId, patch);
    setDocuments((prev) => prev.map((d) => (d.id === docId ? updated : d)));
    return updated;
  }, []);

  const deleteDocument = useCallback(async (docId) => {
    await documentRepository.deleteDocument(docId);
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  }, []);

  const getPreviewUrl = useCallback(async (docId) => {
    return documentRepository.getDocumentPreviewUrl(docId);
  }, []);

  return {
    documents,
    loading,
    error,
    refreshDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    getPreviewUrl,
  };
}
