# EduAI — AI Student-Parent Evaluation System

A complete, production-ready Next.js 14 application for AI-powered student evaluation, attendance tracking, and parent-teacher collaboration.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
open http://localhost:3000
```

---

## 📁 Project Structure

```
eduai/
├── app/
│   ├── layout.tsx              # Root layout with ThemeProvider
│   ├── page.tsx                # Landing page
│   ├── login/page.tsx          # Login page
│   ├── signup/page.tsx         # Signup page
│   ├── dashboard/page.tsx      # Main dashboard (teacher + parent views)
│   ├── students/page.tsx       # Student roster with filters
│   ├── profile/page.tsx        # Student profile with charts
│   ├── attendance/page.tsx     # Attendance marking & tracking
│   ├── assignments/page.tsx    # Assignment management
│   ├── ai-insights/page.tsx    # AI-powered insights
│   ├── messages/page.tsx       # Parent-teacher messaging
│   ├── chatbot/page.tsx        # AI assistant chatbot
│   └── settings/page.tsx       # User settings
│
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx         # Navigation sidebar
│   │   ├── navbar.tsx          # Top navigation bar
│   │   ├── dashboard-layout.tsx# Dashboard wrapper
│   │   └── theme-provider.tsx  # next-themes provider
│   │
│   ├── ui/
│   │   └── stat-card.tsx       # Animated stat cards
│   │
│   └── dashboard/
│       ├── student-card.tsx    # Student card component
│       ├── ai-insight-card.tsx # AI insight display
│       └── activity-feed.tsx   # Activity timeline
│
├── data/
│   └── mock.ts                 # Mock student/assignment data
│
├── lib/
│   └── utils.ts                # Utility functions + cn()
│
├── styles/
│   └── globals.css             # Tailwind + custom CSS
│
├── types/
│   └── index.ts                # TypeScript interfaces
│
├── tailwind.config.ts
├── next.config.mjs
└── tsconfig.json
```

---

## 🔑 Key Features

### 🏠 Landing Page (`/`)
- Sticky navbar with backdrop blur
- Animated hero section with live dashboard preview
- Stats bar, feature cards, testimonials, CTA

### 🔐 Auth Pages (`/login`, `/signup`)
- Role selector (Teacher / Parent)
- Glassmorphism card design
- Google & Microsoft SSO buttons

### 📊 Dashboard (`/dashboard`)
- Toggle between Teacher and Parent views
- Teacher: total students, attendance, assignments, at-risk alerts
- Parent: child's attendance, scores, homework, AI insights

### 👥 Students (`/students`)
- Grid/list view toggle
- Filter by status (Excellent, Good, At Risk, Critical)
- Search by name or section

### 👤 Student Profile (`/profile`)
- Tabbed interface: Overview, Performance, Attendance, Assignments, Feedback
- Recharts line + bar charts for score trends
- Monthly attendance visualization
- Teacher feedback editor

### 📅 Attendance (`/attendance`)
- Click to cycle Present → Absent → Late
- Section filter
- Absence alerts for chronic absentees
- Bar chart overview

### 📝 Assignments (`/assignments`)
- Upload form with subject/grade/due-date
- Status filtering
- Submission progress bars
- Pending homework by student

### ✦ AI Insights (`/ai-insights`)
- Class performance summary
- Risk score ranking for all students
- Radar chart for subject profile
- Auto-drafted parent notifications

### 💬 Messages (`/messages`)
- Real-time-style chat interface
- Conversation list with unread badges
- Send/receive messages

### 🤖 AI Chatbot (`/chatbot`)
- **Real Claude API integration** (toggle Live API mode)
- Mock responses for demo
- Quick prompt chips
- Animated typing indicator
- Student context passed to Claude

### ⚙️ Settings (`/settings`)
- Profile editing
- Notification preferences with toggles
- Theme selector (Light/Dark/System)
- School info

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | `#6366F1` |
| Primary Hover | `#4F46E5` |
| Primary Light | `#EEF2FF` |
| Success | `#10B981` |
| Warning | `#F59E0B` |
| Danger | `#EF4444` |
| Border Radius | `14px` |
| Card Shadow | `0 1px 3px rgba(0,0,0,0.06)` |

---

## 🤖 Claude API Integration

The AI Chatbot supports real API calls. To enable:

1. The artifact handles the API proxy — no API key needed in the UI
2. Toggle "Live API" switch in the chatbot header
3. The full student context is passed to Claude as a system prompt
4. Responses are streamed and parsed

Student data context includes all 6 mock students with attendance, scores, homework status, and risk levels.

---

## 🌗 Dark Mode

Implemented with `next-themes`. Toggle via:
- Navbar moon/sun icon
- Settings → Appearance page
- Respects system preference by default

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `next` 14 | App Router framework |
| `framer-motion` | Page transitions + animations |
| `recharts` | Charts (line, bar, radar) |
| `next-themes` | Dark/light mode |
| `lucide-react` | Icon library |
| `tailwindcss` | Styling |
| `clsx` + `tailwind-merge` | Class utilities |
| `date-fns` | Date formatting |

---

## 🔧 Customization

### Add a new student
Edit `data/mock.ts` → `MOCK_STUDENTS` array

### Add AI responses
Edit `data/mock.ts` → `AI_BOT_RESPONSES` object

### Change color theme
Edit `tailwind.config.ts` → `theme.extend.colors.primary`

### Add a new page
1. Create `app/[page]/page.tsx`
2. Add to sidebar nav in `components/layout/sidebar.tsx`
3. Export as default React component using `<DashboardLayout>`
