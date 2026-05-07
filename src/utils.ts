import type { CategoryKey, RatingEntry } from "./types";
import { categoryLabels } from "./data";

const pad = (value: number) => String(value).padStart(2, "0");

export const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const fromDateKey = (key: string) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const formatShortDate = (date: string) =>
  new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(fromDateKey(date));

export const formatLongDate = (date = new Date()) =>
  new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

export const averageScore = (entries: RatingEntry[], key: CategoryKey) => {
  if (entries.length === 0) return 0;
  const total = entries.reduce((sum, entry) => sum + entry.scores[key], 0);
  return total / entries.length;
};

export const getLatestEntry = (entries: RatingEntry[]) => entries[entries.length - 1];

export const calculateStreak = (entries: RatingEntry[]) => {
  const ratedDays = new Set(entries.map((entry) => entry.date));
  const today = new Date();
  const todayKey = toDateKey(today);
  const cursor = new Date(today);
  let streak = 0;

  if (!ratedDays.has(todayKey)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (ratedDays.has(toDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export const buildInsight = (entry: RatingEntry | undefined) => {
  if (!entry) {
    return "Bắt đầu bằng một lần chấm hôm nay để mở khóa trend, benchmark và insight cá nhân.";
  }

  const sorted = Object.entries(entry.scores).sort((a, b) => a[1] - b[1]);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];

  return `Bạn đang ổn nhất ở ${categoryLabels[strongest[0] as CategoryKey].toLowerCase()}, nhưng ${categoryLabels[weakest[0] as CategoryKey].toLowerCase()} cần thêm chút chăm sóc.`;
};

export const mergeRatings = (ratings: RatingEntry[], draft: RatingEntry) => {
  const existingIndex = ratings.findIndex((entry) => entry.date === draft.date);
  if (existingIndex >= 0) {
    const next = ratings.slice();
    next[existingIndex] = draft;
    return next;
  }
  return [...ratings, draft].sort((a, b) => a.date.localeCompare(b.date));
};

export const getWeekDates = (count = 7) => {
  const dates: string[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - (count - 1));
  for (let index = 0; index < count; index += 1) {
    dates.push(toDateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
};
