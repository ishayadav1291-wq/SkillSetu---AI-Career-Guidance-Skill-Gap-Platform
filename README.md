# SkillSetu (कौशलसेतू)
> **AI Career Guidance & Skill-Gap Platform for Vocational Students in India**

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-19%20Passed-2E8B57.svg)](./src/tests/runAllTests.ts)
[![NSQF](https://img.shields.io/badge/NSQF-Levels%203--8-F28C28.svg)](https://www.msde.gov.in/)

---

## 🎯 What is SkillSetu?

**SkillSetu** helps **ITI, Polytechnic, and Diploma students** in India find the right job, discover their missing skills, and get certified step-by-step.

Instead of guessing or asking generic AI, SkillSetu uses **clear math formulas**, real **NSQF job levels**, and direct **DigiLocker verification**.

---

## ❌ The Problem

* **High Unemployment**: Over 60% of technical diploma and ITI graduates struggle to find relevant jobs.
* **Vague Career Advice**: Generic websites say *"learn communication"* or *"study coding"* instead of specific workshop skills like *PLC Wiring*, *Safety PPE*, or *CNC G-Code*.
* **No Stepping-Stones**: A student aiming for a high-level job (e.g. ₹50k/mo) gets discouraged with a low score, without knowing they can take an intermediate job (e.g. ₹20k/mo) first.
* **Unverified Resumes**: Companies don't trust plain resume text; students have no easy way to prove practical skills.
* **Language Barrier**: Most tools are English-only. Vocational students need Hindi and Marathi.

---

## ✅ The Solution

* **Accurate Match Score**: Calculates exact job readiness (%) using a clear, weighted formula.
* **Penalty Skills**: Shows exactly which 2–3 missing skills are pulling your score down.
* **"What-If" Simulator**: Move sliders on skills to see your job readiness jump in real-time.
* **Stepping-Stone Ladder**: Recommends bridge jobs when you are under 50% ready for your dream job.
* **DigiLocker & Skill India Digital**: Import official ITI trade certificates & marksheets with 1 click.
* **Free 8-Week Roadmap**: Week-by-week plan using free government courses (SWAYAM, NPTEL, Skill India).
* **3 Languages**: Fully available in **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)** with voice input.
* **4 Portals**: Separate dashboards for **Student**, **College TPO**, **Industry Recruiter**, and **Admin**.

---

## 🏛️ System Architecture

```
+-------------------------------------------------------------------------------+
|                               1. USER INTERFACE                               |
|   * Student Home & Readiness Gauge       * Vocational Ladder & What-If Sliders|
|   * DigiLocker Import Gateway            * College TPO Cohort Analytics       |
|   * 8-Week Learning Roadmap              * Recruiter & Mentor Endorsements    |
+---------------------------------------+---------------------------------------+
                                        |
                                        v
+-------------------------------------------------------------------------------+
|                            2. STATE & PERSISTENCE                             |
|   * AppContext: Multi-role authentication & active profile state              |
|   * StorageService: Local storage sync (isolated per user, zero demo leaks)   |
+---------------------------------------+---------------------------------------+
                                        |
                   +--------------------+--------------------+
                   |                                         |
                   v                                         v
+--------------------------------------+  +-------------------------------------+
|        3. CORE ALGORITHM ENGINE      |  |      4. GOVERNMENT & DATA APIS      |
|  * Weighted Skill Gap Formula        |  |  * DigiLocker: NCVT Trade Certs     |
|  * Semantic Interest Matching        |  |  * Skill India Digital (SID): PMKVY |
|  * Stepping-Stone Role Finder        |  |  * NAPS: Official Apprenticeships   |
|  * 8-Week Pathway Generator          |  |  * SWAYAM / NPTEL: Certified Courses|
+--------------------------------------+  +-------------------------------------+
```

---

## 🔁 User Flow

```
1. Sign In (Phone OTP / Email)
   │ (Fresh account with 0 demo data)
   ▼
2. Quick Onboarding
   │ Enter Name, College, Trade (Electrical / Mech / CS), & Hours/Week
   ▼
3. Measure Skills
   ├── Take a 3-minute diagnostic quiz
   ├── Connect DigiLocker to auto-verify trade certificates
   └── Self-rate existing practical experience
   ▼
4. View Skill-Gap Report
   │ See Have (Green), Partial (Orange), and Missing (Red) skills
   ▼
5. Try What-If Simulator
   │ Move sliders to test: "If I learn PLC, how much does my job fit jump?"
   ▼
6. Follow 8-Week Roadmap
   │ Complete free certified modules budgeted to your weekly schedule
   ▼
7. Apply for Jobs & NAPS Apprenticeships
   │ Matched directly to paid industry openings (₹15,000 - ₹18,000/mo)
```

---

## 🧮 How the Score is Calculated

$$\text{Fit Score} = (0.60 \times \text{Skills}) + (0.25 \times \text{Interests}) + (0.15 \times \text{Market Demand})$$

* **60% Skills**: What you can actually do (Level 0 to 5).
* **25% Interests**: Your preferred technical areas.
* **15% Market Demand**: Real hiring trends in Indian industry.

---

## 🛠️ Tech Stack

| Component | Technology |
|---|---|
| **Frontend** | React 19 + TypeScript 5 |
| **Styling** | Tailwind CSS v4 |
| **Build Tool** | Vite 8 |
| **Icons & Motion** | Lucide React + Motion |
| **Voice** | Web Speech API (English, Hindi, Marathi) |
| **Data Storage** | Browser Persistence with JSON export/import |
| **Testing** | Node.js 22 Test Runner (`tsx`) |

---

## 🧪 Automated Tests (19 / 19 Passed)

Run the built-in test suite:
```bash
npm test
```

* **Suite 1**: NSQF levels and skill taxonomy consistency.
* **Suite 2**: Mathematical gap formulas, What-If simulation, and stepping-stone rules.
* **Suite 3**: 8-week curriculum builder and hour budgeting.
* **Suite 4**: Storage persistence across page reloads.
* **Suite 5**: DigiLocker certificate parsing and skill verification.
* **Suite 6**: Zero demo data leakage for new user logins.

---

## ⚡ Quick Start

```bash
# 1. Clone repository
git clone https://github.com/ishayadav1291-wq/dump2-.git
cd dump2-

# 2. Install dependencies
npm install

# 3. Run all tests
npm test

# 4. Start development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 👥 User Roles

1. **Student**: Test skills, view career ladders, and follow roadmaps.
2. **College TPO**: Track batch readiness, view skill deficit heatmaps, and export CSV reports.
3. **Industry Mentor / Recruiter**: Review verified candidates and endorse practical skills.
4. **Admin**: Tune formula weights ($w_{\text{skill}}$, $w_{\text{interest}}$, $w_{\text{demand}}$).

---

## 📄 License & Standards
* **Standards**: Aligned with **NSQF**, **NCO Codes**, and **MSDE** guidelines.
* **Privacy**: Client-side data storage adhering to **DPDP Act 2023** principles.
