import {
  BriefcaseBusiness,
  HeartPulse,
  Music2,
  Smile,
  Users,
  Sparkles,
  CalendarDays,
  History,
  Settings2,
  LayoutDashboard,
} from "lucide-react";
import type { AppState, Category, CategoryKey, RatingEntry } from "./types";

export const categories: Category[] = [
  { key: "mood", label: "Tâm trạng", icon: Smile, color: "#0f6a67", accent: "#2f9d8f" },
  { key: "health", label: "Sức khỏe", icon: HeartPulse, color: "#d97706", accent: "#f59e0b" },
  { key: "work", label: "Công việc", icon: BriefcaseBusiness, color: "#b45309", accent: "#fb923c" },
  { key: "social", label: "Xã hội", icon: Users, color: "#0f766e", accent: "#14b8a6" },
  { key: "entertainment", label: "Giải trí", icon: Music2, color: "#be185d", accent: "#fb7185" },
];

export const navItems = [
  { key: "dashboard", label: "Trang chủ", icon: LayoutDashboard },
  { key: "history", label: "Lịch sử", icon: History },
  { key: "settings", label: "Cài đặt", icon: Settings2 },
];

export const benchmarkTags = ["Sinh viên", "IT", "Freelancer", "Văn phòng"];

export const benchmarkSnapshots: Record<string, Record<CategoryKey, number>> = {
  "Sinh viên": { mood: 3.8, health: 3.2, work: 2.9, social: 3.7, entertainment: 4.2 },
  IT: { mood: 3.4, health: 3.6, work: 3.1, social: 3.0, entertainment: 3.8 },
  Freelancer: { mood: 3.5, health: 3.4, work: 3.2, social: 3.1, entertainment: 4.0 },
  "Văn phòng": { mood: 3.3, health: 3.5, work: 3.4, social: 3.6, entertainment: 3.2 },
};

const daysAgo = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};

export const createInitialRatings = (): RatingEntry[] => [
  {
    date: daysAgo(7),
    scores: { mood: 3, health: 3, work: 2, social: 4, entertainment: 4 },
    note: "Làm việc hơi căng, nhưng buổi tối đi bộ giúp đầu óc nhẹ hơn.",
  },
  {
    date: daysAgo(6),
    scores: { mood: 4, health: 3, work: 3, social: 4, entertainment: 4 },
    note: "Một ngày khá đều, nhận được lời khen nhỏ từ đồng nghiệp.",
  },
  {
    date: daysAgo(5),
    scores: { mood: 4, health: 4, work: 3, social: 4, entertainment: 3 },
    note: "Ngủ đủ hơn nên tinh thần tốt hơn rõ rệt.",
  },
  {
    date: daysAgo(4),
    scores: { mood: 5, health: 4, work: 4, social: 4, entertainment: 4 },
    note: "Hôm nay tập trung rất tốt, không bị ngắt quãng nhiều.",
  },
  {
    date: daysAgo(3),
    scores: { mood: 4, health: 4, work: 4, social: 3, entertainment: 3 },
    note: "Có chút mệt vào chiều tối nhưng vẫn giữ được nhịp.",
  },
  {
    date: daysAgo(2),
    scores: { mood: 4, health: 4, work: 3, social: 4, entertainment: 4 },
    note: "Lịch họp dày nhưng mọi thứ diễn ra khá ổn.",
  },
  {
    date: daysAgo(1),
    scores: { mood: 5, health: 4, work: 4, social: 4, entertainment: 4 },
    note: "Tâm trạng tích cực, hoàn thành được việc quan trọng nhất trong ngày.",
  },
];

export const initialState = (): AppState => ({
  loggedIn: false,
  activeView: "dashboard",
  profile: {
    name: "Minh Anh",
    email: "minh.anh@example.com",
    tags: ["Sinh viên", "IT"],
    reminderTime: "20:30",
    reminderActive: true,
    premium: false,
  },
  draftScores: { mood: 4, health: 4, work: 3, social: 4, entertainment: 5 },
  draftNote: "Hôm nay mình muốn giữ nhịp ổn định và ngủ sớm hơn.",
  ratings: createInitialRatings(),
});

export const categoryLabels: Record<CategoryKey, string> = {
  mood: "Tâm trạng",
  health: "Sức khỏe",
  work: "Công việc",
  social: "Xã hội",
  entertainment: "Giải trí",
};

export const categorySummary = [
  { key: "mood" as const, label: "Tâm trạng", icon: Sparkles },
  { key: "health" as const, label: "Sức khỏe", icon: HeartPulse },
  { key: "work" as const, label: "Công việc", icon: BriefcaseBusiness },
  { key: "social" as const, label: "Xã hội", icon: Users },
  { key: "entertainment" as const, label: "Giải trí", icon: Music2 },
  { key: "calendar" as const, label: "Nhắc nhở", icon: CalendarDays },
];
