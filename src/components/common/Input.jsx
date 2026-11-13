import { forwardRef, useId } from 'react';

export const Input = forwardRef(function Input(
  { label, error, hint, required = false, id, className = '', ...rest },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="gs-field">
      {label && (
        <label htmlFor={inputId} className="gs-label">
          {label}
          {required && <span className="gs-label-required">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`gs-input ${error ? 'gs-input-error' : ''} ${className}`.trim()}
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
