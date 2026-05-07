import { Bell, Crown, Tags, CheckCheck } from "lucide-react";
import { benchmarkTags } from "../data";
import type { Profile } from "../types";

type Props = {
  profile: Profile;
  onReminderChange: (value: boolean) => void;
  onReminderTimeChange: (value: string) => void;
  onTagToggle: (tag: string) => void;
  onUpgrade: () => void;
};

export function SettingsScreen({
  profile,
  onReminderChange,
  onReminderTimeChange,
  onTagToggle,
  onUpgrade,
}: Props) {
  return (
    <div className="settings-screen">
      <section className="settings-grid">
        <div className="card settings-card">
          <div className="section-head section-head--tight">
            <div>
              <h3>
                <Bell size={16} /> Nhắc nhở hằng ngày
              </h3>
              <p>Gắn trực tiếp vào Users để dễ chỉnh</p>
            </div>
          </div>

          <label className="toggle-row">
            <span>Kích hoạt nhắc</span>
            <button
              type="button"
              className={`toggle ${profile.reminderActive ? "is-on" : ""}`}
              onClick={() => onReminderChange(!profile.reminderActive)}
              aria-pressed={profile.reminderActive}
            >
              <span />
            </button>
          </label>

          <label className="field field--compact">
            <span>Giờ nhắc</span>
            <div className="field__control">
              <input
                type="time"
                value={profile.reminderTime}
                onChange={(event) => onReminderTimeChange(event.target.value)}
              />
            </div>
          </label>
        </div>

        <div className="card settings-card">
          <div className="section-head section-head--tight">
            <div>
              <h3>
                <Tags size={16} /> Tag benchmark
              </h3>
              <p>Chọn nhóm để so sánh ý nghĩa hơn</p>
            </div>
          </div>

          <div className="tag-list">
            {benchmarkTags.map((tag) => {
              const selected = profile.tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  className={`tag-pill ${selected ? "is-active" : ""}`}
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                  {selected && <CheckCheck size={14} />}
                </button>
              );
            })}
          </div>

          <button type="button" className="button button--secondary" onClick={onUpgrade}>
            <Crown size={16} />
            Mở khóa Premium
          </button>
        </div>

        <div className="card settings-card settings-card--wide">
          <div className="section-head section-head--tight">
            <div>
              <h3>Khía cạnh tùy chỉnh</h3>
              <p>Premium sẽ cho phép thêm rating categories riêng</p>
            </div>
          </div>

          <div className="premium-locked">
            <strong>Đang khóa</strong>
            <p>AI insight, custom categories và export PDF sẽ mở khi nâng cấp.</p>
            <button type="button" className="button button--ghost" onClick={onUpgrade}>
              Xem gói Premium
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
