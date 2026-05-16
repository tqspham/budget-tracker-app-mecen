'use client';

import { Budget } from '@/lib/budgetStore';

interface CategoryAggregate {
  category: string;
  total: number;
}

interface DateAggregate {
  date: string;
  total: number;
}

function getCategoryBreakdown(budgets: Budget[]): CategoryAggregate[] {
  const categoryMap = new Map<string, number>();
  budgets.forEach((budget) => {
    const cat = budget.category || 'Other';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + budget.allocated_amount);
  });
  return Array.from(categoryMap.entries()).map(([category, total]) => ({
    category,
    total,
  }));
}

function getTimeSeriesData(budgets: Budget[]): DateAggregate[] {
  const dateMap = new Map<string, number>();
  budgets.forEach((budget) => {
    const date = budget.budget_date || new Date().toISOString().split('T')[0];
    dateMap.set(date, (dateMap.get(date) || 0) + budget.allocated_amount);
  });

  const sortedDates = Array.from(dateMap.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, total]) => ({ date, total }));

  return sortedDates;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
}

function PieChartRefined({ data }: { data: CategoryAggregate[] }): JSX.Element {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-[var(--color-background)] rounded-lg">
        <p className="text-[var(--color-muted-text)] text-sm">No data available yet</p>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.total, 0);
  const colors = [
    '#2BA89D',
    '#6B8E8A',
    '#0F5E5A',
    '#C8944C',
    '#3B8F6C',
  ];

  let cumulativePercent = 0;
  const segments = data.map((item, idx) => {
    const percent = (item.total / total) * 100;
    const startAngle = (cumulativePercent * 360) / 100;
    const endAngle = ((cumulativePercent + percent) * 360) / 100;
    cumulativePercent += percent;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = percent > 50 ? 1 : 0;
    const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      path: pathData,
      color: colors[idx % colors.length],
      label: item.category,
      value: item.total,
      percent,
    };
  });

  return (
    <div className="flex flex-col items-center space-y-6">
      <svg viewBox="0 0 100 100" className="w-full max-w-xs aspect-square">
        {segments.map((segment, idx) => (
          <g key={idx} className="chart-segment" style={{ opacity: 0, animation: `fadeInSegment 0.4s ease-out ${idx * 0.08}s forwards` }}>
            <path
              d={segment.path}
              fill={segment.color}
              stroke="white"
              strokeWidth="0.5"
              className="transition-transform duration-200 cursor-pointer hover:scale-105"
              style={{ transformOrigin: '50px 50px', transformBox: 'fill-box' }}
            />
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {segments.map((segment, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: segment.color }}
            ></div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-text)] text-sm">{segment.label}</p>
              <p className="text-[var(--color-muted-text)] text-xs font-mono">{formatCurrency(segment.value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChartRefined({ data }: { data: DateAggregate[] }): JSX.Element {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-[var(--color-background)] rounded-lg">
        <p className="text-[var(--color-muted-text)] text-sm">No data available yet</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.total));
  const minValue = 0;
  const range = maxValue - minValue || 1;

  const padding = 16;
  const width = 320;
  const height = 160;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const points = data.map((item, idx) => {
    const x = padding + (idx / Math.max(data.length - 1, 1)) * chartWidth;
    const y = height - padding - ((item.total - minValue) / range) * chartHeight;
    return { x, y, ...item };
  });

  const pathData = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  const gridLineColor = 'rgba(229, 225, 219, 0.4)';

  return (
    <div className="space-y-4 h-full flex flex-col">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full bg-white rounded-lg border border-[var(--color-border)] flex-1">
        <defs>
          <linearGradient id="areaGradientRefined" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#2BA89D', stopOpacity: 0.08 }} />
            <stop offset="100%" style={{ stopColor: '#2BA89D', stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((fraction, idx) => {
          const y = height - padding - fraction * chartHeight;
          return (
            <line
              key={`gridH-${idx}`}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke={gridLineColor}
              strokeWidth="0.3"
            />
          );
        })}

        {/* Axes */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#E5E1DB"
          strokeWidth="0.5"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={padding}
          y2={padding}
          stroke="#E5E1DB"
          strokeWidth="0.5"
        />

        {/* Y-axis labels */}
        <text x={padding - 3} y={padding - 2} fontSize="2.5" textAnchor="end" fill="#747470">
          {formatCurrency(maxValue)}
        </text>
        <text x={padding - 3} y={height - padding + 3} fontSize="2.5" textAnchor="end" fill="#747470">
          {formatCurrency(0)}
        </text>

        {/* Area fill */}
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${height - padding} Z`}
          fill="url(#areaGradientRefined)"
        />

        {/* Line path */}
        <path d={pathData} stroke="#2BA89D" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points and labels */}
        {points.map((p, idx) => (
          <g key={idx}>
            <text
              x={p.x}
              y={height - padding + 6}
              fontSize="2.5"
              textAnchor="middle"
              fill="#747470"
            >
              {formatDateShort(p.date)}
            </text>
            <circle
              cx={p.x}
              cy={p.y}
              r="1.2"
              fill="#2BA89D"
              className="transition-all duration-200 cursor-pointer hover:r-2"
              style={{ filter: 'drop-shadow(0 1px 2px rgba(26, 26, 24, 0.04))' }}
            />
          </g>
        ))}
      </svg>
      <div className="text-xs text-[var(--color-muted-text)] px-2">
        <p>
          <span className="font-semibold text-[var(--color-text)]">Total Budgeted:</span> <span className="font-mono">{formatCurrency(data.reduce((sum, d) => sum + d.total, 0))}</span>
        </p>
      </div>
    </div>
  );
}

export default function BudgetCharts({ budgets }: { budgets: Budget[] }): JSX.Element {
  const categoryData = getCategoryBreakdown(budgets);
  const timeSeriesData = getTimeSeriesData(budgets);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Budget by Category - Left Column (1/3 width on desktop) */}
      <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-8 flex flex-col items-center" style={{ boxShadow: '0 2px 4px rgba(26, 26, 24, 0.04)' }}>
        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Budget by Category</h3>
        <PieChartRefined data={categoryData} />
      </div>

      {/* Budget Over Time - Right Column (2/3 width on desktop) */}
      <div className="md:col-span-2 bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-8 flex flex-col" style={{ boxShadow: '0 2px 4px rgba(26, 26, 24, 0.04)' }}>
        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Budget Over Time</h3>
        <LineChartRefined data={timeSeriesData} />
      </div>
    </div>
  );
}