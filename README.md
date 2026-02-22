# <img src="public/logo.svg" width="40" height="40" align="center" /> Quicktype

**Quicktype** is a high-performance, minimalist, and minimalist speed typing application designed for the modern web. Built with a focus on speed, precision, and aesthetics, it provides a distraction-free environment with real-time analytics, deep progress tracking, and a premium user experience.

[![Project Status: Active](https://img.shields.io/badge/Project%20Status-Active-brightgreen.svg)](https://github.com/lwshakib/quick-speed-typing)
[![CI](https://github.com/lwshakib/quick-speed-typing/actions/workflows/ci.yml/badge.svg)](https://github.com/lwshakib/quick-speed-typing/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Built with Bun](https://img.shields.io/badge/Built%20with-Bun-f9f9f9.svg?logo=bun&logoColor=black)](https://bun.sh)

---

## 📱 Snapshot

### 🌑 Dark Mode (Carbon Theme)
The definitive typing experience with curated themes that are easy on the eyes.
<div align="center">
  <img src="public/app_demo/dark-demo.png" width="90%" alt="Quicktype Dark Mode" style="border-radius: 10px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);" />
</div>

<br />

### ☀️ Light Mode
Clean, high-contrast interface for maximum legibility and focus.
<div align="center">
  <img src="public/app_demo/light-demo.png" width="90%" alt="Quicktype Light Mode" style="border-radius: 10px; box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);" />
</div>

---

## ✨ Features

- **🎯 Precision Typing Engine**: High-frequency sampling for real-time WPM, raw WPM, accuracy, and consistency calculations.
- **🌍 Multi-Language Support**: Practice in English, Spanish, French, German, Bengali, Hindi, and more with localized word libraries.
- **📈 Advanced Analytics**: Interactive Recharts-powered graphs showing your typing evolution, raw speed, and errors after every test.
- **🏆 Global Leaderboard**: Compete with others in daily, weekly, and monthly sprints to claim the top spot.
- **🛡️ Secure Authentication**: Powered by **Better-Auth**, supporting Google OAuth and secure Email/Password sign-ins.
- **🎨 Elite Theme Engine**: Switch between premium themes like Carbon, Serika Dark, Nord, and more.
- **📊 Detailed History**: A persistent dashboard showcasing your growth, average WPM, and detailed test breakdowns.
- **⌨️ Diverse Modes**:
  - **Time mode**: 15, 30, 60, or 120-second sprints.
  - **Words mode**: 10, 25, 50, or 100-word challenges.
  - **Quote mode**: Practice with curated famous quotes and literature snippets.
  - **Zen Mode**: A minimalist, free-flow typing experience without distractions.
- **⚙️ Deep Customization**: Toggle punctuation, numbers, and font settings on the fly.

---

## 🛠️ Tech Stack

Quicktype is built using a modern, type-safe stack designed for performance and scalability:

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Actions)
- **Runtime**: [Bun](https://bun.sh) (Blazing fast JS runtime & package manager)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [PostgreSQL (Neon)](https://neon.tech/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [Better-Auth](https://better-auth.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [Zustand](https://zustand.docs.pmnd.rs/)
- **Formatting**: [Prettier](https://prettier.io/) with Tailwind Plugin

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed on your machine.
- A PostgreSQL database (e.g., [Neon.tech](https://neon.tech)).
- Google OAuth credentials (optional, for social login).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lwshakib/quick-speed-typing.git
   cd quick-speed-typing
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

   # Auth
   BETTER_AUTH_SECRET="generate-a-strong-secret"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"

   # OAuth Providers
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"

   # Email (Optional - Resend)
   RESEND_API_KEY="re_..."
   ```

4. **Initialize Database:**
   ```bash
   bun x prisma db push
   bun x prisma generate
   ```

5. **Run Development Server:**
   ```bash
   bun dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```text
├── app/              # Next.js App Router (Pages, Layouts, API)
├── components/       # React components (UI, Typing Engine, Animations)
├── generated/        # Prisma Client generation target
├── hooks/            # Custom React hooks (Typing logic, Themes)
├── lib/              # Utility functions, Auth config, Prisma client
├── prisma/           # Database schema and migrations
├── public/           # Static assets (Images, Logos, Fonts)
└── types/            # TypeScript type definitions
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/lwshakib">lwshakib</a>
</p>
