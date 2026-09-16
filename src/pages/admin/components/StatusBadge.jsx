const variants = {
  Active:     'admin-badge-success',
  Paid:       'admin-badge-success',
  Approved:   'admin-badge-success',
  Delivered:  'admin-badge-success',
  active:     'admin-badge-success',

  Pending:    'admin-badge-warning',
  Preparing:  'admin-badge-warning',
  Processing: 'admin-badge-warning',
  'In Transit': 'admin-badge-warning',
  New:        'admin-badge-warning',

  Blocked:    'admin-badge-danger',
  Failed:     'admin-badge-danger',
  Rejected:   'admin-badge-danger',
  Cancelled:  'admin-badge-danger',
  Returned:   'admin-badge-danger',
  'Out of Stock': 'admin-badge-danger',

  Shipped:    'admin-badge-info',
  Waiting:    'admin-badge-info',

  default:    'admin-badge-neutral',
};

export default function StatusBadge({ status, dot = false }) {
  const className = variants[status] || variants.default;

  return (
    <span className={`admin-badge ${className}`}>
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
          }}
        />
      )}
      {status}
    </span>
  );
}
