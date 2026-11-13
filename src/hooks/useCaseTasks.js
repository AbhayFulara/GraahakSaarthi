import { useCallback, useEffect, useState } from 'react';
import { taskRepository } from '../data/repositories/taskRepository';

export function useCaseTasks(caseId = null) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = caseId
        ? await taskRepository.listByCase(caseId)
        : await taskRepository.listAllTasks();
      setTasks(list);
    } catch (err) {
      setError(err.message || 'Unable to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    refreshTasks();
  }, [refreshTasks]);

  const addTask = useCallback(async (targetCaseId, payload) => {
    const created = await taskRepository.addTask(targetCaseId, payload);
    setTasks((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateTask = useCallback(async (taskId, patch) => {
    const updated = await taskRepository.updateTask(taskId, patch);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    await taskRepository.deleteTask(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  return {
    tasks,
    loading,
    error,
    refreshTasks,
    addTask,
    updateTask,
    deleteTask,
  };
}
