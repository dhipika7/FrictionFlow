# FrictionFlow

> **AI That Notices Before You Ask**

**FrictionFlow** is an AI-powered learning companion designed for **programming students**. It helps students overcome coding struggles by detecting learning friction, providing hints instead of simply giving answers, identifying weak topics, recommending personalized problems, tracking progress, and helping teachers understand where students need support.

---

## 📌 Table of Contents

* [Overview](#-overview)
* [Problem](#-problem)
* [Our Solution](#-our-solution)
* [Why FrictionFlow](#-why-frictionflow)
* [Target Users](#-target-users)
* [Core Features](#-core-features)
* [How FrictionFlow Works](#-how-frictionflow-works)
* [System Architecture](#-system-architecture)
* [Modules](#-modules)
* [AI & Machine Learning](#-ai--machine-learning)
* [Coding Platform Integration](#-coding-platform-integration)
* [Browser Extension](#-browser-extension)
* [Web Application](#-web-application)
* [Teacher Dashboard](#-teacher-dashboard)
* [Database](#-database)
* [Technology Stack](#-technology-stack)
* [Data Flow](#-data-flow)
* [Struggle Detection](#-struggle-detection)
* [Recommendation Engine](#-recommendation-engine)
* [AI Mentor](#-ai-mentor)
* [Gamification](#-gamification)
* [Privacy & Security](#-privacy--security)
* [API Integration](#-api-integration)
* [Development Roadmap](#-development-roadmap)
* [Feasibility](#-feasibility)
* [Challenges & Risks](#-challenges--risks)
* [Future Enhancements](#-future-enhancements)
* [Expected Impact](#-expected-impact)
* [SDG Alignment](#-sdg-alignment)
* [Project Structure](#-project-structure)
* [Installation](#-installation)
* [Usage](#-usage)
* [Team](#-team)

---

# 🎯 Overview

Learning programming is not simply about finding the correct answer.

Students often encounter a different problem:

> **They don't know when they're stuck, why they're stuck, or what they should do next.**

A student may spend 40 minutes on an easy problem, submit multiple incorrect solutions, search Google, open YouTube, ask ChatGPT, check discussion forums, and eventually copy a solution.

The problem isn't a lack of resources.

The problem is **learning friction**.

FrictionFlow aims to identify that friction and provide the right support at the right time.

Instead of being another AI chatbot that waits for a question, FrictionFlow is designed to act as a **proactive AI mentor**.

---

# ❗ Problem

Programming students commonly face:

* Spending excessive time on a single problem
* Repeated compiler or logical errors
* Difficulty understanding technical explanations
* Switching between multiple learning resources
* Depending on direct AI-generated solutions
* Uncertainty about what to practice next
* Difficulty identifying weak topics
* Lack of personalized learning paths
* Hesitation to ask seniors or faculty for simple doubts
* Lack of measurable learning progress
* Loss of motivation and consistency

### The Core Problem

> **Programming students need timely guidance and personalized learning support because prolonged struggles, repeated mistakes, and uncertainty about what to practice next can reduce confidence and slow their learning.**

---

# 💡 Our Solution

FrictionFlow combines:

**Coding activity + learning analytics + AI mentorship + personalized recommendations + progress tracking + teacher insights**

into one learning ecosystem.

Instead of:

```text
Student gets stuck
       ↓
Student asks AI
       ↓
AI gives answer
       ↓
Student copies
       ↓
Problem solved
       ↓
Learning not guaranteed
```

FrictionFlow aims for:

```text
Student starts solving
       ↓
Learning activity is observed
       ↓
Struggle indicators detected
       ↓
AI Mentor intervenes
       ↓
Hint / explanation provided
       ↓
Student attempts independently
       ↓
Weak topics identified
       ↓
Personalized problems recommended
       ↓
Progress tracked
       ↓
Learning improves
```

---

# 🌟 Why FrictionFlow?

Existing tools are extremely useful, but most of them are **reactive**.

For example:

```text
Student → "Give me a solution."
AI → Solution
```

FrictionFlow changes the interaction:

```text
Student struggles
       ↓
FrictionFlow notices
       ↓
FrictionFlow asks:
"Would you like a hint?"
```

### Our central idea

> **Don't wait for the student to ask for help. Identify the friction and offer support at the right moment.**

---

# 👨‍💻 Target Users

### Primary Users

* Programming students
* Competitive programming students
* DSA learners
* College students
* Beginners learning programming
* Students preparing for coding interviews

### Secondary Users

* Faculty members
* Programming instructors
* Coding clubs
* Universities
* Bootcamps
* Educational institutions

---

# 🚀 Core Features

## 1. 🧠 Friction Detection Engine

The core feature of FrictionFlow.

The system analyzes learning signals such as:

* Time spent on a problem
* Number of failed submissions
* Repeated errors
* Problem difficulty
* Previous performance
* Topic history
* Number of attempts
* Learning consistency

The system combines these signals to estimate whether a student may be struggling.

---

# 2. 🤖 AI Mentor

Instead of immediately providing a complete solution, the AI Mentor provides:

* Hints
* Concept explanations
* Step-by-step guidance
* Error explanations
* Debugging suggestions
* Similar examples
* Learning resources

### Example

Student:

> "My solution keeps giving TLE."

Instead of:

> "Here is the complete optimized code."

FrictionFlow might respond:

> "Your current approach appears to revisit the same elements repeatedly. Can you think of a way to store previously seen values?"

The goal is **learning rather than copying**.

---

# 3. 💡 Smart Hint System

Hints can be progressive.

### Level 1 — Conceptual Hint

> "Think about how you can store previously visited values."

### Level 2 — Directional Hint

> "A hash-based structure can help you check whether the required value has already appeared."

### Level 3 — Stronger Guidance

> "Try using a HashMap to store each number and its index."

### Level 4 — Solution

Only when the student explicitly requests it.

This creates a gradual learning experience.

---

# 4. 🔍 Error Translator

Compiler and runtime errors can be intimidating for beginners.

FrictionFlow translates technical errors into simpler language.

### Example

Instead of:

```text
Segmentation fault (core dumped)
```

The system explains:

> "Your program is trying to access memory that it shouldn't. Check whether an array index or pointer is going outside its valid range."

It can also suggest what the student should inspect.

---

# 5. 📚 Personalized Recommendation Engine

One of the biggest student problems is:

> **"I know I'm weak in this topic, but what should I solve next?"**

FrictionFlow analyzes:

* Solved problems
* Failed problems
* Topic performance
* Difficulty
* Accuracy
* Time taken
* Learning history

Then recommends suitable problems.

Example:

```text
Student Profile

Arrays       ██████████ 90%
Strings      ████████   75%
Trees        ██████     60%
Graphs       ████       40%
DP           ███        30%
```

The system may recommend:

```text
1. Basic DP concepts
2. Easy DP problems
3. Recursion → DP transition problems
4. Medium DP problems
5. DP revision challenge
```

---

# 6. 🧭 Personalized Learning Roadmap

Instead of randomly selecting problems, students receive a structured path.

Example:

```text
Arrays
  ↓
Hashing
  ↓
Two Pointers
  ↓
Sliding Window
  ↓
Prefix Sum
  ↓
Advanced Arrays
```

For another student:

```text
Recursion
  ↓
Backtracking
  ↓
Trees
  ↓
Graphs
```

The roadmap changes according to the student's learning profile.

---

# 7. 📊 Learning Analytics

Students can see:

* Problems solved
* Accuracy
* Weak topics
* Strong topics
* Average solving time
* Failed attempts
* Improvement over time
* Practice consistency
* Coding streak
* Recommended problems
* Achievement history

---

# 8. 🔥 Gamification

To encourage consistency:

* Coding streaks
* Badges
* Achievements
* Daily goals
* Weekly challenges
* Topic completion
* Progress milestones

Example:

```text
🔥 7-Day Coding Streak

🏆 Array Master
🏆 50 Problems Solved
🎯 Weekly Goal: 80%
```

Gamification is intended to encourage healthy consistency rather than simply maximizing the number of problems solved.

---

# 9. 👨‍🏫 Teacher Dashboard

FrictionFlow also supports educators.

Teachers can see:

* Student progress
* Topic-wise performance
* Common mistakes
* Students who may need support
* Class-level statistics
* Problem difficulty trends
* Learning consistency

### Example

```text
Class Analytics

Students: 60

Strongest Topic:
Arrays

Weakest Topic:
Dynamic Programming

Most Failed Concept:
Recursion → DP

Students Needing Support:
8
```

This allows teachers to intervene earlier.

---

# 10. 🔔 Smart Notifications

Possible notifications include:

> "You've been working on this problem for a while. Want a small hint?"

or:

> "You haven't practiced Graphs this week."

or:

> "You're close to completing your weekly goal!"

Notifications are designed to be supportive rather than disruptive.

---

# 🧩 FrictionFlow Modules

The system can be divided into the following major modules:

### Module 1 — Authentication

Handles:

* Signup
* Login
* Google authentication
* User sessions
* Role management

Roles:

```text
Student
Teacher
Admin
```

---

### Module 2 — Student Profile

Stores:

* Learning history
* Skill levels
* Topics
* Preferences
* Progress
* Goals

---

### Module 3 — Activity Tracking

Collects meaningful learning events:

* Problem opened
* Problem attempted
* Submission made
* Submission accepted
* Submission rejected
* Hint requested
* Recommendation completed

---

### Module 4 — Friction Detection

Analyzes learning behavior and identifies possible struggles.

---

### Module 5 — AI Mentor

Provides:

* Hints
* Explanations
* Debugging support
* Concept clarification

---

### Module 6 — Error Translator

Converts technical errors into understandable explanations.

---

### Module 7 — Recommendation Engine

Recommends:

* Problems
* Topics
* Learning resources
* Revision areas

---

### Module 8 — Learning Analytics

Tracks:

* Progress
* Accuracy
* Time
* Consistency
* Topic mastery

---

### Module 9 — Gamification

Manages:

* Streaks
* Badges
* Achievements
* Goals

---

### Module 10 — Teacher Analytics

Provides classroom-level insights.

---

### Module 11 — Platform Integration

Connects supported coding platforms and services.

---

### Module 12 — Notification System

Handles:

* Intervention notifications
* Reminders
* Goals
* Achievements

---

# 🏗 System Architecture

```text
                         FRICTIONFLOW
                   AI That Notices Before You Ask

                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
             Browser Extension      Web Application
                    │                   │
                    └─────────┬─────────┘
                              │
                              ▼
                       FastAPI Backend
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        Activity         AI Engine         Database
        Processing                           PostgreSQL
             │                │
             │         ┌──────┴──────┐
             │         ▼             ▼
             │       ML Model       LLM
             │         │             │
             └─────────┴──────┬──────┘
                              │
                              ▼
                    Recommendation Engine
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
             Student Dashboard    Teacher Dashboard
```

---

# 🌐 Web Application

The web application is the main interface.

### Student Side

```text
Dashboard
│
├── My Progress
├── Weak Topics
├── Recommendations
├── AI Mentor
├── Learning Roadmap
├── Achievements
├── Streak
└── Profile
```

### Teacher Side

```text
Teacher Dashboard
│
├── Class Overview
├── Student Performance
├── Weak Topics
├── Common Errors
├── At-Risk Students
└── Analytics
```

---

# 🧩 Browser Extension

The browser extension acts as the connection between coding platforms and FrictionFlow.

It can work with supported platforms such as:

* LeetCode
* Codeforces
* CodeChef
* Other supported coding environments

### Example

```text
Student opens coding problem
          ↓
Extension identifies supported page
          ↓
Tracks meaningful activity
          ↓
Sends activity data
          ↓
FastAPI backend
          ↓
Friction Detection
          ↓
AI Mentor
```

The extension should **not** record unnecessary personal activity.

---

# 🔌 Coding Platform Integration

Not every coding platform provides the same integration capabilities.

### Codeforces

Can be integrated using its available API.

Potential data:

* User information
* Rating
* Contest history
* Problem submissions
* Problem information

### GitHub

Potentially use GitHub APIs for:

* Repository activity
* Languages
* Contributions
* Coding activity

### LeetCode

LeetCode's integration options need to be handled carefully because it does not provide the same kind of open public API as Codeforces.

Possible approaches depending on platform policies and supported capabilities:

* User-linked profile information
* Supported public information
* Browser extension
* Future official integration

### Important Principle

> **Use official APIs wherever they are available and permitted. Do not design the system around unauthorized access or bypassing platform restrictions.**

---

# 🤖 AI & Machine Learning

FrictionFlow does **not** need to train an LLM from scratch.

The AI layer can consist of two parts.

## Part 1 — Foundation LLM

An existing model can handle:

* Natural-language explanations
* Hints
* Error explanations
* Concept clarification
* Conversational mentoring

Examples can include APIs from providers such as OpenAI or Google.

---

## Part 2 — Student Learning Model

Our own machine-learning layer focuses on student behavior.

Possible input:

```text
Time spent
Wrong submissions
Problem difficulty
Topic
Historical accuracy
Attempts
Previous performance
```

Possible output:

```text
Likely struggling
Weak topic
Recommended difficulty
Next problem
```

---

# 🧠 Struggle Detection

A first prototype can use a transparent rule-based model.

Example:

```text
Easy Problem
+
Long solving time
+
Multiple failed submissions
=
Possible learning friction
```

A more advanced version can combine multiple signals.

### Example

```text
Problem Difficulty = Medium
Time = 42 minutes
Attempts = 5
Historical topic accuracy = 35%

                    ↓

          Friction Score = High

                    ↓

        Trigger AI intervention
```

The score should **not** be treated as a definitive statement about a student's ability.

It is an indicator used to decide whether offering help may be useful.

---

# 🎯 Recommendation Engine

The recommendation engine combines:

### Student Profile

```text
Current skill
Weak topics
Strong topics
Goals
History
```

### Problem Metadata

```text
Topic
Difficulty
Tags
Prerequisites
```

### Performance

```text
Accuracy
Attempts
Time
Recent progress
```

Then:

```text
Student Profile
      +
Problem Metadata
      +
Performance
      ↓
Recommendation Engine
      ↓
Personalized Problems
```

---

# 🗄 Database Design

PostgreSQL can store structured learning data.

### Students

```text
student_id
firebase_uid
name
email
role
created_at
```

### Activities

```text
activity_id
student_id
platform
problem_id
problem_name
difficulty
topic
time_spent
attempts
result
timestamp
```

### Weak Topics

```text
student_id
topic
mastery_score
confidence
updated_at
```

### Recommendations

```text
recommendation_id
student_id
problem_id
reason
status
created_at
```

### Achievements

```text
achievement_id
student_id
achievement_type
earned_at
```

### Teacher Analytics

```text
teacher_id
class_id
student_id
performance
weak_topics
updated_at
```

---

# 🔐 Authentication & Firebase

Firebase can be used for authentication.

Example:

```text
Student
   ↓
Firebase Authentication
   ↓
Authenticated User
   ↓
FastAPI Backend
   ↓
PostgreSQL
```

Firebase can also support notification-related functionality depending on the final architecture.

---

# 🐳 Docker

Docker packages project services into reproducible environments.

Example:

```text
Docker Compose
│
├── Frontend
├── FastAPI Backend
├── PostgreSQL
└── Supporting Services
```

This simplifies:

* Development
* Testing
* Deployment
* Environment consistency

---

# 📮 Postman

Postman is used during development to test backend APIs.

Example:

```text
POST /activity

{
  "student_id": 12,
  "platform": "Codeforces",
  "problem_id": "123A",
  "time_spent": 35,
  "attempts": 3
}
```

The backend can then return:

```json
{
  "status": "success"
}
```

Postman allows the team to verify APIs before connecting the frontend.

---

# 🔄 Complete Data Flow

```text
Student
   │
   ▼
Coding Platform
   │
   ▼
Browser Extension
   │
   ▼
FastAPI Backend
   │
   ├───────────────┐
   ▼               ▼
PostgreSQL      AI Engine
                   │
             ┌─────┴─────┐
             ▼           ▼
       Struggle      Recommendation
       Detection       Engine
             │           │
             └─────┬─────┘
                   ▼
               AI Mentor
                   │
                   ▼
          Student Dashboard
                   │
                   ▼
           Learning Progress
```

---

# 🔒 Privacy & Security

Privacy is an important part of FrictionFlow because the system deals with learning activity.

### Principles

* User consent before activity tracking
* Collect only necessary learning data
* Avoid collecting unnecessary personal information
* Secure API communication
* Secure authentication
* Protected database access
* Role-based authorization
* Do not expose individual student information unnecessarily

### Important

FrictionFlow should **not** secretly monitor users.

The extension should clearly communicate what information is being collected and why.

---

# ⚠️ Challenges & Edge Cases

## Student opens a problem but walks away

The system should not interpret inactivity alone as struggle.

Use multiple signals.

---

## Student solves a difficult problem very quickly

Fast solving does not automatically mean the student is cheating or exceptionally skilled.

Historical performance and context should be considered.

---

## AI provides an incorrect hint

The AI output should be treated as assistance rather than unquestionable truth.

The system can encourage verification and use trusted resources where appropriate.

---

## Internet connection fails

The extension can temporarily cache important activity and synchronize later.

---

## Platform changes its website

Platform-specific integrations should be modular so that changes don't require rebuilding the entire system.

---

## Student ignores intervention

That's acceptable.

FrictionFlow should support the student rather than force them to interact.

---

# 💰 Estimated Prototype Cost

Because FrictionFlow is primarily software-based, most development tools can be open source or have free tiers.

Possible costs:

| Component                | Estimated Cost |
| ------------------------ | -------------: |
| Domain                   |         ₹1,000 |
| Prototype cloud hosting  |         ₹3,000 |
| AI API credits           |         ₹2,500 |
| Database/storage         |         ₹1,500 |
| Design/development tools |         ₹1,000 |
| Testing/deployment/misc. |         ₹2,000 |
| **Estimated Total**      |    **₹11,000** |

Actual costs will depend on provider pricing, usage, and whether free tiers are sufficient.

---

# 🛠 Technology Stack

| Layer             | Technology                         |
| ----------------- | ---------------------------------- |
| Frontend          | React.js                           |
| Backend           | FastAPI                            |
| Database          | PostgreSQL                         |
| Authentication    | Firebase                           |
| AI Mentor         | LLM API                            |
| ML                | Scikit-learn / XGBoost             |
| Browser Extension | JavaScript + Chrome Extension APIs |
| API Testing       | Postman                            |
| Containerization  | Docker                             |
| Version Control   | Git + GitHub                       |
| UI/UX             | Figma                              |

---

# 📅 Development Roadmap

## Phase 1 — Research & Design

* Validate user pain points
* Finalize requirements
* Design UI/UX
* Design database
* Finalize architecture

---

## Phase 2 — Core Backend

* Authentication
* Student profiles
* Activity APIs
* Database
* Basic analytics

---

## Phase 3 — AI Mentor

* LLM integration
* Hint generation
* Error explanations
* Prompt design
* Response validation

---

## Phase 4 — Struggle Detection

Start with rules:

```text
Time + Attempts + Errors + Difficulty
```

Then improve using machine learning as sufficient data becomes available.

---

## Phase 5 — Recommendation Engine

* Topic analysis
* Problem classification
* Difficulty progression
* Personalized recommendations

---

## Phase 6 — Browser Extension

* Platform detection
* Activity tracking
* Backend communication
* Intervention popup

---

## Phase 7 — Dashboards

### Student

* Progress
* Recommendations
* Roadmap
* Achievements

### Teacher

* Class analytics
* Weak topics
* Student support indicators

---

## Phase 8 — Testing

Test with real programming students.

Measure:

* Time to solve
* Problems completed
* Recommendation usefulness
* Learning consistency
* User satisfaction
* Accuracy of struggle detection

---

# 🧪 Validation Strategy

To determine whether FrictionFlow actually helps students, conduct a pilot study.

### Before FrictionFlow

Measure:

* Average solving time
* Problems solved per week
* Common weak topics
* Resource switching
* Confidence

### After FrictionFlow

Measure the same metrics.

Then compare.

```text
Before
   ↓
Student struggles
   ↓
Use FrictionFlow
   ↓
After
   ↓
Compare learning outcomes
```

This is more meaningful than simply claiming that the system "improves learning."

---

# 🌍 Expected Impact

### Students

* Reduced frustration
* Better problem-solving habits
* Personalized learning
* Improved coding confidence
* Better consistency
* Less dependence on direct solutions

### Teachers

* Earlier identification of struggling students
* Better understanding of class-level weaknesses
* Data-driven intervention

### Institutions

* Better student engagement
* Improved programming education
* Structured learning support

---

# 🌱 SDG Alignment

## SDG 4 — Quality Education

FrictionFlow provides personalized and accessible learning support.

## SDG 8 — Decent Work and Economic Growth

Improving programming skills can contribute to students' career readiness.

## SDG 9 — Industry, Innovation and Infrastructure

The project applies AI and modern software infrastructure to improve technical education.

---

# 🔮 Future Enhancements

Possible future versions could include:

* VS Code extension
* Mobile application
* More coding platforms
* Advanced recommendation models
* Knowledge tracing
* Adaptive difficulty
* Voice-based AI Mentor
* Institution-level analytics
* Personalized interview preparation
* Resume/project skill tracking
* Learning-resource recommendation
* Peer mentoring
* Collaborative coding sessions
* Advanced predictive analytics

---

# 📁 Proposed Project Structure

```text
FrictionFlow/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── dashboards/
│   │   └── services/
│   └── package.json
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── models/
│   │   ├── services/
│   │   ├── ai/
│   │   ├── recommendations/
│   │   ├── analytics/
│   │   └── main.py
│   └── requirements.txt
│
├── extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup/
│   └── services/
│
├── ml/
│   ├── training/
│   ├── models/
│   ├── preprocessing/
│   └── evaluation/
│
├── database/
│   ├── schema/
│   └── migrations/
│
├── tests/
│
├── docker-compose.yml
├── .env.example
├── README.md
└── LICENSE
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/FrictionFlow.git

cd FrictionFlow
```

## Backend

```bash
cd backend

python -m venv venv
```

Activate environment.

### Windows

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run server:

```bash
uvicorn app.main:app --reload
```

---

# Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# Extension

1. Open Chrome.
2. Navigate to the extensions page.
3. Enable Developer Mode.
4. Select **Load unpacked**.
5. Select the `extension/` directory.

---

# Environment Variables

Create a `.env` file.

Example:

```env
DATABASE_URL=your_database_url

FIREBASE_PROJECT_ID=your_project_id

AI_API_KEY=your_api_key

SECRET_KEY=your_secret_key
```

**Never commit real API keys or credentials to GitHub.**

Use `.env.example` for documentation.

---

# 🔐 Security Notes

Before production deployment:

* Rotate exposed credentials
* Add proper authorization
* Validate API inputs
* Add rate limiting
* Protect sensitive endpoints
* Use HTTPS
* Secure database credentials
* Implement proper CORS configuration
* Add audit logging where appropriate

---

# 🧪 Testing

Testing should cover:

### Backend

* Authentication
* Activity ingestion
* Recommendations
* AI endpoints
* Database operations

### Extension

* Supported platforms
* Activity detection
* API communication
* Offline behavior

### AI

* Hint quality
* Error explanation accuracy
* Recommendation relevance
* Safety against direct-answer leakage when hints are requested

---

# 🎯 MVP Scope

The first working version should **not attempt to build everything**.

### MVP

✅ Student login

✅ Student dashboard

✅ Learning profile

✅ Basic activity tracking

✅ Basic struggle detection

✅ AI Mentor

✅ Hints

✅ Error explanations

✅ Problem recommendations

✅ Progress tracking

✅ Basic gamification

✅ One or two platform integrations

### Later

🔄 Advanced ML

🔄 More platforms

🔄 Advanced teacher analytics

🔄 VS Code integration

🔄 Mobile application

---

# 💭 The Core Philosophy

FrictionFlow isn't designed to make students dependent on AI.

It's designed to make students **less dependent on AI over time**.

The objective is:

```text
Stuck
 ↓
Hint
 ↓
Think
 ↓
Attempt
 ↓
Understand
 ↓
Practice
 ↓
Improve
 ↓
Become Independent
```

rather than:

```text
Stuck
 ↓
Ask AI
 ↓
Copy
 ↓
Submit
 ↓
Repeat
```

---

# 🏆 What Makes FrictionFlow Unique?

### Traditional AI

> **"Ask me and I'll answer."**

### FrictionFlow

> **"I noticed you're struggling. Let me guide you."**

The differentiating idea is not simply using AI to solve programming problems.

It is the combination of:

**Proactive struggle detection + AI mentorship + personalized recommendations + learning analytics + teacher insights.**

---

# 📌 One-Line Pitch

> **FrictionFlow is an AI-powered learning companion for programming students that detects coding struggles early, provides personalized guidance, and transforms frustration into confident learning.**

---

# 🎤 Tagline

> **AI That Notices Before You Ask.**

---

## 👥 Team

**Team RavenClue**

### Debadruti Purakayastha

AI & Development

### Dhipika K

Research & Design

### Elakkiya M

Documentation, Validation & Testing

---

# 📜 Project Status

> **FrictionFlow is currently under active development.**

Some modules described in this README represent the **planned architecture and future implementation**, while the MVP is being developed incrementally.

---

# ❤️ Final Thought

> **Programming is not difficult because students lack answers. Sometimes it's difficult because they don't know what to do when the answer doesn't come.**
>
> **FrictionFlow is designed to bridge that gap.**


