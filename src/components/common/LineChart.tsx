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
  height = 220
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ point: ChartPoint; x: number; y: number } | null>(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value), 100);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const padding = { top: 24, right: 24, bottom: 36, left: 50 };

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
        <span className="section-title" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0F172A' }}>Sales Overview</span>
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
            <linearGradient id="yokoIndigoLightGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
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
                  stroke="#E2E8F0"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
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
          <path d={areaD} fill="url(#yokoIndigoLightGradient)" />

          {/* Smooth Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#6366F1"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Data Points & X-Labels */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#FFFFFF"
                stroke="#6366F1"
                strokeWidth="2.5"
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
          gap: 16px;
          width: 100%;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chart-period-tabs {
          display: flex;
          background: #F1F5F9;
          padding: 3px;
          border-radius: 9999px;
          border: 1px solid #E2E8F0;
        }

        .period-btn {
          font-size: 11px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 9999px;
          border: none;
          background: transparent;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .period-btn.active {
          background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%);
          color: #FFFFFF;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
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
          font-size: 10.5px;
          fill: #64748B;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .chart-point {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chart-point:hover {
          r: 6.5;
          fill: #6366F1;
          stroke: #FFFFFF;
        }

        .chart-tooltip {
          position: absolute;
          transform: translate(-50%, -125%);
          background: #0F172A;
          border: 1px solid #1E293B;
          color: #FFFFFF;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 11px;
          pointer-events: none;
          box-shadow: 0 10px 25px rgba(15,23,42,0.15);
          white-space: nowrap;
          z-index: 10;
        }

        .tooltip-label {
          font-size: 10px;
          color: #94A3B8;
        }

        .tooltip-val {
          font-weight: 800;
          color: #818CF8;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
};
