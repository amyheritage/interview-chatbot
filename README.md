# Tina

An AI interview coach that runs a seven-question practice interview and scores every answer against the STAR method.

## The Problem

When a company restructures, staff get moved into roles they have never interviewed for. Most have not sat an interview in years, and practising in front of a manager carries a risk they would rather avoid. Capable people interview badly for jobs they could do well.

## The Solution

Tina runs a practice interview for any role the user names, built for Turners Car Insurance staff moving into new positions during a digital transformation. It scores each answer against STAR and explains what to say differently, so users leave with specific changes to make rather than a number.

## How It Works

1. Type the role you are preparing for, such as "Digital Claims Specialist".
2. Tina asks seven questions, technical and behavioural, adapted to that role.
3. Answer in your own words. Skip a question or revisit an earlier one at any point.
4. Each answer is scored against STAR: situation, task, action, result.
5. You get a written summary of what worked, what was missing, and what to change.

## Tech Stack

`Gemini API` `React 19` `TypeScript` `Tailwind CSS` `Framer Motion` `Node.js` `Express` `Vite` `Vitest`

## Note

Portfolio project built to demonstrate my work. Not maintained for reuse or contribution.

---

## Running it locally

```bash
cp .env.example .env   # add your GEMINI_API_KEY
npm install
npm run dev
```

Note: this build injects the Gemini key into the browser bundle, so use a throwaway, quota-limited key rather than a billing-enabled one.
