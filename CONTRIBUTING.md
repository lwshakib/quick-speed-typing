# Contributing to Quicktype ⚡

First off, thank you for considering contributing to Quicktype! We're excited to have the community help build the best minimalist typing experience.

---

## 🧭 Roadmap & Core Philosophy

Quicktype aims to be:

1.  **Minimalist**: A distraction-free, premium interface that focuses on the typing experience.
2.  **Performant**: Leveraging Bun and Next.js for high-frequency updates and smooth interactions.
3.  **Insightful**: Providing detailed analytics and progress tracking for users.

---

## 🛠️ Development Environment

### Prerequisites

- [Bun](https://bun.sh/) (Required runtime)
- [PostgreSQL](https://www.postgresql.org/) (Local or via [Neon.tech](https://neon.tech))
- Node.js 20+ (Optional, if not using Bun for certain scripts)

### Installation

1.  Fork and clone the repository.
2.  Install dependencies:
    ```bash
    bun install
    ```
3.  Set up your `.env` file based on `.env.example`.
4.  Initialize the database:
    ```bash
    bun db:migrate
    ```

### Useful Commands

- `bun dev`: Start the development server.
- `bun db:studio`: Open Prisma Studio to view/edit database records.
- `bun lint`: Run ESLint to check for code quality issues.
- `bun format`: Format the codebase using Prettier.

---

## 🤝 How to Contribute

### 1. Reporting Bugs

- Search existing issues to avoid duplicates.
- Use the **Bug Report** template if available, or provide clear steps to reproduce, including your OS and browser.

### 2. Feature Requests

- Check the issues list for similar proposals.
- Open a new issue with the **Feature Request** label and describe the "why" and "how".

### 3. Pull Requests

1. Fork the repo and create your branch from `main`.
2. Ensure your code follows the existing style and passess all linting checks.
3. Provide a clear, concise description of your changes in the PR.
4. Link the PR to any relevant issues.

---

## 🎨 Coding Standards

- **TypeScript**: Use strict types. Avoid `any` at all costs.
- **Styling**: Use **Tailwind CSS v4** and follow the theme variables defined in `app/globals.css`.
- **Components**: Utilize **Shadcn UI** components from the `components/ui` directory for consistency.
- **Naming**:
  - Components: `PascalCase.tsx`
  - Hooks: `use-hook-name.ts`
  - Utilities/Libs: `kebab-case.ts`
- **Animations**: Use **Framer Motion** for all UI transitions and micro-interactions.

---

## 👮 Code of Conduct

Please review and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

---

Thank you for being part of the Quicktype community!

<p align="center">
  <a href="https://github.com/lwshakib/quick-speed-typing">
    <img src="public/logo.svg" width="50" alt="Quicktype Logo" />
  </a>
</p>
