import React from 'react';

const BarChart = ({ data, maxValue = 100 }) => {
  const chartHeight = 200;
  const padding = 30;
  const barWidth = 45;
  const gap = 25;
  
  const width = data.length * (barWidth + gap) + padding * 2;
  const height = chartHeight + padding * 2;

  return (
    <div className="bar-chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* Y-axis gridlines */}
        {[0, 25, 50, 75, 100].map((gridVal) => {
          const y = height - padding - (gridVal / maxValue) * chartHeight;
          return (
            <g key={gridVal}>
              <line 
                x1={padding} 
                y1={y} 
                x2={width - padding} 
                y2={y} 
                stroke="var(--border-color)" 
                strokeDasharray="4 4" 
              />
              <text 
                x={padding - 8} 
                y={y + 4} 
                fill="var(--text-muted)" 
                fontSize="10" 
                textAnchor="end"
              >
                {gridVal}
              </text>
            </g>
          );
        })}

        {/* X-axis base line */}
        <line 
          x1={padding} 
          y1={height - padding} 
          x2={width - padding} 
          y2={height - padding} 
          stroke="var(--border-color)" 
          strokeWidth="1.5" 
        />

        {/* Bars */}
        {data.map((item, idx) => {
          const barHeight = (item.value / maxValue) * chartHeight;
          const x = padding + idx * (barWidth + gap) + gap / 2;
          const y = height - padding - barHeight;

          return (
            <g key={item.label} className="bar-group">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="6"
                fill="url(#barGradient)"
                className="chart-bar"
              />
              {/* Value Text */}
              <text 
                x={x + barWidth / 2} 
                y={y - 8} 
                fill="var(--text-primary)" 
                fontSize="11" 
                fontWeight="600" 
                textAnchor="middle"
              >
                {item.value.toFixed(0)}%
              </text>
              {/* Label Text */}
              <text 
                x={x + barWidth / 2} 
                y={height - padding + 18} 
                fill="var(--text-secondary)" 
                fontSize="9" 
                textAnchor="middle"
                className="bar-label"
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {/* Gradient Definition */}
        <defs>
          <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent-primary)" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>

      <style>{`
        .bar-chart-container {
          width: 100%;
          max-height: 260px;
        }

        .chart-bar {
          transition: all var(--transition-normal);
          cursor: pointer;
        }

        .bar-group:hover .chart-bar {
          filter: brightness(1.2) drop-shadow(0 0 8px rgba(99, 102, 241, 0.4));
        }

        .bar-label {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default BarChart;
