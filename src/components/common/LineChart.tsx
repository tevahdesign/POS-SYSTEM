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
  height = 150
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ point: ChartPoint; x: number; y: number } | null>(null);

  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value), 100);
  const minValue = Math.min(...data.map(d => d.value), 0);
  const padding = { top: 14, right: 16, bottom: 22, left: 38 };

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
        <span className="section-title" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#000000', fontSize: '13px', fontWeight: 800 }}>Sales Overview</span>
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
            <linearGradient id="uberEatsGreenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06C167" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#06C167" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = padding.top + graphHeight * ratio;
            const val = Math.round(maxValue - ratio * (maxValue - minValue));
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#EEEEEE"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="chart-axis-label"
                >
                  ₹{val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Area Gradient */}
          <path d={areaD} fill="url(#uberEatsGreenGradient)" />

          {/* Smooth Line Path - Reduced Thin Stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#06C167"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Data Points & X-Labels */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="3"
                fill="#FFFFFF"
                stroke="#06C167"
                strokeWidth="1.5"
                className="chart-point"
                onMouseEnter={() => setHoveredPoint({ point: pt.data, x: pt.x, y: pt.y })}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={pt.x}
                y={svgHeight - 6}
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
          gap: 8px;
          width: 100%;
        }

        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chart-period-tabs {
          display: flex;
          background: #F6F6F6;
          padding: 2px;
          border-radius: 9999px;
          border: 1px solid #EEEEEE;
        }

        .period-btn {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 9999px;
          border: none;
          background: transparent;
          color: #545454;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .period-btn.active {
          background: #000000;
          color: #FFFFFF;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
          font-size: 8.5px;
          fill: #545454;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .chart-point {
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .chart-point:hover {
          r: 4.5;
          fill: #06C167;
          stroke: #FFFFFF;
        }

        .chart-tooltip {
          position: absolute;
          transform: translate(-50%, -125%);
          background: #000000;
          border: 1px solid #141414;
          color: #FFFFFF;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 10px;
          pointer-events: none;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          white-space: nowrap;
          z-index: 10;
        }

        .tooltip-label {
          font-size: 9px;
          color: #AFAFAF;
        }

        .tooltip-val {
          font-weight: 800;
          color: #06C167;
          font-size: 10.5px;
        }
      `}</style>
    </div>
  );
};
