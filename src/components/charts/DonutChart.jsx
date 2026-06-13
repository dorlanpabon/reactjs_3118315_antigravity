import React from 'react';

const DonutChart = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  
  // SVG Ring Settings
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;

  return (
    <div className="donut-chart-wrapper">
      <div className="chart-circle-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {total === 0 ? (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              stroke="var(--border-color)"
              strokeWidth={strokeWidth}
            />
          ) : (
            data.map((slice) => {
              const percentage = slice.value / total;
              const dashArray = `${percentage * circumference} ${circumference}`;
              const strokeOffset = currentOffset;
              
              // Rotate cumulative offset for the next slices
              currentOffset -= percentage * circumference;

              return (
                <circle
                  key={slice.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={strokeOffset}
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                  className="donut-slice"
                />
              );
            })
          )}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - strokeWidth / 2}
            fill="var(--bg-secondary)"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="#fff"
            fontSize="18"
            fontWeight="700"
          >
            {total}
          </text>
          <text
            x="50%"
            y="65%"
            dominantBaseline="middle"
            textAnchor="middle"
            fill="var(--text-secondary)"
            fontSize="10"
            fontWeight="500"
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            Total
          </text>
        </svg>
      </div>

      <div className="donut-legend">
        {data.map((slice) => (
          <div key={slice.label} className="legend-item">
            <span 
              className="legend-color-dot" 
              style={{ backgroundColor: slice.color }}
            ></span>
            <span className="legend-label">{slice.label}</span>
            <span className="legend-value">{slice.value} ({total > 0 ? Math.round((slice.value / total) * 100) : 0}%)</span>
          </div>
        ))}
      </div>

      <style>{`
        .donut-chart-wrapper {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          justify-content: center;
        }

        .chart-circle-container {
          flex-shrink: 0;
        }

        .donut-slice {
          transition: stroke-width var(--transition-fast) ease;
          cursor: pointer;
        }

        .donut-slice:hover {
          stroke-width: ${strokeWidth + 2};
        }

        .donut-legend {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .legend-color-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: block;
        }

        .legend-label {
          color: var(--text-secondary);
        }

        .legend-value {
          color: #fff;
          font-weight: 600;
          margin-left: auto;
        }

        @media (max-width: 640px) {
          .donut-chart-wrapper {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DonutChart;
