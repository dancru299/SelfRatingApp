# Product Requirements Document (PRD) – SelfRatingApp

---

## 1. Mục tiêu sản phẩm
**Mục tiêu:**  
- Giúp người dùng **tự đánh giá chất lượng cuộc sống hàng ngày** trong <1 phút/ngày.  
- Cung cấp **biểu đồ, trend, insight cá nhân** và **benchmark có ý nghĩa với nhóm đồng cảnh** (tagged benchmark).  
- Duy trì thói quen **hàng ngày** với cơ chế **Streak / Gamification**.  
- Tiềm năng monetization: AI-driven insights, customization, subscription.

**Success metrics (KPI):**  
- Daily Active Users (DAU) ≥ 15–20% người đăng ký.  
- Retention 7 ngày: 20–25%, Retention 30 ngày: 15%.  
- Tỷ lệ chấm điểm hằng ngày ≥ 60% sau tuần đầu.  
- Conversion sang premium: 5% trong 2 tháng.

**Assumption:**  
- Target user: Việt Nam, tuổi 18–35, quan tâm self-improvement.  
- MVP là **Webapp Responsive**; mobile native mở rộng sau.

---

## 2. User Persona

| Persona | Mô tả | Pain Point | Goal |
|---------|-------|-----------|------|
| **Người trẻ văn phòng** | 25–30 tuổi, bận công việc, dùng web/mobile | Không biết chất lượng cuộc sống hiện tại | Xem trend + streak + insights |
| **Sinh viên / freelancer** | 18–25 tuổi, muốn cải thiện năng suất, tâm trạng | Quên self-reflection, benchmark chưa hợp lý | Xem trend, insights cá nhân, benchmark nhóm tương tự |
| **Wellness enthusiast** | 20–35 tuổi, quan tâm self-improvement | Muốn dữ liệu trực quan, actionable | AI insight + custom rating categories |

---

## 3. User Flow

1. **Onboarding / Signup**  
   - Email / Google / Facebook login  
   - Chọn các khía cạnh muốn đánh giá (default: mood, health, work, social, entertainment)  
   - Chọn **1–2 tag benchmark** (Ví dụ: Sinh viên, IT, Freelancer) → dùng cho so sánh cộng đồng  

2. **Daily Rating**  
   - Slider / stars input + optional note <1 phút  
   - Hiển thị **Streak**: “Bạn đã tracking X ngày liên tiếp”  

3. **Dashboard / Trend**  
   - Line chart, radar chart, calendar heatmap  
   - Empty state (3 ngày đầu): motivational quotes, placeholder chart, tips hướng dẫn tracking  
   - Benchmark nhóm: show score trung bình của tag đã chọn  

4. **History & Analytics**  
   - Filter theo tuần/tháng  
   - Export PDF (optional) → Premium  
   - AI-driven insights: tổng hợp note, phân tích lý do vui/buồn  

5. **Settings & Premium**  
   - Thêm khía cạnh đánh giá tùy chỉnh (Premium)  
   - Reminder daily notification  

---

## 4. Core Features (MVP + Immediate Improvements)

- **User Authentication:** Email / Google  
- **Daily Self-Rating:** 5 khía cạnh, note optional  
- **Dashboard / Trend Visualization:** Line chart + Radar chart + Calendar heatmap  
- **Gamification / Streak:** Hiển thị chuỗi ngày liên tiếp  
- **Community Benchmarking:** Ẩn danh, theo tag đã chọn  
- **Empty State UI:** motivational quote / placeholder chart  
- **Reminders:** 1 giờ nhắc hằng ngày, gộp trực tiếp vào bảng Users  
- **Premium Features:**  
  - AI insight từ note  
  - Custom rating categories  

---

## 5. Database Schema (Updated)

### Users
| Field | Type | Description |
|-------|------|------------|
| user_id | UUID | PK |
| email | string | unique |
| name | string | optional |
| password_hash | string | optional |
| reminder_time | time | nhắc hằng ngày |
| reminder_active | boolean | nhắc enabled/disabled |
| tags | array(string) | benchmark group |
| created_at | timestamp | |

