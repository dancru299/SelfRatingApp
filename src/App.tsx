import { startTransition, useEffect, useState } from "react";
import { AppShell } from "./components/AppShell";
import { AuthScreen } from "./screens/AuthScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { HistoryScreen } from "./screens/HistoryScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { initialState } from "./data";
import type { AppState, CategoryKey, ViewKey } from "./types";
import { mergeRatings, toDateKey } from "./utils";

const STORAGE_KEY = "selfratingapp:v1";

const readState = (): AppState => {
  if (typeof window === "undefined") return initialState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return initialState();
  try {
    const parsed = JSON.parse(raw) as AppState;
    return {
      ...initialState(),
      ...parsed,
      profile: { ...initialState().profile, ...parsed.profile },
    };
  } catch {
    return initialState();
  }
};

export default function App() {
  const [state, setState] = useState<AppState>(readState);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = (updater: (current: AppState) => AppState) => {
    startTransition(() => {
      setState((current) => updater(current));
    });
  };

  const handleLogin = () => {
    updateState((current) => ({ ...current, loggedIn: true }));
  };

  const handleLogout = () => {
    updateState((current) => ({ ...current, loggedIn: false, activeView: "dashboard" }));
  };

  const handleViewChange = (view: ViewKey) => {
    updateState((current) => ({ ...current, activeView: view }));
  };

  const handleQuickCheckIn = () => {
    updateState((current) => ({ ...current, activeView: "dashboard" }));
    const checkin = document.getElementById("checkin");
    checkin?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSave = () => {
    updateState((current) => {
      const today = toDateKey(new Date());
      const nextEntry = {
        date: today,
        scores: current.draftScores,
        note: current.draftNote.trim(),
      };
      return {
        ...current,
        ratings: mergeRatings(current.ratings, nextEntry),
      };
    });
  };

  const handleTagToggle = (tag: string) => {
    updateState((current) => {
      const tags = current.profile.tags.includes(tag)
        ? current.profile.tags.filter((item) => item !== tag)
        : [...current.profile.tags, tag];
      return { ...current, profile: { ...current.profile, tags } };
    });
  };

  const screen = state.activeView;

  return state.loggedIn ? (
    <AppShell
      activeView={screen}
      onViewChange={handleViewChange}
      onQuickCheckIn={handleQuickCheckIn}
      onLogout={handleLogout}
      profile={state.profile}
    >
      {screen === "dashboard" ? (
        <DashboardScreen
          profile={state.profile}
          ratings={state.ratings}
          draftScores={state.draftScores}
          draftNote={state.draftNote}
          onDraftScoreChange={(key: CategoryKey, value: number) =>
            updateState((current) => ({
              ...current,
              draftScores: { ...current.draftScores, [key]: value },
            }))
          }
          onDraftNoteChange={(value) =>
            updateState((current) => ({
              ...current,
              draftNote: value,
            }))
          }
          onSave={handleSave}
          onNavigate={handleViewChange}
        />
      ) : null}

      {screen === "history" ? <HistoryScreen ratings={state.ratings} /> : null}

      {screen === "settings" ? (
        <SettingsScreen
          profile={state.profile}
          onReminderChange={(value) =>
            updateState((current) => ({
              ...current,
              profile: { ...current.profile, reminderActive: value },
            }))
          }
          onReminderTimeChange={(value) =>
            updateState((current) => ({
              ...current,
              profile: { ...current.profile, reminderTime: value },
            }))
          }
          onTagToggle={handleTagToggle}
          onUpgrade={() => window.alert("Premium MVP sẽ mở ở Phase 3.")}
        />
      ) : null}
    </AppShell>
  ) : (
    <AuthScreen onLogin={handleLogin} />
  );
}
