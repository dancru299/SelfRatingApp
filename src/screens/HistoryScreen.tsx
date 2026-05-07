import { Sparkles, Filter, Download } from "lucide-react";
import type { RatingEntry } from "../types";
import { categoryLabels } from "../data";
import { averageScore, formatShortDate } from "../utils";
import { HeatmapCard } from "../components/Charts";

type Props = {
  ratings: RatingEntry[];
};

export function HistoryScreen({ ratings }: Props) {
  const latestNotes = ratings.slice(-3).reverse();

  return (
    <div className="history-screen">
      <section className="history-hero card">
        <div>
          <h2>Lịch sử & phân tích</h2>
          <p>Nhìn tuần này, tháng này và những điểm cần chú ý nhất.</p>
        </div>
        <div className="history-hero__actions">
          <button type="button" className="chip chip--muted">
            <Filter size={14} />
            Tuần này
          </button>
          <button type="button" className="chip chip--muted">
            <Download size={14} />
            PDF Premium
          </button>
        </div>
      </section>

      <div className="history-grid">
        <HeatmapCard entries={ratings} />

        <div className="card analysis-card">
          <div className="section-head section-head--tight">
            <div>
              <h3>
                <Sparkles size={16} /> AI insight highlights
              </h3>
              <p>Tóm tắt theo note gần nhất</p>
            </div>
          </div>

          <div className="analysis-list">
            {latestNotes.map((entry) => {
              const average = Object.values(entry.scores).reduce((sum, score) => sum + score, 0) / 5;
              return (
                <article key={entry.date} className="analysis-item">
                  <div className="analysis-item__head">
                    <strong>{formatShortDate(entry.date)}</strong>
                    <span>Điểm TB {average.toFixed(1)}</span>
                  </div>
                  <p>{entry.note}</p>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <div className="history-card-grid">
        {Object.entries(categoryLabels).map(([key, label]) => {
          const average = averageScore(ratings, key as keyof typeof categoryLabels);
          return (
            <div key={key} className="card stat-card">
              <span>{label}</span>
              <strong>{average.toFixed(1)}</strong>
              <p>Trung bình 7 ngày gần nhất</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
