import {
  generateCaseReference,
  generateId,
  readJson,
  writeJson,
} from './storageHelper';

const CASES_KEY = 'gs_cases_v1';

function getAllRaw() {
  const list = readJson(CASES_KEY, []);
  return Array.isArray(list) ? list : [];
}

function saveAllRaw(cases) {
  writeJson(CASES_KEY, cases);
}

function appendActivity(existingCase, summary) {
  const entry = {
    id: generateId('act'),
    summary,
    timestamp: new Date().toISOString(),
  };
  const current = Array.isArray(existingCase.recentActivity) ? existingCase.recentActivity : [];
  return [entry, ...current].slice(0, 20);
}

export const caseRepository = {
  async listCases() {
    const cases = getAllRaw();
    return cases.sort(
      (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );
  },

  async getCaseById(caseId) {
    const cases = getAllRaw();
    const match = cases.find((c) => c.id === caseId);
    return match || null;
  },

  async createCase(payload) {
    const now = new Date().toISOString();
    const newCase = {
      id: generateId('case'),
      referenceNumber: generateCaseReference(),
      category: payload.category || '',
      title: payload.title || '',
      description: payload.description || '',
      productName: payload.productName || '',
      sellerName: payload.sellerName || '',
      orderNumber: payload.orderNumber || '',
      purchaseDate: payload.purchaseDate || '',
      incidentDate: payload.incidentDate || '',
      amountInvolved:
        payload.amountInvolved !== undefined && payload.amountInvolved !== ''
          ? Number(payload.amountInvolved)
          : null,
      requestedRemedy: payload.requestedRemedy || 'full_refund',
      status: payload.status || 'Open',
      requiresAttention: Boolean(payload.requiresAttention),
      nextRecommendedAction: payload.nextRecommendedAction || '',
      timelineEvents: [],
      lossItems: [],
      complaintDraft: null,
      evidenceNotes: {},
      tracking: {
        currentStatus: payload.status || 'Open',
        referenceNumbers: payload.orderNumber
          ? [{ id: generateId('ref'), label: 'Order / Reference No.', value: payload.orderNumber }]
          : [],
        milestones: [],
        updates: [],
        nextFollowUpDate: '',
        nextActionNote: '',
      },
      recentActivity: [
        {
          id: generateId('act'),
          summary: 'Case created locally',
          timestamp: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    const cases = getAllRaw();
    saveAllRaw([newCase, ...cases]);
    return newCase;
  },

  async updateCase(caseId, patch, activitySummary = 'Case details updated') {
    const cases = getAllRaw();
    const idx = cases.findIndex((c) => c.id === caseId);
    if (idx === -1) {
      throw new Error('Case not found in local storage.');
    }

    const existing = cases[idx];
    const updated = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
      recentActivity: activitySummary
        ? appendActivity(existing, activitySummary)
        : existing.recentActivity,
    };

    cases[idx] = updated;
    saveAllRaw(cases);
    return updated;
  },

  async deleteCase(caseId) {
    const cases = getAllRaw();
    const next = cases.filter((c) => c.id !== caseId);
    saveAllRaw(next);
    return true;
  },

  async addTimelineEvent(caseId, eventPayload) {
    const existing = await this.getCaseById(caseId);
    if (!existing) throw new Error('Case not found.');

    const newEvent = {
      id: generateId('evt'),
      eventType: eventPayload.eventType || 'other',
      eventDate: eventPayload.eventDate,
      title: eventPayload.title,
      description: eventPayload.description || '',
      documentId: eventPayload.documentId || '',
      documentName: eventPayload.documentName || '',
      createdAt: new Date().toISOString(),
    };

    const nextEvents = [...(existing.timelineEvents || []), newEvent].sort(
      (a, b) => new Date(a.eventDate) - new Date(b.eventDate)
    );

    return this.updateCase(
      caseId,
      { timelineEvents: nextEvents },
      `Added timeline event: ${newEvent.title}`
    );
  },

  async updateTimelineEvent(caseId, eventId, patch) {
    const existing = await this.getCaseById(caseId);
    if (!existing) throw new Error('Case not found.');

    const nextEvents = (existing.timelineEvents || [])
      .map((evt) => (evt.id === eventId ? { ...evt, ...patch } : evt))
      .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    return this.updateCase(caseId, { timelineEvents: nextEvents }, 'Updated timeline event');
  },

  async deleteTimelineEvent(caseId, eventId) {
    const existing = await this.getCaseById(caseId);
    if (!existing) throw new Error('Case not found.');

    const nextEvents = (existing.timelineEvents || []).filter((evt) => evt.id !== eventId);
    return this.updateCase(caseId, { timelineEvents: nextEvents }, 'Removed timeline event');
  },

  async addLossItem(caseId, itemPayload) {
    const existing = await this.getCaseById(caseId);
    if (!existing) throw new Error('Case not found.');

    const newItem = {
      id: generateId('loss'),
      category: itemPayload.category || 'product_service',
      label: itemPayload.label,
      amount: Number(itemPayload.amount),
      documentId: itemPayload.documentId || '',
      documentName: itemPayload.documentName || '',
      createdAt: new Date().toISOString(),
    };

    const nextItems = [...(existing.lossItems || []), newItem];
    return this.updateCase(
      caseId,
      { lossItems: nextItems },
      `Added expense: ${newItem.label}`
    );
  },

  async updateLossItem(caseId, itemId, patch) {
    const existing = await this.getCaseById(caseId);
    if (!existing) throw new Error('Case not found.');

    const nextItems = (existing.lossItems || []).map((item) =>
      item.id === itemId
        ? {
            ...item,
            ...patch,
            amount: patch.amount !== undefined ? Number(patch.amount) : item.amount,
          }
        : item
    );

    return this.updateCase(caseId, { lossItems: nextItems }, 'Updated financial loss item');
  },

  async deleteLossItem(caseId, itemId) {
    const existing = await this.getCaseById(caseId);
    if (!existing) throw new Error('Case not found.');

    const nextItems = (existing.lossItems || []).filter((item) => item.id !== itemId);
    return this.updateCase(caseId, { lossItems: nextItems }, 'Removed financial loss item');
  },

  async saveComplaintDraft(caseId, draft) {
    const existing = await this.getCaseById(caseId);
    if (!existing) throw new Error('Case not found.');

    const savedDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };

    return this.updateCase(
      caseId,
      { complaintDraft: savedDraft },
      'Saved complaint draft locally'
    );
  },

  async updateTracking(caseId, trackingPatch) {
    const existing = await this.getCaseById(caseId);
    if (!existing) throw new Error('Case not found.');

    const nextTracking = {
      ...(existing.tracking || {}),
      ...trackingPatch,
    };

    const casePatch = {
      tracking: nextTracking,
    };
    if (trackingPatch.currentStatus) {
      casePatch.status = trackingPatch.currentStatus;
    }
    if (trackingPatch.nextActionNote !== undefined) {
      casePatch.nextRecommendedAction = trackingPatch.nextActionNote;
    }

    return this.updateCase(caseId, casePatch, 'Updated case tracking details');
  },

  async saveEvidenceNote(caseId, docId, noteText) {
    const existing = await this.getCaseById(caseId);
    if (!existing) throw new Error('Case not found.');

    const nextNotes = {
      ...(existing.evidenceNotes || {}),
      [docId]: noteText,
    };
    return this.updateCase(caseId, { evidenceNotes: nextNotes }, null);
  },

  clearAll() {
    localStorage.removeItem(CASES_KEY);
  },
};
