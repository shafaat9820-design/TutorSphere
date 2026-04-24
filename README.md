# TutorSphere

TutorSphere is a comprehensive platform designed to bridge the gap between students/parents and qualified tutors. It facilitates easy discovery, communication, and management of tutoring services.

## 🚀 Features

- **Dual Roles**: Dedicated dashboards for Tutors and Parents/Students.
- **Smart Discovery**: Search and filter tutors based on subjects, experience, and location.
- **Secure Authentication**: Email-based OTP and JWT-secured sessions.
- **Monetization Interface**: Integrated payment processing via Razorpay.
- **Anti-Cheat Measures**: Device fingerprinting and IP tracking for platform integrity.
- **Real-time Notifications**: Automated email notifications via Brevo (Sendinblue).
- **Responsive Management**: Post tutoring requirements and manage applications.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Routing**: [Wouter](https://github.com/molecula-org/wouter)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: Firebase Admin & JWT
- **Email Service**: Brevo API (sib-api-v3-sdk)

### Infrastructure
- **Monorepo**: Managed using `pnpm` workspaces.
- **Type Safety**: End-to-end TypeScript.

## 📦 Project Structure

```text
├── artifacts/
│   ├── api-server/       # Express Backend
│   └── tutorconnect/     # React Frontend (TutorSphere)
├── lib/
│   ├── api-spec/         # OpenAPI definitions
│   └── db/               # Database schema and migrations
├── scripts/              # Utility scripts
└── package.json          # Workspace configuration
```

## 🚥 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (latest LTS)
- [pnpm](https://pnpm.io/)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables in `.env` (refer to `.env.example` in subdirectories).

### Running Locally
To start both the API server and the frontend concurrently:
```bash
pnpm run dev
```

## 📄 License
This project is private and intended for internal use.
