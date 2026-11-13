import { forwardRef, useId } from 'react';

export const Textarea = forwardRef(function Textarea(
  { label, error, hint, required = false, id, className = '', ...rest },
  ref
) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <div className="gs-field">
      {label && (
        <label htmlFor={textareaId} className="gs-label">
          {label}
          {required && <span className="gs-label-required">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={`gs-textarea ${error ? 'gs-input-error' : ''} ${className}`.trim()}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && (
        <span className="gs-error-text" role="alert">
          {error}
        </span>
      )}
      {!error && hint && <span className="gs-hint">{hint}</span>}
    </div>
  );
});
