export default function FormField({
  label,
  error,
  required,
  children,
  type = 'text',
  className = '',
  hint,
  ...inputProps
}) {
  // If children are provided, render them directly (for custom inputs)
  if (children) {
    return (
      <div className={`admin-form-group ${className}`}>
        {label && (
          <label className="admin-form-label">
            {label} {required && <span style={{ color: 'var(--admin-danger)' }}>*</span>}
          </label>
        )}
        {children}
        {hint && <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: 4 }}>{hint}</p>}
        {error && <p className="admin-form-error">{error}</p>}
      </div>
    );
  }

  const inputClass = `admin-form-input ${type === 'select' ? 'admin-form-select' : ''} ${type === 'textarea' ? 'admin-form-textarea' : ''}`;
  const Tag = type === 'textarea' ? 'textarea' : type === 'select' ? 'select' : 'input';

  return (
    <div className={`admin-form-group ${className}`}>
      {label && (
        <label className="admin-form-label">
          {label} {required && <span style={{ color: 'var(--admin-danger)' }}>*</span>}
        </label>
      )}
      <Tag
        className={inputClass}
        type={type !== 'select' && type !== 'textarea' ? type : undefined}
        {...inputProps}
      />
      {hint && <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-muted)', marginTop: 4 }}>{hint}</p>}
      {error && <p className="admin-form-error">{error}</p>}
    </div>
  );
}
