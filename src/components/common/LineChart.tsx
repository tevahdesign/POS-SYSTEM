import React, { useState } from 'react';

interface ChartPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: ChartPoint[];
  period?: 'Day' | 'Week' | 'Month';
  onPeriodChange?: (period: 'Day' | 'Week' | 'Month') => void;
  height?: number;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  period = 'Week',
  onPeriodChange,
  height = 200
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ point: ChartPoint; x: number; y: number } | null>(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value), 100);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const padding = { top: 20, right: 20, bottom: 30, left: 45 };

  const width = 600; // viewBox SVG width
  const svgHeight = height;

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = svgHeight - padding.top - padding.bottom;

  // Calculate coordinates
  const points = data.map((d, index) => {
    const x = padding.left + (index / (data.length - 1)) * graphWidth;
    const y = padding.top + graphHeight - ((d.value - minValue) / (maxValue - minValue)) * graphHeight;
    return { x, y, data: d };
  });

  // Construct SVG Path String
  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cx = (prev.x + point.x) / 2;
    return `${acc} C ${cx} ${prev.y}, ${cx} ${point.y}, ${point.x} ${point.y}`;
  }, '');

  // Fill area under path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding.bottom} L ${points[0].x} ${svgHeight - padding.bottom} Z`;

  return (
    <div className="line-chart-container">
      <div className="chart-header">
        <span className="section-title">Sales Overview</span>
        <div className="chart-period-tabs">
          {(['Day', 'Week', 'Month'] as const).map(p => (
            <button
              key={p}
              className={`period-btn ${period === p ? 'active' : ''}`}
              onClick={() => onPeriodChange && onPeriodChange(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="chart-svg-wrapper">
        <svg viewBox={`0 0 ${width} ${svgHeight}`} className="line-chart-svg">
          <defs>
            <linearGradient id="orangeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + graphHeight * ratio;
            const val = Math.round(maxValue - ratio * (maxValue - minValue));
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#EAEAEA"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="chart-axis-label"
                >
                  ₹{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Area Gradient */}
          <path d={areaD} fill="url(#orangeGradient)" />

          {/* Smooth Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#F97316"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points & X-Labels */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                fill="#FFFFFF"
                stroke="#F97316"
                strokeWidth="2"
                className="chart-point"
                onMouseEnter={() => setHoveredPoint({ point: pt.data, x: pt.x, y: pt.y })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={pt.x}
                y={svgHeight - 10}
                textAnchor="middle"
                className="chart-axis-label"
              >
                {pt.data.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint && (
          <div
            className="chart-tooltip"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / svgHeight) * 100}%`
            }}
          >
            <div className="tooltip-label">{hoveredPoint.point.label}</div>
            <div className="tooltip-val">₹{hoveredPoint.point.value.toLocaleString()}</div>
          </div>
        )}
      </div>

      <style>{`
        .line-chart-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chart-period-tabs {
          display: flex;
          background: #F3F4F6;
          padding: 2px;
          border-radius: 6px;
        }

        .period-btn {
          font-size: 11px;
          font-weight: 500;
          padding: 4px 10px;
          border-radius: 4px;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .period-btn.active {
          background: #FFFFFF;
          color: var(--primary-orange);
          font-weight: 600;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }

        .chart-svg-wrapper {
          position: relative;
          width: 100%;
        }

        .line-chart-svg {
          width: 100%;
          height: auto;
          overflow: visible;
        }

        .chart-axis-label {
          font-size: 10px;
          fill: #9CA3AF;
          font-family: var(--font-family);
        }

        .chart-point {
          cursor: pointer;
          transition: r 0.15s ease;
        }

        .chart-point:hover {
          r: 6;
          fill: var(--primary-orange);
        }

        .chart-tooltip {
          position: absolute;
          transform: translate(-50%, -120%);
          background: #1F2937;
          color: #FFFFFF;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 11px;
          pointer-events: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          white-space: nowrap;
          z-index: 10;
        }

        .tooltip-label {
          font-size: 10px;
          color: #9CA3AF;
        }

        .tooltip-val {
          font-weight: 700;
          color: var(--primary-orange);
        }
      `}</style>
    </div>
  );
};