### Ratings
| Field | Type | Description |
|-------|------|------------|
| rating_id | UUID | PK |
| user_id | UUID | FK → Users |
| date | date | UNIQUE(user_id, date) để tránh duplicate |
| mood_score | int (1-5) | |
| health_score | int (1-5) | |
| work_score | int (1-5) | |
| social_score | int (1-5) | |
| entertainment_score | int (1-5) | |
| note | text | optional |
| created_at | timestamp UTC | lưu UTC + timezone của device |

**Assumption:**  
- Storing device timezone để query ngày chính xác, tránh issue 11 PM local → next day UTC.

---

## 6. API Design (MVP)

### Authentication
- `POST /api/signup` → {email, password}  
- `POST /api/login` → {email, password} → JWT token  

### Daily Rating
- `POST /api/ratings` → {date, mood_score, health_score, work_score, social_score, entertainment_score, note, timezone}  
- `GET /api/ratings?start_date=&end_date=` → list rating user  

### Dashboard / Trend
- `GET /api/dashboard` → {user_trend, streak, benchmark_group_score}  

### Settings / Reminder
- `PATCH /api/users/:id/reminder` → {reminder_time, reminder_active}  

---

## 7. UI Layout / Empty State Improvements

1. **Login / Signup Page**  
2. **Home / Daily Rating:**  
   - Slider / star rating  
   - Note box optional  
   - **Streak badge** visible  
3. **Dashboard:**  
   - Line chart trend  
   - Radar chart khía cạnh  
   - Calendar heatmap  
   - Empty state: placeholder chart + motivational quotes / tips  
4. **Community Benchmark:** show trung bình tag đã chọn  
5. **History Page:** filter tuần/tháng, AI insight highlights  
6. **Settings / Premium:** reminder, custom rating categories  

---

## 8. Tech Stack

- **Frontend:** React / Next.js  
- **Backend:** Node.js + Express / Firebase Functions  
- **Database:** Firestore / PostgreSQL  
- **Auth:** Firebase Auth / JWT  
- **Charts:** Recharts / Chart.js  
- **Notifications:** Firebase Cloud Messaging  
- **Hosting:** Vercel / Netlify (frontend), Firebase / Heroku (backend)  

---

## 9. MVP Scope

- User Authentication (Email + Google)  
- Daily Rating + Note (5 khía cạnh)  
- Dashboard trend + calendar heatmap + radar chart  
- Streak / Gamification  
- Community Benchmark theo tag  
- Empty state motivational UI  
- Reminder notification 1h daily (gộp Users table)  

**Excluded:**  
- Export CSV/PDF chưa cần thiết  
- Multi-device sync nâng cao  
- Advanced gamification badges  

---

## 10. Roadmap

**Phase 1 (2–3 tuần): MVP Build**  
- Daily rating + Streak + Dashboard trend  
- Benchmark theo tag  
- Reminder notification gộp Users table  
- Empty state UI  

**Phase 2 (1 tháng): Beta Test & Feedback**  
- Invite small group (50–100 users)  
- Collect retention, streak behavior, feedback  

**Phase 3 (1–2 tháng): Premium & AI Insights**  
- AI-driven insights từ note  
- Custom rating categories  
- Optional export PDF  

**Phase 4 (3–6 tháng): Scale & Community**  
- Full community benchmark / leaderboard  
- Mobile native apps  
- Marketing campaigns  

---

## 11. Rủi ro & Mitigation

| Risk | Mitigation |
|------|-----------|
| Low retention | Streak + motivational quotes + simple UX |
| Data integrity / duplicate rating | UNIQUE(user_id, date), timezone-aware backend |
| Benchmark không có ý nghĩa | Tag benchmark khi onboarding |
| User privacy | Aggregate anonymized, GDPR/local compliance |
| Technical: timezone & date misalignment | Store UTC + device timezone |
| Premium adoption | AI insights & customization thay vì export CSV |

---

**Assumptions tổng quan:**  
- User tập trung 18–35 tuổi Việt Nam, quan tâm self-improvement.  
- MVP Webapp responsive → mobile native sau.  
- Rating 5 khía cạnh + optional note.  
- Benchmark tag-based: Sinh viên, Freelancer, IT…  
- Gamification: streak ngay từ MVP.  
- Premium: AI-driven insight, custom categories, optional export PDF.