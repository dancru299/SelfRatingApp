import type { Category, CategoryKey, RatingEntry } from "../types";
import { categories } from "../data";
import { averageScore, getWeekDates, formatShortDate, toDateKey } from "../utils";

type TrendChartProps = {
  entries: RatingEntry[];
  previewScores?: Record<CategoryKey, number>;
};

const width = 640;
const height = 280;

const palette = new Map<CategoryKey, Category>(categories.map((item) => [item.key, item]));

const createPath = (points: Array<{ x: number; y: number }>) =>
  points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");

const linePoints = (values: number[], min = 1, max = 5) => {
  const horizontalPadding = 32;
  const verticalPadding = 24;
  const spanX = width - horizontalPadding * 2;
  const spanY = height - verticalPadding * 2;
  return values.map((value, index) => {
    const x = horizontalPadding + (index / Math.max(values.length - 1, 1)) * spanX;
    const normalized = (value - min) / (max - min);
    const y = height - verticalPadding - normalized * spanY;
    return { x, y };
  });
};

export function TrendChart({ entries, previewScores }: TrendChartProps) {
  const dates = getWeekDates(7);
  const series = categories.map((category) => ({
    ...category,
    values: dates.map((date) => {
      const entry = entries.find((item) => item.date === date);
      if (entry) return entry.scores[category.key];
      if (date === toDateKey(new Date()) && previewScores) return previewScores[category.key];
      return 0;
    }),
  }));

  return (
    <div className="chart-card">
      <div className="section-head section-head--tight">
        <div>
          <h3>Biểu đồ xu hướng</h3>
          <p>7 ngày qua</p>
        </div>
        <span className="chip chip--muted">Tự động cập nhật</span>
      </div>
      <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Biểu đồ xu hướng 7 ngày">
        {[1, 2, 3, 4, 5].map((tick) => {
          const y = 24 + ((5 - tick) / 4) * (height - 48);
          return (
            <g key={tick}>
              <line x1="32" y1={y} x2={width - 32} y2={y} className="chart-grid" />
              <text x="16" y={y + 4} className="chart-label">
                {tick}
              </text>
            </g>
          );
        })}

        {series.map((seriesItem) => {
          const points = linePoints(seriesItem.values);
          return (
            <g key={seriesItem.key}>
              <path d={createPath(points)} fill="none" stroke={seriesItem.color} strokeWidth="2.5" strokeLinecap="round" />
              {points.map((point, index) => (
                <circle key={index} cx={point.x} cy={point.y} r="3.5" fill={seriesItem.color} />
              ))}
            </g>
          );
        })}

        {dates.map((date, index) => {
          const x = 32 + (index / Math.max(dates.length - 1, 1)) * (width - 64);
          return (
            <text key={date} x={x} y={height - 4} textAnchor="middle" className="chart-label">
              {formatShortDate(date)}
            </text>
          );
        })}
      </svg>

      <div className="legend-row">
        {categories.map((category) => (
          <span key={category.key} className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: category.color }} />
            {category.label}
          </span>
        ))}
      </div>
    </div>
  );
}

type RadarChartProps = {
  entries: RatingEntry[];
};

export function RadarChart({ entries }: RadarChartProps) {
  const avg = categories.map((category) => averageScore(entries, category.key));
  const radius = 84;
  const center = 132;

  const points = avg.map((value, index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / categories.length;
    const normalized = value / 5;
    return {
      x: center + Math.cos(angle) * radius * normalized,
      y: center + Math.sin(angle) * radius * normalized,
    };
  });

  const gridPoints = (scale: number) =>
    categories
      .map((_, index) => {
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / categories.length;
        return {
          x: center + Math.cos(angle) * radius * scale,
          y: center + Math.sin(angle) * radius * scale,
        };
      })
      .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
      .join(" ") + " Z";

  const polygon = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ") + " Z";

  return (
    <div className="chart-card chart-card--radar">
      <div className="section-head section-head--tight">
        <div>
          <h3>Tổng quan (7 ngày)</h3>
          <p>Điểm trung bình theo khía cạnh</p>
        </div>
        <span className="chip chip--muted">Radar</span>
      </div>
      <svg className="radar-chart" viewBox="0 0 264 264" role="img" aria-label="Biểu đồ radar">
        {[0.35, 0.6, 0.85, 1].map((scale) => (
          <path key={scale} d={gridPoints(scale)} className="radar-grid" />
        ))}

        {categories.map((category, index) => {
          const angle = -Math.PI / 2 + (Math.PI * 2 * index) / categories.length;
          const x = center + Math.cos(angle) * (radius + 20);
          const y = center + Math.sin(angle) * (radius + 20);
          return (
            <g key={category.key}>
              <line x1={center} y1={center} x2={x} y2={y} className="radar-axis" />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="chart-label chart-label--radar">
                {category.label}
              </text>
            </g>
          );
        })}

        <path d={polygon} className="radar-fill" />
        <path d={polygon} className="radar-outline" />
      </svg>
    </div>
  );
}

type HeatmapCardProps = {
  entries: RatingEntry[];
};

export function HeatmapCard({ entries }: HeatmapCardProps) {
  const dates = getWeekDates(28);
  return (
    <div className="chart-card heatmap-card">
      <div className="section-head section-head--tight">
        <div>
          <h3>Lịch sử</h3>
          <p>Nhịp chấm trong 4 tuần</p>
        </div>
        <span className="chip chip--muted">Calendar heatmap</span>
      </div>
      <div className="heatmap">
        <div className="heatmap__labels">
          <span>T2</span>
          <span>T3</span>
          <span>T4</span>
          <span>T5</span>
          <span>T6</span>
          <span>T7</span>
          <span>CN</span>
        </div>
        <div className="heatmap__grid">
          {dates.map((date) => {
            const entry = entries.find((item) => item.date === date);
            const average = entry
              ? Object.values(entry.scores).reduce((sum, value) => sum + value, 0) / 5
              : 0;
            return (
              <span
                key={date}
                className={`heatmap__cell heatmap__cell--${Math.round(average)}`}
                title={`${date}: ${average.toFixed(1)}`}
              />
            );
          })}
        </div>
      </div>
      <div className="heatmap-legend">
        {["Không chấm", "1-2", "3", "4", "5"].map((label, index) => (
          <span key={label} className="legend-item legend-item--heat">
            <span className={`legend-swatch legend-swatch--${index}`} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
