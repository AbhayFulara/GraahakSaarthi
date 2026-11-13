export const BRAND = {
  name: 'GraahakSaarthi',
  tagline: 'Shikayat Se Samadhan Tak.',
};

export const MVP_ISSUE_CATEGORIES = [
  {
    id: 'ecommerce_dispute',
    label: 'E-Commerce Dispute',
    description: 'Order cancellations, platform billing, marketplace seller disputes, or unfair return denials.',
  },
  {
    id: 'defective_damaged_incorrect',
    label: 'Defective, Damaged or Incorrect Product',
    description: 'Received broken, faulty, counterfeit, or wrong items different from what was ordered.',
  },
  {
    id: 'refund_replacement',
    label: 'Refund & Replacement Problem',
    description: 'Delayed refunds, rejected returns within policy window, or unfulfilled replacement promises.',
  },
  {
    id: 'delivery_issue',
    label: 'Delivery-Related Issue',
    description: 'Non-delivery, fake delivery status, extreme delays, or courier tampering.',
  },
  {
    id: 'warranty_rejection',
    label: 'Warranty Rejection',
    description: 'Refusal of valid warranty repair/replacement or unfair service centre excuses.',
  },
  {
    id: 'misleading_description',
    label: 'Misleading Product Description',
    description: 'Product specifications, quantity, features, or pricing advertised misleadingly.',
  },
  {
    id: 'poor_service',
    label: 'Poor Service Delivery',
    description: 'Deficient installation, telecom, subscription, repair, or customer service.',
  },
  {
    id: 'unfair_charges',
    label: 'Unfair Charges',
    description: 'Hidden fees, unauthorized deductions, dark patterns, or overcharging beyond MRP.',
  },
];

export const REQUESTED_REMEDIES = [
  { value: 'full_refund', label: 'Full Refund of Paid Amount' },
  { value: 'replacement', label: 'Product Replacement' },
  { value: 'free_repair', label: 'Free Warranty Repair / Service' },
  { value: 'refund_extra_charges', label: 'Refund of Unfair / Extra Charges' },
  { value: 'delivery_completion', label: 'Immediate Delivery Completion' },
  { value: 'other', label: 'Other Remedy' },
];

export const EVIDENCE_CLASSIFICATIONS = {
  STRONG: { label: 'STRONG', tone: 'success', description: 'Directly verifies the core claim' },
  SUPPORTING: { label: 'SUPPORTING', tone: 'info', description: 'Corroborates timeline or context' },
  WEAK: { label: 'WEAK', tone: 'warning', description: 'Incomplete or indirect proof' },
  MISSING: { label: 'MISSING', tone: 'danger', description: 'Recommended evidence not yet provided' },
  CONFLICTING: { label: 'CONFLICTING', tone: 'danger', description: 'Contains details inconsistent with other records' },
  UNVERIFIED: { label: 'UNVERIFIED', tone: 'neutral', description: 'Pending future verification' },
};

export const EVIDENCE_DOCUMENT_TYPES = [
  { value: 'invoice', label: 'Invoice / Tax Bill' },
  { value: 'receipt', label: 'Payment Receipt / Transaction Proof' },
  { value: 'screenshot', label: 'Order / Chat / Listing Screenshot' },
  { value: 'warranty', label: 'Warranty Card / Policy Document' },
  { value: 'photo_video', label: 'Product Defect Photo / Packaging Proof' },
  { value: 'communication', label: 'Email / Customer Support Transcript' },
  { value: 'other', label: 'Other Supporting Document' },
];

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi (NCT)',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Ladakh',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep',
];

export const SUPPORTED_UPLOAD_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const CASE_STATUSES = [
  'Open',
  'Evidence Pending',
  'In Progress',
  'Draft Ready',
  'Submitted Externally',
  'Resolved',
  'Closed',
];
