<div align="center">

# BeatMe — Web Application

**Public leaderboard, player profiles & account management for BeatMe**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

</div>

---

## 📖 Overview

The BeatMe web application is the **public face** of the platform. It serves:

- **Live leaderboards** ranked by Elo rating
- **Player profiles** with Valorant stats and match history
- **Authentication** via Discord OAuth2
- **Valorant account linking** using Henrik's API
- **Modern UI** built with Next.js App Router + MUI

All data is **read from the same PostgreSQL database** used by the Discord bot.

---

## Screenshots

<table>
  <tr>
    <td width="50%">
      <img src="../assets/screenshots/leaderboard.png" alt="Leaderboard" />
      <p align="center"><b>Global Leaderboard</b></p>
    </td>
    <td width="50%">
      <img src="../assets/screenshots/player-profile.png" alt="Player Profile" />
      <p align="center"><b>Player Profile Page</b></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="../assets/screenshots/account-modal.png" alt="Account Modal" />
      <p align="center"><b>Account Modal</b></p>
    </td>
    <td width="50%">
      <img src="../assets/screenshots/valorant-link.png" alt="Valorant Linking" />
      <p align="center"><b>Link Valorant Account</b></p>
    </td>
  </tr>
</table>

---

## Features

### Public Leaderboard
- Live rankings by Elo rating
- Pagination (25 players per page)
- Region filter (EU, NA, AP, KR, LATAM, BR)
- Search by username or Riot ID
- Beautiful tier icons from Riot API

### Player Profiles
- Discord avatar + username
- Riot ID + Valorant tier
- Global rank position
- Rating, wins, losses, win rate
- Recent matches list (last 10)
- Direct link from leaderboard

### Authentication
- **Discord OAuth2** login
- **JWT** session in HttpOnly cookie
- **Auto-join** Discord server on registration
- Session persistence (7 days)
- Logout & session refresh

### Valorant Integration
- Link Valorant account via Riot ID
- Fetches:
  - PUUID (unique identifier)
  - Current tier & rank icon
  - Account region
- Uses **Henrik's Valorant API** (no API key required for development)
- Prevents duplicate linking (one Valorant account = one BeatMe user)

---

## Tech Stack

<table>
    <thead>
        <tr>
            <th>Category</th>
            <th>Technologies</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Framework</strong></td>
            <td>Next.js 14 (App Router, Server Components)</td>
        </tr>
        <tr>
            <td><strong>Language</strong></td>
            <td>TypeScript 5.6</td>
        </tr>
        <tr>
            <td><strong>UI</strong></td>
            <td>React 18, MUI v6, Tailwind CSS, Lucide Icons</td>
        </tr>
        <tr>
            <td><strong>Database</strong></td>
            <td>PostgreSQL (Neon), Prisma ORM 6</td>
        </tr>
        <tr>
            <td><strong>Auth</strong></td>
            <td>Discord OAuth2, jose (JWT)</td>
        </tr>
        <tr>
            <td><strong>External APIs</strong></td>
            <td>Discord API v10, Henrik's Valorant API</td>
        </tr>
        <tr>
            <td><strong>Dev Tools</strong></td>
            <td>tsx, ESLint, TypeScript strict mode</td>
        </tr>
    </tbody>
</table>

---

## Getting Started

### Prerequisites

- Node.js v18+
- A PostgreSQL database (or [Neon](https://neon.tech) free tier)
- A Discord application ([create one here](https://discord.com/developers/applications))

### 1. Install dependencies

```
npm install
2. Configure environment variables
Create a .env file at the root:
```

env
# Database
```
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"
```

# Discord OAuth
```
DISCORD_CLIENT_ID="your_client_id"
DISCORD_CLIENT_SECRET="your_client_secret"
DISCORD_REDIRECT_URI="http://localhost:3000/api/auth/discord/callback"
DISCORD_GUILD_ID="your_server_id"
DISCORD_BOT_TOKEN="your_bot_token"
```

# Session
```
SESSION_SECRET="generate_with_node_-e_console.log(require('crypto').randomBytes(32).toString('hex'))"
```

# App URL
```
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

# External APIs
```
HENRIK_API_KEY="your_henrik_api_key"  # Optional but recommended
```
3. Set up the database
```
npx prisma migrate deploy
npx prisma generate
```
4. Run the development server
```
npm run dev
Open http://localhost:3000 in your browser.
```

5. Build for production
```
npm run build
npm start
```
# Project Structure

```
BeatMe-Front/
├── src/
│   ├── app/                          # App Router
│   │   ├── page.tsx                  # Home (leaderboard)
│   │   ├── layout.tsx                # Root layout
│   │   ├── player/
│   │   │   └── [id]/                 # Player profile page
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── discord/          # OAuth flow
│   │   │   │   ├── me/               # Current user
│   │   │   │   └── logout/           # Logout
│   │   │   ├── players/              # Leaderboard API
│   │   │   └── valorant/
│   │   │       ├── link/             # Link Valorant account
│   │   │       └── unlink/           # Unlink Valorant account
│   │   └── globals.css
│   ├── components/
│   │   ├── NavActions/               # Top nav buttons
│   │   ├── AccountModal/             # Account settings modal
│   │   ├── Top/                      # Leaderboard table
│   │   ├── TopBar/                   # Filters + search
│   │   └── pagination/
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma singleton
│   │   ├── jwt.ts                    # JWT sign/verify
│   │   ├── discord.ts                # Discord OAuth helpers
│   │   └── valorant.ts               # Henrik API client
│   └── types/
│       └── user.ts                   # Shared user type
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── package.json
```

# API Routes

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Route</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>GET</td>
            <td>/api/auth/discord</td>
            <td>Start Discord OAuth flow</td>
        </tr>
        <tr>
            <td>GET</td>
            <td>/api/auth/discord/callback</td>
            <td>OAuth callback, sets session</td>
        </tr>
        <tr>
            <td>GET</td>
            <td>/api/auth/me</td>
            <td>Get current authenticated user</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/api/auth/logout</td>
            <td>Clear session cookie</td>
        </tr>
        <tr>
            <td>GET</td>
            <td>/api/players</td>
            <td>List players (with pagination, filters)</td>
        </tr>
        <tr>
            <td>POST</td>
            <td>/api/valorant/link</td>
            <td>Link Valorant account</td>
        </tr>
        <tr>
            <td>DELETE</td>
            <td>/api/valorant/unlink</td>
            <td>Unlink Valorant account</td>
        </tr>
    </tbody>
</table>

# Design Highlights

Dark theme with turquoise accents (#0fc4c1)

Server Components for zero-JS data fetching

Skeleton loading states for smooth UX

Modal-based account settings — no page reloads

Discord-native styling matching server aesthetics

Responsive across desktop, tablet, and mobile

# Deployment

This project is optimized for Vercel:

Push your code to GitHub

Import the repo in Vercel

Add environment variables in Vercel dashboard

Deploy!

Important: Make sure your DATABASE_URL points to a production database (Neon, Supabase, etc.).

# 🔒 Security

HttpOnly cookies prevent XSS token theft

CSRF protection via state parameter in OAuth

JWT expiration after 7 days

Prisma prepared statements prevent SQL injection

Environment variables never committed to Git

License
No open-source license is specified in this README.

<div align="center">
Built with ❤️ using Next.js & Prisma

</div> 
