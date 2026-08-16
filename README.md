# TNPSC Path - Complete Preparation Portal for All 8 TNPSC Groups

![TNPSC Path Platform](public/images/hero_banner.jpg)

**TNPSC Path** is a clean, modern, beginner-friendly civil services preparation web application dedicated to all **8 TNPSC Exam Groups** (Group 1, Group 2 & 2A, Group 3, Group 4 & VAO Code 496, Group 5A Secretariat, Group 6 Forest Service, Group 7B & 8 HR&CE, and Group 7A HR&CE Grade I).

---

## 🌟 Key Features

- **All 8 TNPSC Exam Group Guides**:
  - Dedicated standalone pages with eligibility criteria, job posts, exam patterns, and roadmaps.
  - **Group 4 Code: 496**: Official syllabus aligned with 12.12.2024 Gazette Notification (Part A General Studies 75 Qs, Part B Aptitude 25 Qs, Part C General Tamil 100 Qs / General English).
- **Official Syllabus Explorer**: Unit-by-unit breakdown (Units I to X) mapped with **Samacheer Kalvi 6th to 12th Standard School Textbooks**.
- **Previous Question Papers & Concept PPTs**: Downloads for 2019-2024 official question papers + **Downloadable Real Concept PPT Revision Slides**.
- **Community Shared Notes Hub**: Free handwritten PDF notes, unit summaries, and instant client-side upload modal for aspirants.
- **Beginner Study Roadmaps & Timetables**: 30-Day Sprint, 90-Day Standard, and 180-Day Group 1 & 2 comprehensive timetables.
- **Dual-Layer Database System**: MongoDB connection with zero-downtime local JSON fallback (`data/initialData.json`).
- **Responsive Aesthetics**: Vibrant HSL theme, dark/light mode toggle, dynamic hero banners for every page, sitemap visual tree, and mobile bottom navigation bar.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Optional - local JSON fallback included)

### 2. Installation
```bash
# Clone repository
git clone https://github.com/palani-24/tnpsc.git
cd tnpsc

# Install dependencies
npm install
```

### 3. Environment Setup
Copy `.env.example` to `.env` and set your configuration:
```bash
cp .env.example .env
```
Default `.env` contents:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/tnpsc_db
```

### 4. Running the Server
```bash
# Production mode
npm start

# Development mode with auto-reload
npm run dev
```

Open `http://localhost:3000` in your web browser.

---

## 📁 Repository Structure

```
tnpsc/
├── data/
│   └── initialData.json        # Database fallback and initial seeds for all 8 groups
├── public/
│   ├── css/
│   │   └── styles.css          # Vanilla HSL design tokens & responsive CSS
│   ├── images/                 # Generated page banners
│   ├── js/
│   │   └── app.js              # Client-side dynamic logic
│   ├── group1.html ... group7a.html # Dedicated standalone pages for all 8 Groups
│   ├── syllabus.html           # Official Syllabus Explorer
│   ├── previous-papers.html    # PYQ Archive & PPT Downloads
│   ├── resources.html          # Community Notes Hub
│   ├── study-plan.html         # Beginner Timetables
│   ├── guidance.html           # Preparation Strategy
│   └── faq.html                # Frequently Asked Questions
├── server/
│   ├── models/                 # Mongoose schemas
│   ├── routes/
│   │   └── api.js              # REST API endpoints
│   └── index.js                # Express server entry point
├── uploads/                    # Community uploaded study files
├── .env                        # Environment variables (ignored by Git)
├── .env.example                # Sample environment template
└── package.json
```

---

## ⚖️ Official Verification Disclaimer
This is an educational guidance portal. Aspirants must verify official exam notifications, dates, and gazette announcements at [tnpsc.gov.in](https://www.tnpsc.gov.in).

---

## 📜 License
MIT License
