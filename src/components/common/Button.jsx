import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  block = false,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon,
  ...rest
}) {
  const variantClass = `gs-btn-${variant}`;
  const sizeClass = size === 'sm' ? 'gs-btn-sm' : size === 'lg' ? 'gs-btn-lg' : '';
  const blockClass = block ? 'gs-btn-block' : '';

  return (
    <button
      type={type}
      className={`gs-btn ${variantClass} ${sizeClass} ${blockClass} ${className}`.trim()}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="gs-spinner" aria-hidden="true" />
      ) : Icon ? (
        <Icon size={16} aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}
