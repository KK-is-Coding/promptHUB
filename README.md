# ✨ PromptHUB — Discover & Share AI Prompts

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/) [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/) [![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/) [![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-black?logo=auth0&logoColor=white)](https://next-auth.js.org/) [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

> 🧠 A social feed for AI prompts — sign in, share the prompts you've crafted, tag them, and discover what everyone else is building.

PromptHUB is a full-stack **Next.js 14** app (App Router) where users log in with Google, post prompts they've written (with a tag for categorization), and browse a public feed of everyone's prompts — searchable by username, tag, or content.

---

## ✨ What it does

1. 🔐 **Sign in with Google** — auth is handled by **NextAuth.js**; a user record is auto-created in MongoDB on first login.
2. 📝 **Create prompts** — write a prompt, tag it (e.g. `#webdev`, `#chatgpt`), and publish it to the public feed.
3. 🌍 **Browse the feed** — every prompt from every user, newest data first, rendered as cards with the author's avatar, name, and email.
4. 🔍 **Live search** — a debounced search box filters the feed by **username, tag, or prompt text** in real time (client-side regex match, 500ms debounce).
5. 🏷️ **Tag click-to-search** — clicking any tag on a card instantly searches for every prompt sharing that tag.
6. 👤 **Profiles** — visit your own profile (`/profile`) to see and manage everything you've posted, or view another user's public profile (`/profile/[id]`) to see just their prompts.
7. ✏️ **Edit & delete** — on your own profile, each of your prompt cards gets **Edit** and **Delete** controls; edits route through `/update-prompt`.
8. 📋 **One-click copy** — copy any prompt's text to your clipboard directly from its card.

---

## 🗂️ Project structure

```
promptHUB/
├── app/                              # ⚛️ Next.js App Router
│   ├── layout.jsx                    #    root layout (fonts, Provider wrapper)
│   ├── page.jsx                      #    home page — renders the Feed
│   ├── create-prompt/                #    "new prompt" page
│   ├── update-prompt/                #    "edit prompt" page
│   ├── profile/                      #    logged-in user's profile
│   │   └── [id]/                     #    public profile view for other users
│   │
│   └── api/                          # 🔌 route handlers (backend, colocated)
│       ├── auth/[...nextauth]/       #    NextAuth.js Google OAuth config
│       ├── prompt/
│       │   ├── route.js              #    GET  — fetch all prompts
│       │   ├── new/route.js          #    POST — create a prompt
│       │   └── [id]/route.js         #    GET / PATCH / DELETE — single prompt CRUD
│       └── users/[id]/posts/         #    GET  — fetch one user's prompts
│
├── components/                       # 🧩 reusable UI
│   ├── Nav.jsx                       #    navbar + sign-in/sign-out
│   ├── Feed.jsx                      #    prompt feed + search/filter logic
│   ├── PromptCard.jsx                #    individual prompt card (copy/edit/delete)
│   ├── Form.jsx                      #    shared create/edit prompt form
│   ├── Profile.jsx                   #    profile grid of a user's prompts
│   └── Provider.jsx                  #    NextAuth SessionProvider wrapper
│
├── models/                           # 🧱 Mongoose schemas
│   ├── user.js                       #    email, username, image
│   └── prompt.js                     #    creator (ref → User), prompt text, tag
│
├── utils/
│   └── database.js                   # 🗄️ MongoDB connection helper (Mongoose)
│
└── styles/
    └── globals.css                   # 🎨 Tailwind entrypoint + custom classes
```

---

## 🛠️ Tech stack

| Layer | Tech |
|---|---|
| Framework | **Next.js 14** (App Router, mixed client/server components) |
| UI | **React 18**, **Tailwind CSS** |
| Auth | **NextAuth.js** with Google OAuth provider |
| Database | **MongoDB** via **Mongoose** ODM |
| API layer | Next.js **Route Handlers** (REST-style endpoints colocated in `app/api`) |
| Hosting-ready | Vercel (standard Next.js deployment target) |

---

## ✅ Prerequisites

- 🟢 Node.js 18+ and npm
- 🗄️ A MongoDB connection string (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- 🔑 A Google OAuth Client ID + Secret ([Google Cloud Console](https://console.cloud.google.com/apis/credentials))

---

## 🛠️ Setup

**1️⃣ Install dependencies**

```bash
npm install
```

**2️⃣ Configure environment variables**

Create a `.env.local` file in the project root:

```env
GOOGLE_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
mongoDB_URL=your_mongodb_connection_string
NEXTAUTH_SECRET=any_random_string_for_session_encryption
```

**3️⃣ Run the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign in with Google, and start posting prompts. 🚀

---

## 🧠 How it's built

- 🔐 **Auth flow**: `NextAuth`'s `signIn` callback checks MongoDB for an existing user by email; if none exists, it creates one from the Google profile (username derived from the display name, avatar from the Google profile picture). The `session` callback attaches the Mongo `_id` to the session so the rest of the app can reference `session.user.id`.
- 📡 **API design**: route handlers under `app/api` act as a lightweight REST layer — `GET /api/prompt` for the full feed, `POST /api/prompt/new` to create, `GET/PATCH/DELETE /api/prompt/[id]` for single-prompt operations, and `GET /api/users/[id]/posts` for a specific user's prompts.
- 🔗 **Data relationships**: `Prompt.creator` is a Mongoose `ObjectId` ref to `User`; feed and profile queries use `.populate("creator")` so each prompt card gets the author's username, email, and avatar in one query.
- 🔍 **Search**: implemented entirely client-side in `Feed.jsx` — prompts already fetched are filtered with a case-insensitive regex against `username`, `tag`, and `prompt` text, with a 500ms debounce on keystrokes to avoid filtering on every character.
- 🧩 **Component reuse**: the same `Form.jsx` component powers both `create-prompt` and `update-prompt`, just swapping the submit handler and pre-filled values.

---

## ⚠️ Notes and limitations

- 🔓 Auth is Google-only right now — no email/password or other OAuth providers are wired in.
- 🔍 Search is client-side over already-fetched data, so it won't scale gracefully once the feed grows very large — a server-side/indexed search (e.g. MongoDB text index) would be the next step.
- 🗑️ There's no pagination on the feed yet — every prompt is fetched in one request.
- 🖼️ Google-hosted avatar URLs are used directly for `next/image` — if Google ever changes its image CDN domain, `next.config.mjs`'s allowed image domains would need updating.

---

Made with ☕ while thinking about how many prompts one person can possibly need.
