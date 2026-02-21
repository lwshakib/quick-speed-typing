# Contributing to Quick Type ⚡

First off, thank you for considering contributing to Quick Type! We're excited to have the community help build the best minimalist typing experience.

---

## 🧭 Roadmap & Core Philosophy

Quick Type aims to be:

1. **Minimalist**: Distraction-free interface.
2. **Performant**: High-frequency updates and smooth animations.
3. **Analytics-driven**: Providing deep insights into typing habits.

## 🛠️ Development Environment

### Prerequisites

- [Bun](https://bun.sh/) (Recommended) or Node.js 20+
- [PostgreSQL](https://www.postgresql.org/) (Local or via Neon.tech)

### Project Structure

- `app/`: Next.js App Router (pages and server actions)
- `components/`: UI components (Shadcn UI + Custom)
- `hooks/`: Custom React hooks (including the typing engine)
- `lib/`: Utilities, Auth configs, and Prisma client
- `prisma/`: Database schema and migrations

### Commands

- `bun install`: Install dependencies
- `bun dev`: Start development server
- `bun x prisma db push`: Sync database schema
- `bun x prisma studio`: View database records

## 🤝 How to Contribute

### 1. Reporting Bugs

- Search existing issues for a duplicate.
- If new, use the **Bug Report** template.
- Include OS, browser, and steps to reproduce.

### 2. Feature Requests

- Check the [Roadmap](https://github.com/lwshakib/quick-speed-typing/issues) or existing issues.
- Propose new features by opening an issue with the **Feature Request** label.

### 3. Pull Requests

1. Fork the repo and create your branch from `main`.
2. Follow the project's **Tailwind CSS** guidelines for styling.
3. Ensure no linting errors: `bun run lint`.
4. Provide a clear description of what changed and why.

## 🎨 Coding Standards

- **TypeScript**: Use strict types where possible.
- **Styling**: Stick to the curated theme variables in `globals.css`.
- **Naming**: Use kebab-case for files and PascalCase for components.
- **Micro-interactions**: Use Framer Motion for any new UI transitions.

## 👮 Code of Conduct

Please review and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

---

Thank you for being part of the Quick Type community!

<p align="center">
  <a href="https://github.com/lwshakib/quick-speed-typing">
    <img src="public/logo.svg" width="50" alt="Quick Type Logo" />
  </a>
</p>
