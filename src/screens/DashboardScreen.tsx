import {
  BadgeInfo,
  BriefcaseBusiness,
  ChevronRight,
  Flame,
  HeartPulse,
  Music2,
  Sparkles,
  SunMedium,
  Users,
} from "lucide-react";
import { useDeferredValue, useMemo } from "react";
import { HeatmapCard, RadarChart, TrendChart } from "../components/Charts";
import { categories, benchmarkSnapshots } from "../data";
import type { CategoryKey, Profile, RatingEntry } from "../types";
import { buildInsight, calculateStreak, getLatestEntry, toDateKey } from "../utils";

type Props = {
  profile: Profile;
  ratings: RatingEntry[];
  draftScores: Record<CategoryKey, number>;
  draftNote: string;
  onDraftScoreChange: (key: CategoryKey, value: number) => void;
  onDraftNoteChange: (value: string) => void;
  onSave: () => void;
  onNavigate: (view: "history" | "settings") => void;
};

const quickMetrics = [
  { key: "mood" as const, label: "Tâm trạng", icon: SunMedium },
  { key: "health" as const, label: "Sức khỏe", icon: HeartPulse },
  { key: "work" as const, label: "Công việc", icon: BriefcaseBusiness },
  { key: "social" as const, label: "Xã hội", icon: Users },
  { key: "entertainment" as const, label: "Giải trí", icon: Music2 },
];

export function DashboardScreen({
  profile,
  ratings,
  draftScores,
  draftNote,
  onDraftScoreChange,
  onDraftNoteChange,
  onSave,
  onNavigate,
}: Props) {
  const latest = getLatestEntry(ratings);
  const streak = calculateStreak(ratings);
  const deferredDraftScores = useDeferredValue(draftScores);
  const selectedBenchmarks = profile.tags.map((tag) => benchmarkSnapshots[tag]).filter(Boolean);

  const benchmark = useMemo(() => {
    return categories.reduce(
      (acc, category) => {
        const values = selectedBenchmarks.map((item) => item[category.key]);
        acc[category.key] =
          values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
        return acc;
      },
      { mood: 0, health: 0, work: 0, social: 0, entertainment: 0 } as Record<CategoryKey, number>,
    );
  }, [selectedBenchmarks]);

  const insight = buildInsight(latest);
  const todayKey = toDateKey(new Date());
  const alreadySaved = ratings.some((entry) => entry.date === todayKey);

  return (
    <div className="dashboard">
      <section className="dashboard-grid">
        <div className="main-column">
          <div className="checkin-card card" id="checkin">
            <div className="section-head">
              <div>
                <h2>Chấm hôm nay</h2>
                <p>Dưới 1 phút mỗi ngày</p>
              </div>
              <button type="button" className="chip chip--cta" onClick={onSave}>
                {alreadySaved ? "Cập nhật" : "Chấm ngay"}
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="rating-list">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.key} className="rating-row">
                    <div className="rating-row__meta">
                      <span
                        className="rating-row__icon"
                        style={{ color: category.color, backgroundColor: `${category.accent}22` }}
                      >
                        <Icon size={16} />
                      </span>
                      <div>
                        <strong>{category.label}</strong>
                        <span>{draftScores[category.key]}/5</span>
                      </div>
                    </div>
                    <div className="rating-row__dots" role="group" aria-label={category.label}>
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          type="button"
                          className={`score-dot ${draftScores[category.key] >= value ? "is-active" : ""}`}
                          style={
                            draftScores[category.key] >= value
                              ? { backgroundColor: category.accent, borderColor: category.accent }
                              : undefined
                          }
                          onClick={() => onDraftScoreChange(category.key, value)}
                          aria-label={`${category.label} ${value} điểm`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <label className="note-field">
              <span>Ghi chú ngắn</span>
              <textarea
                rows={3}
                value={draftNote}
                onChange={(event) => onDraftNoteChange(event.target.value)}
                placeholder="Điều gì làm bạn vui, mệt, hay đáng nhớ hôm nay?"
              />
            </label>
          </div>

          <div className="content-row">
            <TrendChart entries={ratings} previewScores={draftScores} />
            <RadarChart entries={ratings} />
          </div>

          <div className="content-row content-row--bottom">
            <HeatmapCard entries={ratings} />

            <div className="card benchmark-card">
              <div className="section-head section-head--tight">
                <div>
                  <h3>Benchmark nhóm</h3>
                  <p>Theo tag đã chọn</p>
                </div>
                <div className="chip chip--muted">Nhóm 25-34 tuổi</div>
              </div>

              <div className="benchmark-list">
                {categories.map((category) => (
                  <div key={category.key} className="benchmark-row">
                    <div className="benchmark-row__label">
                      <span className="benchmark-row__icon" style={{ color: category.color }}>
                        <category.icon size={15} />
                      </span>
                      <span>{category.label}</span>
                    </div>
                    <div className="benchmark-row__track">
                      <span
                        className="benchmark-row__fill"
                        style={{
                          width: `${Math.max(benchmark[category.key] * 20, 18)}%`,
                          backgroundColor: category.accent,
                        }}
                      />
                    </div>
                    <strong>{benchmark[category.key].toFixed(1)}</strong>
                  </div>
                ))}
              </div>

              <div className="benchmark-tags">
                {profile.tags.map((tag) => (
                  <span key={tag} className="chip chip--muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="card insight-card">
              <div className="section-head section-head--tight">
                <div>
                  <h3>
                    <Sparkles size={16} /> Gợi ý AI
                  </h3>
                  <p>Từ note và pattern gần nhất</p>
                </div>
              </div>

              <p className="insight-card__text">{insight}</p>
              <p className="insight-card__text insight-card__text--muted">
                {draftNote || latest?.note || "Chưa có note hôm nay."}
              </p>

              <button type="button" className="button button--ghost" onClick={() => onNavigate("history")}>
                Xem chi tiết gợi ý
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <aside className="side-column">
          <div className="streak-card card">
            <div className="streak-card__head">
              <span className="chip chip--fire">
                <Flame size={14} />
                Chuỗi ngày liên tiếp
              </span>
            </div>
            <div className="streak-card__count">{streak}</div>
            <p>Bạn đã tracking {streak} ngày liên tiếp</p>
            <div className="streak-card__leaves" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="card mini-card">
            <div className="section-head section-head--tight">
              <div>
                <h3>Chỉ số hôm nay</h3>
                <p>Tốc độ rất nhẹ</p>
              </div>
              <span className="chip chip--muted">1 phút</span>
            </div>
            <div className="mini-metrics">
              {quickMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.key} className="mini-metric">
                    <Icon size={16} />
                    <span>{metric.label}</span>
                    <strong>{deferredDraftScores[metric.key]}</strong>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card note-card">
            <div className="section-head section-head--tight">
              <div>
                <h3>Nhắc nhở</h3>
                <p>Hằng ngày lúc {profile.reminderTime}</p>
              </div>
              <BadgeInfo size={16} />
            </div>
            <p>{profile.reminderActive ? "Nhắc mỗi tối để không bỏ lỡ streak." : "Nhắc đang tắt."}</p>
            <button type="button" className="button button--secondary" onClick={() => onNavigate("settings")}>
              Điều chỉnh nhắc nhở
            </button>
          </div>
        </aside>
      </section>
    </div>
  );
}
