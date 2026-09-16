import { motion } from 'framer-motion';

const colorMap = {
  gold:    { bg: 'var(--admin-gold-bg)',    color: 'var(--admin-gold)' },
  success: { bg: 'var(--admin-success-bg)', color: 'var(--admin-success)' },
  warning: { bg: 'var(--admin-warning-bg)', color: 'var(--admin-warning)' },
  danger:  { bg: 'var(--admin-danger-bg)',  color: 'var(--admin-danger)' },
  info:    { bg: 'var(--admin-info-bg)',    color: 'var(--admin-info)' },
};

export default function StatCard({ icon: Icon, label, value, trend, trendLabel, color = 'gold', delay = 0 }) {
  const c = colorMap[color] || colorMap.gold;

  return (
    <motion.div
      className="admin-stat-card"
      style={{ '--stat-color': c.color }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay * 0.1 }}
    >
      <div className="admin-stat-icon" style={{ background: c.bg, color: c.color }}>
        {Icon && <Icon size={22} />}
      </div>
      <div className="admin-stat-value">{value}</div>
      <div className="admin-stat-label">{label}</div>
      {trend !== undefined && (
        <div className={`admin-stat-trend ${trend >= 0 ? 'up' : 'down'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          {trendLabel && <span style={{ fontWeight: 400, marginLeft: 4 }}>{trendLabel}</span>}
        </div>
      )}
    </motion.div>
  );
}
