import { forwardRef, useId } from 'react';

export const Select = forwardRef(function Select(
  { label, error, hint, required = false, id, options = [], placeholder, className = '', children, ...rest },
  ref
) {
  const generatedId = useId();
  const selectId = id || generatedId;

  return (
    <div className="gs-field">
      {label && (
        <label htmlFor={selectId} className="gs-label">
          {label}
          {required && <span className="gs-label-required">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`gs-select ${error ? 'gs-input-error' : ''} ${className}`.trim()}
        aria-invalid={Boolean(error)}
        {...rest}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
        {children}
      </select>
      {error && (
        <span className="gs-error-text" role="alert">
          {error}
        </span>
      )}
      {!error && hint && <span className="gs-hint">{hint}</span>}
    </div>
  );
});
