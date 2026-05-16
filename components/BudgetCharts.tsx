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

function PieChartSimple({ data }: { data: CategoryAggregate[] }): JSX.Element {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-[var(--color-muted-text)]">No data available yet</p>
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
    <div className="space-y-6">
      <svg viewBox="0 0 100 100" className="w-full max-w-xs mx-auto aspect-square">
        {segments.map((segment, idx) => (
          <path key={idx} d={segment.path} fill={segment.color} stroke="white" strokeWidth="0.5" />
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-4">
        {segments.map((segment, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: segment.color }}
            ></div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[var(--color-text)] text-sm">{segment.label}</p>
              <p className="text-[var(--color-muted-text)] text-sm">{formatCurrency(segment.value)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LineChartSimple({ data }: { data: DateAggregate[] }): JSX.Element {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-[var(--color-muted-text)]">No data available yet</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.total));
  const minValue = 0;
  const range = maxValue - minValue || 1;

  const padding = 40;
  const width = 100;
  const height = 100;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  const points = data.map((item, idx) => {
    const x = padding + (idx / Math.max(data.length - 1, 1)) * chartWidth;
    const y = height - padding - ((item.total - minValue) / range) * chartHeight;
    return { x, y, ...item };
  });

  const pathData = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="space-y-6">
      <svg viewBox="0 0 100 100" className="w-full aspect-square bg-white rounded border border-[var(--color-border)]">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#2BA89D', stopOpacity: 0.1 }} />
            <stop offset="100%" style={{ stopColor: '#2BA89D', stopOpacity: 0 }} />
          </linearGradient>
        </defs>

        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="var(--color-border)"
          strokeWidth="0.5"
        />
        <line
          x1={padding}
          y1={height - padding}
          x2={padding}
          y2={padding}
          stroke="var(--color-border)"
          strokeWidth="0.5"
        />

        {data.map((item, idx) => {
          const p = points[idx];
          return (
            <g key={idx}>
              <text
                x={p.x}
                y={height - padding + 5}
                fontSize="2.5"
                textAnchor="middle"
                fill="var(--color-muted-text)"
              >
                {formatDateShort(item.date)}
              </text>
              <circle cx={p.x} cy={p.y} r="1" fill="#2BA89D" />
            </g>
          );
        })}

        <path d={pathData} stroke="#2BA89D" strokeWidth="1" fill="none" />

        <text x={5} y={padding - 5} fontSize="2.5" fill="var(--color-muted-text)">
          {formatCurrency(maxValue)}
        </text>
        <text x={5} y={height - 3} fontSize="2.5" fill="var(--color-muted-text)">
          {formatCurrency(0)}
        </text>
      </svg>
      <div className="text-sm text-[var(--color-muted-text)]">
        <p>
          <strong className="text-[var(--color-text)]">Total:</strong> {formatCurrency(data.reduce((sum, d) => sum + d.total, 0))}
        </p>
      </div>
    </div>
  );
}

export default function BudgetCharts({ budgets }: { budgets: Budget[] }): JSX.Element {
  const categoryData = getCategoryBreakdown(budgets);
  const timeSeriesData = getTimeSeriesData(budgets);

  return (
    <div className="bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] p-8 space-y-12" style={{ boxShadow: '0 2px 4px rgba(26,26,24,0.04)' }}>
      <div>
        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Budget by Category</h3>
        <div className="w-full">
          <PieChartSimple data={categoryData} />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-8">Budget Over Time</h3>
        <div className="w-full overflow-x-auto">
          <LineChartSimple data={timeSeriesData} />
        </div>
      </div>
    </div>
  );
}
