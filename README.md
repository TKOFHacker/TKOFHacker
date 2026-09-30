# AI Livelihood Assistant (SIH26097)

> **"Your Voice. Your Skills. Your Livelihood."**  
> An AI-powered multilingual livelihood assistant connecting people with suitable skills, jobs, training, and government opportunities across both smartphones and basic feature phones.

---

## 🌟 Core Value Proposition

1. **Voice-First Accessibility**: Over 500 million Indian citizens own basic feature phones without keyboards, internet access, or English literacy. Our system allows any user to dial toll-free **1800-555-0199** and complete an AI career screening entirely via spoken dialogue in **Tamil, Hindi, or English**.
2. **End-to-End Pipeline**:
   $$\text{Voice} \longrightarrow \text{AI Conversation} \longrightarrow \text{Profile Extraction (JSON)} \longrightarrow \text{Skill Mapping} \longrightarrow \text{Skill Gap Analysis} \longrightarrow \text{Personalized Recommendations} \longrightarrow \text{Livelihood Roadmap}$$
3. **Multi-Opportunity Matching**: Not just jobs — simultaneously connects beneficiaries to:
   - **Formal Jobs & Apprenticeships** (e.g. Wireman, Solar PV Technician)
   - **Free Government Training & Stipends** (e.g. NSDC PMKVY 4.0 Level 4)
   - **Credit Capital Subsidies** (e.g. PMEGP 35% margin subsidy, PM Mudra, PM Vishwakarma)
   - **Self-Employment Micro-Enterprise Models** (e.g. Independent Rural Electrical & Pump Repair Hub)
4. **Three-Stakeholder Architecture**:
   - **Beneficiary**: Voice assessment, skill card, gap visualizer, 6-step roadmap, 1-click applications.
   - **Admin / Government Officer**: District telemetry, talent heatmaps, IVR call volumes, skill deficit matrices.
   - **Employer / Skill Provider**: Post technician vacancies, review competency-matched candidates.

---

## 🧑‍🌾 Seeded Demo Persona: Arun

- **Name**: Arun
- **Education**: 12th Standard
- **Location**: Thanjavur District, Tamil Nadu
- **Current Occupation**: Farmer (3 years experience)
- **Skills Known**: Basic Electrical & Wiring, Agricultural Pump Maintenance, Farming
- **Aspiration**: Start an independent electrical & motor repair service business
- **Language**: Tamil (`ta`)

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS (accessible public-service palette with emerald, dark slate, glassmorphism)
- **Icons**: Lucide React
- **Voice / Speech**: Web Speech API (`SpeechRecognition` & `SpeechSynthesis`) + Audio Waveform Visualizers
- **Internationalization**: Centralized translation dictionary supporting English (`en`), Tamil (`ta`), and Hindi (`hi`)

### Backend
- **Framework**: Python 3.14 + FastAPI + Pydantic v2
- **ORM / Database**: SQLAlchemy 2.0 with default SQLite (`sqlite:///./livelihood.db`) for immediate zero-config startup, fully PostgreSQL-ready via `DATABASE_URL`
- **Security**: JWT Authentication, native `bcrypt` password hashing, Role-Based Access Control (RBAC)
- **AI Architecture**:
  - LLM abstraction layer with live profile extraction into structured JSON
  - Semantic Skill Mapping with confidence metrics
  - NSQF Benchmark Gap Diagnostic
  - Multi-factor recommendation engine
- **Voice / Telephony Architecture**:
  - Twilio & Exotel compatible webhook endpoints (`/incoming`, `/answer`, `/input`, `/callback`, `/end`)
  - Built-in `MockVoiceProvider` for local testing without requiring external paid telephony accounts

---

## 🚀 Quick Start (Local Development)

### 1. Backend Setup

```bash
cd backend
python -m pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
- API Base: `http://localhost:8000`
- Interactive Swagger Docs: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🧪 Automated Testing

Run the comprehensive unit and integration test suite:

```bash
# From workspace root
$env:PYTHONPATH="backend"; python -m pytest backend/tests
```

**Results**: 13/13 passing tests verifying authentication, skill mapping, gap analysis, roadmap generation, and IVR telephony webhooks.

---

## 📞 Interactive IVR Phone Simulator

Click **"Call AI (IVR)"** in the top navigation bar or **"Test Phone Simulator"** on the landing page to open the virtual feature-phone simulator. Evaluators can:
1. Dial toll-free `1800-555-0199`.
2. Press keypad digits `1` for Tamil, `2` for English, `3` for Hindi.
3. Speak or type answers.
4. Listen to synthetic voice speech responses.
5. Watch real-time carrier telemetry and live JSON profile extraction!

---

## 👥 Default Demo Credentials

| Role | Name | Phone / Login | Password |
|---|---|---|---|
| **Beneficiary** | Arun | `9876543210` | `password123` |
| **Admin Officer** | Rajesh Kumar (Collectorate) | `9876543211` | `password123` |
| **Employer** | Kavitha Energy Solutions | `9876543212` | `password123` |

*(You can also use the top-right role switcher dropdown to instantly switch roles with one click!)*
