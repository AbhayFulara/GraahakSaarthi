import {
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  FileText,
  Scale,
} from 'lucide-react';

export const WORKFLOW_STAGES = [
  {
    step: 1,
    icon: ClipboardList,
    title: 'Consumer Problem + Evidence',
    desc: 'Record what happened and organize invoices, screenshots, receipts and seller communication.',
  },
  {
    step: 2,
    icon: BrainCircuit,
    title: 'AI Case Intelligence',
    desc: 'Prepare the case for structured evidence analysis, missing-proof identification and chronology.',
  },
  {
    step: 3,
    icon: Scale,
    title: 'Consumer Rights + Action Plan',
    desc: 'Understand relevant consumer rights and explore appropriate grievance pathways.',
  },
  {
    step: 4,
    icon: FileText,
    title: 'Complaint Preparation',
    desc: 'Prepare and review an editable complaint supported by documented information.',
  },
  {
    step: 5,
    icon: CheckCircle2,
    title: 'Case Tracking',
    desc: 'Organize follow-up actions, reference numbers and important milestones.',
  },
];

export function WorkflowCard() {
  return (
    <aside className="gs-workflow-preview-card" aria-label="Consumer case workflow stages">
      <div className="gs-workflow-card-header">
        <div className="gs-workflow-header-top">
          <h2 className="gs-workflow-card-title">A CLEAR PATH TO CONSUMER RESOLUTION</h2>
          <span className="gs-workflow-card-label">5-Stage Workflow</span>
        </div>
        <p className="gs-workflow-card-desc">
          From documenting your complaint to understanding your next steps, GraahakSaarthi helps
          you stay organized at every stage.
        </p>
      </div>

      <div className="gs-workflow-step-list">
        {WORKFLOW_STAGES.map((stage) => {
          const Icon = stage.icon;
          return (
            <div key={stage.step} className="gs-workflow-step-item">
              <span className="gs-step-num" aria-hidden="true">
                {stage.step}
              </span>
              <div className="gs-workflow-step-content">
                <div className="gs-workflow-step-title">
                  <Icon
                    size={15}
                    className="gs-workflow-step-icon"
                    aria-hidden="true"
                  />
                  <span>{stage.title}</span>
                </div>
                <p className="gs-workflow-step-desc">{stage.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
