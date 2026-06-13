import React from 'react';

const KPICard = ({ title, value, icon, description, trend, trendType = 'neutral', color = 'indigo' }) => {
  const accentColors = {
    indigo: 'var(--accent-primary)',
    emerald: 'var(--accent-success)',
    amber: 'var(--accent-warning)',
    red: 'var(--accent-danger)',
    sky: 'var(--accent-info)'
  };

  const selectedColor = accentColors[color] || accentColors.indigo;

  return (
    <div className="glass-card hoverable kpi-card">
      <div className="kpi-header">
        <div className="kpi-info">
          <span className="kpi-title">{title}</span>
          <h2 className="kpi-value">{value}</h2>
        </div>
        <div className="kpi-icon-wrapper" style={{ backgroundColor: `${selectedColor}15`, color: selectedColor }}>
          {icon}
        </div>
      </div>
      {(description || trend) && (
        <div className="kpi-footer">
          {trend && (
            <span className={`kpi-trend trend-${trendType}`}>
              {trend}
            </span>
          )}
          {description && <span className="kpi-desc">{description}</span>}
        </div>
      )}

      <style>{`
        .kpi-card {
          position: relative;
          overflow: hidden;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: ${selectedColor};
          border-radius: 4px 0 0 4px;
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .kpi-title {
          font-size: 0.875rem;
          color: var(--text-secondary);
          font-weight: 500;
          display: block;
          margin-bottom: 0.5rem;
        }

        .kpi-value {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
        }

        .kpi-icon-wrapper {
          padding: 0.75rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-footer {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
        }

        .kpi-trend {
          font-weight: 600;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
        }

        .kpi-trend.trend-positive {
          background-color: var(--accent-success-glow);
          color: var(--accent-success);
        }

        .kpi-trend.trend-negative {
          background-color: var(--accent-danger-glow);
          color: var(--accent-danger);
        }

        .kpi-trend.trend-neutral {
          background-color: var(--border-color);
          color: var(--text-secondary);
        }

        .kpi-desc {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};

export default KPICard;
