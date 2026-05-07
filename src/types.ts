import type { LucideIcon } from "lucide-react";

export type CategoryKey = "mood" | "health" | "work" | "social" | "entertainment";
export type ViewKey = "dashboard" | "history" | "settings";

export type Category = {
  key: CategoryKey;
  label: string;
  icon: LucideIcon;
  color: string;
  accent: string;
};

export type RatingEntry = {
  date: string;
  scores: Record<CategoryKey, number>;
  note: string;
};

export type Profile = {
  name: string;
  email: string;
  tags: string[];
  reminderTime: string;
  reminderActive: boolean;
  premium: boolean;
};

export type AppState = {
  loggedIn: boolean;
  activeView: ViewKey;
  profile: Profile;
  draftScores: Record<CategoryKey, number>;
  draftNote: string;
  ratings: RatingEntry[];
};
