# Serenisun

**Expand your inner radiance.**

Serenisun is a yoga and meditation booking platform. Users browse live group and one-on-one sessions, book a time slot, and manage their bookings from a personal dashboard. An AI session guide helps newcomers choose the right session and writes a short note for their instructor.

## Live Demo

- **App:** [YOUR NETLIFY LINK]
- **API:** [YOUR RENDER LINK]/api/health

> The API runs on a free hosting tier and sleeps when idle, so the first request after a quiet period can take up to a minute.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React (Vite), React Router, Context API |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JSON Web Tokens, bcryptjs |
| AI | Google Gemini API (`@google/genai`) |
| Other | express-rate-limit |
| Hosting | Netlify (frontend), Render (backend), MongoDB Atlas (database) |

## Key Features

- Register, log in, and log out, with protected pages and routes
- Browse services with filters for category, type (group or 1:1), and duration
- Service detail pages with open sessions, instructors, and spots remaining
- Book a session by choosing a date and time
- **Capacity rules:** a full class or an already taken 1:1 slot cannot be booked, even if two people try at the same moment
- A user cannot book the same session twice
- Reschedule or cancel bookings, which frees the spot
- Dashboard with upcoming sessions, online meeting links, and past or cancelled bookings
- Responsive design with loading, empty, and error states

## AI-Powered Feature: The Session Guide

Many beginners do not know which yoga or meditation session suits them. On the **AI Guide** page, a user describes their experience and goals in their own words. The guide:

1. Recommends **one real service** from the catalog and explains why
2. Writes a short **note for the instructor** about the person's level and goals
3. Carries both forward when the user books, so the note appears on their dashboard

How it works and how it is made safe:

- The server loads the services from MongoDB and sends them to the Gemini API with the user's description. The AI can only choose from services that exist, and the server checks that the returned ID is real.
- The user's text is treated as untrusted data in the prompt, and the AI's reply is validated before it is used.
- The guide gives relaxation and practice guidance only. If a user mentions an injury, a medical condition, pregnancy, or distress, the app shows a fixed message recommending a doctor or instructor instead of advice. A keyword check also catches crisis language before the AI is called, and shows a message with the 988 Suicide & Crisis Lifeline.
- The endpoint requires login and is rate limited (10 requests per 15 minutes) to control cost.
- If the AI is unavailable, the user sees a friendly message and can still browse and book.

## Architecture

The project uses a three-tier architecture:

```text
client/   React frontend (presentation tier)
server/   Express API (application tier)
          MongoDB Atlas via Mongoose (data tier)
```

```text
client/src/
  pages/        one component per route
  components/   reusable UI (Navbar, ServiceCard, BookingCard, ProtectedRoute)
  context/      AuthContext (login state)
  services/     api.js (all requests to the backend)
  utils/        formatting helpers

server/src/
  routes/       URL paths
  controllers/  read the request, send the response
  services/     business logic (bookingService, aiService)
  models/       Mongoose schemas (User, Service, Instructor, Session, Booking)
  middleware/   auth, error handler
  config/       database connection
```

A request flows from a route to a controller to a service to a model.

## Getting Started

### Prerequisites

- Node.js (current LTS)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- A [Google AI Studio](https://aistudio.google.com) API key for the Gemini API

### 1. Clone

```bash
git clone https://github.com/peggieprospers/Serenisun.git
cd Serenisun
```

### 2. Run the backend

```bash
cd server
npm install
cp .env.example .env     # then fill in the values (see below)
npm run seed             # creates services, instructors, and two weeks of sessions
npm run dev              # starts the API on http://localhost:5001
```

### 3. Run the frontend

In a second terminal:

```bash
cd client
npm install
npm run dev              # opens on http://localhost:5173
```

In development, Vite forwards `/api` requests to the backend on port 5001, so no extra configuration is needed.

## Environment Variables

Real values are never committed. Copy `server/.env.example` to `server/.env`.

**Backend (`server/.env`)**

| Variable | Purpose |
| --- | --- |
| `PORT` | Port for the API (5001 locally, set automatically on Render) |
| `MONGODB_URI` | MongoDB Atlas connection string, ending in `/serenisun` |
| `JWT_SECRET` | Long random string used to sign login tokens |
| `GEMINI_API_KEY` | Gemini API key for the AI guide |
| `AI_MODEL` | Optional. Overrides the default Gemini model |

**Frontend (set on Netlify at build time)**

| Variable | Purpose |
| --- | --- |
| `VITE_API_URL` | The deployed API address, with no trailing slash |

## API Overview

| Method | Route | Description | Login required |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Create an account | No |
| POST | `/api/auth/login` | Log in and receive a token | No |
| GET | `/api/auth/me` | Current user | Yes |
| GET | `/api/services` | List services (filters: `category`, `type`, `maxDuration`) | No |
| GET | `/api/services/:id` | Service details with upcoming sessions and spots left | No |
| POST | `/api/bookings` | Book a session | Yes |
| GET | `/api/bookings` | The user's bookings | Yes |
| PATCH | `/api/bookings/:id` | Reschedule to another session of the same service | Yes |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking | Yes |
| POST | `/api/ai/recommend` | AI session recommendation | Yes |
| GET | `/api/health` | Health check | No |

## Deployment

- **Database:** MongoDB Atlas, with network access open so the hosted API can connect
- **Backend:** Render web service, root directory `server`, build `npm install`, start `npm start`, with the environment variables above
- **Frontend:** Netlify, base directory `client`, build `npm run build`, with `VITE_API_URL` set. A `_redirects` file makes page refreshes work on single-page routes

## Testing

The main workflows were tested end to end, locally and on the deployed site:

- Register, log in, log out, and access to protected pages
- Browsing and filtering services
- Booking a group class and a 1:1 slot, including capacity limits, duplicate bookings, and taken slots
- Reschedule and cancel, including that spots are freed
- The AI guide with a normal request, an injury mention, and a too-short request
- Layout on phone-width screens

[ADD: anything you tested with real users, and what you fixed because of it]

## How I Used AI During Development

I used Claude as a development assistant throughout the project:

- **Planning:** brainstorming ideas, narrowing the project to fit the capstone brief, and drafting the project idea, problem statement, scope, user stories, and requirements
- **Design:** drafting the database schema, architecture overview, wireframes, and page and component plan
- **Coding:** scaffolding the Express routes, Mongoose models, and React pages, which I then ran, tested, and adjusted
- **Debugging and deployment:** diagnosing problems such as a port conflict on macOS, file name capitalization that works on a Mac but fails on Linux hosting, dependencies installed in the wrong folder, and a missing comma in `package.json`
- **The product itself:** the AI session guide described above

What I did myself: chose and refined the idea, decided the scope, ran and tested every feature, verified the booking capacity rules with repeated and competing requests, and checked the AI's safety behavior. [EDIT THIS SECTION IN YOUR OWN WORDS]

## Known Limitations and Future Work

- No payments, video calls, or email confirmations
- Meeting links in the demo data are placeholders
- Instructors do not have their own login or dashboard yet
- Planned AI extensions: personalized home practices, feedback after practice, and progress tracking