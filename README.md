# SkillSetu (कौशलसेतू)
### AI Career Guidance & NSQF-Aligned Skill-Gap Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38bdf8.svg)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Tests-19%20Passed-2E8B57.svg)](./src/tests/runAllTests.ts)
[![NSQF](https://img.shields.io/badge/NSQF-Level%203%20to%208-F28C28.svg)](https://www.msde.gov.in/)
[![DigiLocker](https://img.shields.io/badge/DigiLocker-Verified%20Integration-1F4E79.svg)](https://www.digilocker.gov.in/)

---

## 📌 Executive Summary

**SkillSetu (कौशलसेतू)** is an AI-powered, deterministic career guidance and skill-gap identification platform designed specifically for students in India's vocational ecosystem (**ITIs, Polytechnic Diplomas, and Tier-2/3 Technical Colleges**).

Unlike black-box AI chatbots that hallucinate general advice, SkillSetu uses a **mathematically transparent, NSQF-aligned scoring engine**, a real-time **What-If Employability Simulator**, **Stepping-Stone vocational ladders**, and official **DigiLocker / Skill India Digital** credential verification to turn technical training into verified jobs and government apprenticeships (**NAPS**).

---

## 🛑 Problem Statement

India trains millions of vocational students annually across **15,000+ Industrial Training Institutes (ITIs)** and **3,500+ Polytechnic colleges**. However, over **60% of graduates remain underemployed or face placement mismatch**. 

### Root Bottlenecks in the Existing Ecosystem:
1. **The "Black-Box" Career Guidance Trap**: Generic career portals offer vague advice ("*Learn Coding*", "*Be a Leader*") without breaking down specific, practical industrial competencies (e.g. *PLC Ladder Logic*, *Industrial Motor Starters*, *CNC G-Code*, *GD&T*).
2. **NSQF Misalignment**: Job roles in industry map strictly to the **National Skills Qualifications Framework (NSQF Levels 3 to 8)**, yet students do not know which NSQF rung they currently qualify for.
3. **The "Dream Role" Chasm**: A student aiming for a Level 6 role (*Industrial Automation Specialist*) is often discouraged by a 35% readiness score, with no system to recommend intermediate bridge roles (*Junior PLC Maintenance Technician* at Level 4) for immediate wage-earning potential.
4. **Unverified Resumes vs. Employer Mistrust**: Employers distrust self-declared resume bullets, while students lack a tamper-proof way to present certified practical coursework.
5. **Language & Regional Barriers**: Most technical guidance platforms exist exclusively in English, isolating vernacular-medium learners in semi-urban and rural industrial clusters.

---

## 💡 The SkillSetu Solution

SkillSetu bridges this divide by providing a structured, explainable, and multi-stakeholder platform:

* **Transparent Multi-Variable Scoring Engine**: Every career fit percentage is calculated mathematically using verified weights:
  $$\text{Fit Score} = w_{\text{skill}} \cdot \text{Readiness} + w_{\text{interest}} \cdot \text{InterestFit} + w_{\text{demand}} \cdot \text{MarketDemand}$$
* **Penalty Skills Transparency**: Pinpoints the exact skills costing the student the most points in employability.
* **Signature "What-If" Simulator**: Interactive competency sliders show candidates how upgrading a skill (e.g. *Wiring & Earthing* from Level 1 to Level 3) boosts their fit percentage in real time.
* **Stepping-Stone Progression Logic**: Automatically recommends realistic intermediate roles when target readiness is below 50%.
* **DigiLocker & Skill India Digital (SID) Gateway**: Cryptographically imports NCVT trade certificates, MSBTE polytechnic marksheets, and PMKVY certificates to verify skills on-chain/in-profile with official stamps.
* **8-Week Dated Learning Pathways**: Curates zero-cost, government-certified courses from **SWAYAM**, **NPTEL**, and **Skill India** budgeted to the student's available weekly study hours.
* **Trilingual Voice & Text Support**: Full native support for **English**, **हिन्दी (Hindi)**, and **मराठी (Marathi)** with hands-free speech input.
* **Multi-Role Ecosystem**: Dedicated interfaces for **Students**, **College Training & Placement Officers (TPOs)**, **Industry Mentors & Recruiters**, and **Placement Cell Admins**.

---

## 🏗️ System Architecture Diagram

```
+-----------------------------------------------------------------------------------------+
|                                  PRESENTATION LAYER                                     |
|                                                                                         |
|   +-------------------+  +--------------------+  +------------------+  +-------------+  |
|   |   Student Home    |  |  Vocational Ladder |  | Skill Gap Matrix |  | 8-Wk Pathway|  |
|   |  & Readiness Ring |  |  & What-If Sliders |  | & Penalty Skills |  |   Roadmap   |  |
|   +-------------------+  +--------------------+  +------------------+  +-------------+  |
|                                                                                         |
|   +-------------------+  +--------------------+  +------------------+  +-------------+  |
|   | DigiLocker Modal  |  |  TPO Batch Portal  |  |   Mentor Review  |  | Voice Modal |  |
|   | & SID Credentials |  | & Deficit Heatmaps |  | & Endorsements   |  | (Web Speech)|  |
|   +-------------------+  +--------------------+  +------------------+  +-------------+  |
+--------------------------------------------+--------------------------------------------+
                                             |
                                             v
+-----------------------------------------------------------------------------------------+
|                              APPLICATION STATE & CONTEXT                                |
|                                                                                         |
|                        AppContext (React 19 Hooks & Multi-Role RBAC)                     |
|            [Student Profile] [Target Role] [Weights] [Sync Time] [Audit History]        |
+--------------------------------------------+--------------------------------------------+
                                             |
                      +----------------------+----------------------+
                      |                                             |
                      v                                             v
+-------------------------------------------+  +------------------------------------------+
|      ALGORITHMIC & SERVICE ENGINES        |  |        LOCAL PERSISTENCE LAYER           |
|                                           |  |                                          |
|  * recommendationEngine.ts                |  |  * storageService.ts                     |
|    - calculateRoleGaps()                  |  |    - Student Profiles (Isolated per User)|
|    - calculateInterestFit()               |  |    - Assessment History Logs             |
|    - simulateWhatIf()                     |  |    - DigiLocker Verified Certificates    |
|    - getSteppingStoneAdvice()             |  |    - Mentor Feedback & Endorsements      |
|                                           |  |    - Institutional Batch Roster          |
|  * pathwayBuilder.ts                      |  |    - Calibrated Formula Weights          |
|    - Budget-aware 8-week curriculum       |  |    - Full JSON State Backup & Restore    |
|    - Level gating & milestone unlock      |  |                                          |
|                                           |  |                                          |
|  * voiceService.ts & geminiService.ts     |  +------------------------------------------+
|    - Trilingual speech synthesis          |
|    - Offline heuristic fallback engine    |
+---------------------+---------------------+
                      |
                      v
+-----------------------------------------------------------------------------------------+
|                         GOVERNMENT & ECOSYSTEM INTEGRATIONS                             |
|                                                                                         |
|  +------------------------+  +-------------------------+  +--------------------------+  |
|  |       DigiLocker       |  |   Skill India Digital   |  |  National Apprenticeship |  |
|  | NCVT Trade Certificates|  |    PMKVY 4.0 Badges     |  |   Promotion Scheme (NAPS)|  |
|  +------------------------+  +-------------------------+  +--------------------------+  |
|                                                                                         |
|  +------------------------+  +-------------------------+  +--------------------------+  |
|  |     SWAYAM & NPTEL     |  |   State Tech Boards     |  |   NSQF Standards (MSDE)  |  |
|  |  Free Certified Courses|  | MSBTE Diploma Marksheets|  |  NCO / QP Classification |  |
|  +------------------------+  +-------------------------+  +--------------------------+  |
+-----------------------------------------------------------------------------------------+
```

---

## 🔄 User Flow Diagram

```
[ New Student Sign-In ]
         │ (Mobile OTP or Email — Zero Demo Data Leaks)
         ▼
[ Step 1: Onboarding Wizard ] ──► Enter Name, College, Trade (Electrical/Mech/Data), & Interests
         │
         ▼
[ Step 2: Diagnostic Assessment or DigiLocker Import ]
         ├─────────────────────────────────────────┬──────────────────────────────────────────┐
         │                                         │                                          │
         ▼                                         ▼                                          ▼
   [ Take 3-Min Quiz ]                     [ Connect DigiLocker ]                     [ Self-Declaration ]
   Tested on actual workshop               Fetch verified NCVT/MSBTE/PMKVY            Capped at Level 3
   safety & trade questions                marksheets with QR & digital seal          marked unverified
         │                                         │                                          │
         └─────────────────────────────────────────┼──────────────────────────────────────────┘
                                                   │
                                                   ▼
                                [ Step 3: Verified Competency Vector ]
                                (Skills calibrated from Level 0 to Level 5)
                                                   │
                                                   ▼
                                 [ Step 4: Role Gap & Readiness Engine ]
                                 - Mathematical Readiness %
                                 - Have (Green), Partial (Orange), Missing (Red)
                                 - Penalty Skills identified
                                                   │
                                                   ▼
                               [ Step 5: "What-If" Simulation & Stepping Stone ]
                               - If readiness < 50% ──► Stepping-Stone Role suggested
                               - Move skill sliders ──► Real-time fit jump simulated
                                                   │
                                                   ▼
                                [ Step 6: 8-Week Personalized Learning Pathway ]
                                - Budgeted to student's weekly study hours (e.g. 6 hrs/wk)
                                - Free certified modules (NPTEL, SWAYAM, Skill India)
                                                   │
                                                   ▼
                               [ Step 7: Industry Placement & NAPS Apprenticeship ]
                               - Direct matching with verified stipends (₹15,000–₹18,000/mo)
                               - Plant recruiters view verified skill scores only
```

---

## 🧮 Mathematical Model (Clear & Deterministic)

SkillSetu does not use arbitrary AI scores. All guidance is grounded in transparent formulas:

### 1. Skill Gap & Readiness Formula
For each skill required by a role with required level $R_i$ and importance weight $I_i$ ($0.1 \le I_i \le 1.0$), given the student's current level $C_i$:
$$\text{Readiness (\%)} = \frac{\sum_{i=1}^{N} \min(C_i, R_i) \cdot I_i}{\sum_{i=1}^{N} R_i \cdot I_i} \times 100$$

$$\text{Weighted Gap}(i) = \max(0, R_i - C_i) \cdot I_i$$

### 2. Multi-Variable Career Fit Score
Combines competency, stated interest tokens, and real market demand:
$$\text{Fit Score} = w_{\text{skill}} \cdot \text{Readiness} + w_{\text{interest}} \cdot \text{InterestFit} + w_{\text{demand}} \cdot \text{MarketDemand}$$
*Default calibrated weights:*
* $w_{\text{skill}} = 0.60$ (60% weight on actual verified competency)
* $w_{\text{interest}} = 0.25$ (25% weight on semantic vocational interests)
* $w_{\text{demand}} = 0.15$ (15% weight on active hiring trend score)

### 3. Stepping-Stone Role Algorithm
When readiness for an aspirational target role is below the threshold (default **50%**):
* The engine searches for intermediate roles in the **same stream** with an **$\text{NSQF Level} < \text{Target NSQF}$**.
* Recommends the nearest bridge role so the student can achieve early employment and climb the vocational ladder smoothly.

---

## 👥 Multi-Stakeholder Ecosystem

| Role | Purpose | Key Features |
|---|---|---|
| **Student** | Self-directed career acceleration | Skill radar, DigiLocker import, What-If simulation, 8-week learning pathway, voice guidance. |
| **College TPO** | Institutional placement officer portal | Cohort readiness roster, trade batch registration, critical deficit heatmap, CSV report exports. |
| **Industry Mentor** | Plant supervisor & recruiter | Verified talent directory, interview invitations, skill endorsements, star ratings & feedback notes. |
| **Admin** | Placement cell calibration | Real-time slider calibration for $w_{\text{skill}}$, $w_{\text{interest}}$, and $w_{\text{demand}}$ weights. |

---

## 💻 Tech Stack

* **Frontend Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
* **Language**: [TypeScript 5.x](https://www.typescriptlang.org/) (Strict typing across models and services)
* **Styling & Design System**: [Tailwind CSS v4](https://tailwindcss.com/) (Accessible high-contrast palette with Indian ecosystem colors)
* **Icons**: [Lucide React](https://lucide.dev/)
* **Animations & Gamification**: [Motion](https://motion.dev/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
* **Persistence Layer**: Custom `StorageService` with automatic JSON hydration, key isolation per user, and state backup
* **Speech & Voice**: Web Speech API (`webkitSpeechRecognition` & `speechSynthesis`) for Hindi, Marathi, and English
* **Testing Runner**: Node.js 22 Test Suite with `tsx` runner

---

## 🧪 Automated Test Suite (19 / 19 Passed)

SkillSetu includes an end-to-end unit and integration test suite verifying all algorithms:

```bash
npm test
```

### Verified Test Suites:
1. **Suite 1: Data Taxonomy & NSQF Alignment**
   * Role NSQF range validity (Levels 3 to 8)
   * Taxonomy reference consistency for all required skills
   * Sequential ascending ladder rungs
   * Question bank schema & difficulty bounds
   * Demo persona data integrity
2. **Suite 2: Deterministic Recommendation Engine**
   * `calculateRoleGaps()` mathematical bounds (0% to 100%)
   * Semantic interest token normalization
   * Weighted fit formula ranking and penalty skills derivation
   * `simulateWhatIf()` delta accuracy
   * `getSteppingStoneAdvice()` threshold triggers
3. **Suite 3: Learning Pathway Builder**
   * 8-week structured roadmap generation & hour budgeting
   * Status progression (Active vs Locked)
4. **Suite 4: Storage Service & Persistence Layer**
   * Student profile isolation across sessions
   * Chronological assessment record logging
   * DigiLocker certificate saving & retrieval
   * Mentor feedback and institutional batch persistence
   * Complete JSON state export & import
5. **Suite 5: DigiLocker Verification & Skill Ingestion**
   * Verified competency level elevation and readiness increase
6. **Suite 6: User Isolation & Fresh Learner State**
   * Zero demo data leakage for newly registered accounts
   * Strict separation of custom user storage from demo personas

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v20+ or v22+
* **npm**: v10+

### Installation & Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ishayadav1291-wq/dump2-.git
   cd dump2-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run automated test suite:**
   ```bash
   npm test
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📁 Repository Structure

```
├── .env.example                     # Environment configuration template
├── .gitignore                       # Clean gitignore excluding node_modules/dist/locks
├── index.html                       # HTML5 entry point with NSQF meta tags
├── metadata.json                    # AI Studio platform capabilities & metadata
├── package.json                     # NPM dependencies and scripts
├── tsconfig.json                    # Strict TypeScript compiler options
├── vite.config.ts                   # Vite bundler with Tailwind CSS v4 plugin
├── public/                          # Static assets and blueprint blueprints
└── src/
    ├── App.tsx                      # Root application router and modal mounts
    ├── main.tsx                     # React 19 application entry point
    ├── index.css                    # Tailwind CSS v4 design tokens and theme
    ├── types/                       # TypeScript interfaces and domain schemas
    ├── context/                     # AppContext: Reactive state & persistence sync
    ├── data/                        # NSQF career roles, question bank, ladders, courses
    ├── locales/                     # Trilingual translations (EN, HI, MR)
    ├── services/
    │   ├── recommendationEngine.ts  # Deterministic weighted gap & What-If formula
    │   ├── pathwayBuilder.ts        # 8-week dated course roadmap generator
    │   ├── storageService.ts        # User-isolated local storage persistence
    │   ├── voiceService.ts          # Multilingual speech input/output
    │   └── geminiService.ts         # Career mentor advice engine
    ├── components/
    │   ├── auth/                    # LoginPage with unique phone/email & demo buttons
    │   ├── layout/                  # TopNavbar, BottomNav, VoiceAssistantModal
    │   ├── student/                 # StudentHome, CareerLadder, DigiLockerModal, etc.
    │   ├── institution/             # InstitutionDashboard (TPO cohort analytics)
    │   ├── mentor/                  # MentorPortal (Recruiter review & skill endorsements)
    │   ├── admin/                   # AdminCalibrationView (Scoring weight calibration)
    │   └── ui/                      # CircularProgress, RadarChart
    └── tests/
        └── runAllTests.ts           # 19 automated tests across 6 suites
```

---

## 📜 Standards & Compliance
* **NSQF (National Skills Qualifications Framework)**: Ministry of Skill Development and Entrepreneurship (MSDE).
* **NCO (National Classification of Occupations)**: Aligned codes for industrial trades.
* **NAPS**: National Apprenticeship Promotion Scheme direct wage stipend links.
* **DPDP 2023 Compliant**: Client-side storage and user-authorized credential verification.

---

## 👨‍💻 Author & Maintainer
Built with pride for vocational and technical learners across India.
* **Repository**: [ishayadav1291-wq/dump2-](https://github.com/ishayadav1291-wq/dump2-)
* **Developer Email**: ishayadav9850@gmail.com
