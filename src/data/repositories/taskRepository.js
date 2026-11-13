import { generateId, readJson, writeJson } from './storageHelper';

const TASKS_KEY = 'gs_tasks_v1';

function getAllRaw() {
  const list = readJson(TASKS_KEY, []);
  return Array.isArray(list) ? list : [];
}

function saveAllRaw(tasks) {
  writeJson(TASKS_KEY, tasks);
}

export const taskRepository = {
  async listAllTasks() {
    const tasks = getAllRaw();
    return tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async listByCase(caseId) {
    return getAllRaw()
      .filter((t) => t.caseId === caseId)
      .sort((a, b) => Number(a.completed) - Number(b.completed));
  },

  async addTask(caseId, payload) {
    const task = {
      id: generateId('task'),
      caseId,
      title: payload.title,
      dueDate: payload.dueDate || '',
      notes: payload.notes || '',
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const tasks = getAllRaw();
    saveAllRaw([task, ...tasks]);
    return task;
  },

  async updateTask(taskId, patch) {
    const tasks = getAllRaw();
    const idx = tasks.findIndex((t) => t.id === taskId);
    if (idx === -1) throw new Error('Task not found.');
    tasks[idx] = { ...tasks[idx], ...patch };
    saveAllRaw(tasks);
    return tasks[idx];
  },

  async deleteTask(taskId) {
    const next = getAllRaw().filter((t) => t.id !== taskId);
    saveAllRaw(next);
    return true;
  },

  async deleteByCase(caseId) {
    const next = getAllRaw().filter((t) => t.caseId !== caseId);
    saveAllRaw(next);
    return true;
  },

  clearAll() {
    localStorage.removeItem(TASKS_KEY);
  },
};
