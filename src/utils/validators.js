import { MAX_UPLOAD_SIZE_BYTES, SUPPORTED_UPLOAD_MIME_TYPES } from './constants';

export function isValidEmail(value) {
  if (!value) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidIndianMobile(value) {
  if (!value) return false;
  const cleaned = value.replace(/\s+/g, '').replace(/^(\+91|91|0)/, '');
  return /^[6-9]\d{9}$/.test(cleaned);
}

export function isValidEmailOrMobile(value) {
  return isValidEmail(value) || isValidIndianMobile(value);
}

export function validateUploadFile(file) {
  if (!file) {
    return 'No file selected.';
  }
  if (!SUPPORTED_UPLOAD_MIME_TYPES.includes(file.type)) {
    return `Unsupported file type (${file.type || 'unknown'}). Upload PDF, JPG, PNG, or WEBP.`;
  }
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return 'File exceeds the 10 MB limit.';
  }
  return null;
}
