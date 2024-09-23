# [Budget Tracker](https://budget-tracker-rosy.vercel.app/)

Budget Tracker is an open-source web application designed to help users effectively manage their finances. This is the project I use to study and learn more about NextJS.

[![Budget Tracker](./public/og.png)](https://budget-tracker-rosy.vercel.app/)

## Teck Stack

- **Framework:** [Next.js](https://nextjs.org)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Database:** [Supabase](https://supabase.io)
- **Authentication:** [Auth.js](https://authjs.dev/)
- **ORM:** [Prisma ORM](https://prisma.io)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com)
- **Email:** [Resend](https://resend.com/emails)
- **File Uploads:** [uploadthing](https://uploadthing.com)

## Features to be implemented

- [x] Authentication with Auth.js
- [x] File uploads with **uploadthing**
- [x] Email verification with **Resend**
- [x] ORM using **Prisma ORM**
- [x] Database on **Supabase**
- [x] Validation with **Zod**
- [x] Transactions management for income and expenses
- [x] Category management with customizable icons and types
- [x] Budget setting for tracking spending limits
- [x] Statistical insights for total income, expenses, and balance
- [x] History tracking of financial activity, filterable by date range
- [x] Data export functionality to CSV files
- [x] User profile management with options to update name, avatar, and password ...
- [x] Currency settings for multi-currency support
- [ ] Supports currency conversion

## Running Locally

1. Clone the repository

```bash
git clone https://github.com/Congglee/budget-tracker.git
```

2. Install dependencies using npm

```bash
npm install
```

3. Copy the `.env.example` to `.env` and update the variables.

```bash
cp .env.example .env
```

4. Start the development server

```bash
npm run dev
```

5. Push the database schema

```bash
npx prisma db:push
```

## How do I deploy this ?

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel).
