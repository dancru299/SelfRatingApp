import {
  ChevronRight,
  LogOut,
  Menu,
  Plus,
  Bell,
  Flame,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import type { Profile, ViewKey } from "../types";
import { navItems } from "../data";
import { formatLongDate } from "../utils";

type Props = {
  activeView: ViewKey;
  onViewChange: (view: ViewKey) => void;
  onQuickCheckIn: () => void;
  onLogout: () => void;
  profile: Profile;
  children: ReactNode;
};

export function AppShell({
  activeView,
  onViewChange,
  onQuickCheckIn,
  onLogout,
  profile,
  children,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavClick = (key: ViewKey) => {
    onViewChange(key);
    setSidebarOpen(false);
  };

  return (
    <div className="app-shell">
      <div
        className={`sidebar-overlay${sidebarOpen ? " is-visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <aside className={`sidebar${sidebarOpen ? " is-open" : ""}`}>
        <div className="brand-mark">
          <span className="brand-mark__glyph" aria-hidden="true">
            <Flame size={18} />
          </span>
          <div>
            <p className="brand-mark__name">SelfRatingApp</p>
            <p className="brand-mark__caption">Nhịp sống theo ngày</p>
          </div>
        </div>

        <nav className="side-nav" aria-label="Điều hướng chính">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.key;
            return (
              <button
                key={item.key}
                type="button"
                className={`side-nav__item ${isActive ? "is-active" : ""}`}
                onClick={() => handleNavClick(item.key as ViewKey)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <button type="button" className="sidebar__cta" onClick={() => { onQuickCheckIn(); setSidebarOpen(false); }}>
          <Plus size={16} />
          <span>Chấm nhanh</span>
          <ChevronRight size={16} />
        </button>

        <div className="sidebar-profile">
          <div className="avatar">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0f6a67&color=fff`}
              alt={profile.name}
            />
          </div>
          <div className="sidebar-profile__meta">
            <p>{profile.name}</p>
            <span>{profile.email}</span>
          </div>
          <button type="button" className="sidebar-profile__logout" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <button type="button" className="topbar__menu" aria-label="Mở menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="topbar__intro">
            <p className="topbar__greeting">Chào buổi sáng, {profile.name}! ☀️</p>
            <p className="topbar__date">{formatLongDate()}</p>
          </div>
          <div className="topbar__actions">
            <button type="button" className="icon-button">
              <Bell size={18} />
            </button>
            <button type="button" className="chip-button" onClick={onQuickCheckIn}>
              <Plus size={14} />
              <span>Chấm hôm nay</span>
            </button>
          </div>
        </header>

        {children}
      </main>

      <nav className="mobile-nav" aria-label="Thanh điều hướng di động">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              className={`mobile-nav__item ${activeView === item.key ? "is-active" : ""}`}
              onClick={() => onViewChange(item.key as ViewKey)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button type="button" className="mobile-nav__cta" onClick={onQuickCheckIn} aria-label="Chấm nhanh">
          <Plus size={18} />
        </button>
        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              className={`mobile-nav__item ${activeView === item.key ? "is-active" : ""}`}
              onClick={() => onViewChange(item.key as ViewKey)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
