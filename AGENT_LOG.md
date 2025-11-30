# AI Usage Log

This document tracks how I used AI tools while building this project.

## Tools Used

- ChatGPT (GPT-4) for code generation and debugging
- GitHub Copilot for autocomplete suggestions
- Claude (Anthropic) for some architecture decisions

## How I Used AI

### Initial Planning (30 minutes)

I started by pasting the assignment into ChatGPT and asking it to help me break down the requirements. I asked:

"I need to build a careers page builder. Here are the requirements: [pasted assignment]. Can you help me plan the database schema and tech stack?"

It suggested Next.js with Prisma and PostgreSQL, which made sense. I went with that.

For the database schema, I asked it to design tables for companies, users, jobs, and page sections. It gave me a good starting point, but I modified it:
- Added indexes myself after thinking about query patterns
- Changed some field names to be clearer
- Added the isActive field for jobs (AI didn't include this)

### Setting Up the Project (1 hour)

I used Copilot heavily here for boilerplate:
- Creating the Next.js app structure
- Setting up Prisma schema
- Writing the seed script

I'd type a comment like "// create company with sample data" and Copilot would suggest the code. I'd review it and usually tweak it.

The seed script data (30 job postings) was mostly AI-generated. I asked ChatGPT:

"Generate 30 realistic job postings for a tech company with different departments, locations, and job types"

I then manually adjusted some to make them more diverse.

### Building Features (4-5 hours)

For each major feature, I'd ask AI to help with the structure, then I'd implement and modify:

**Authentication**
- Asked ChatGPT: "How do I set up NextAuth v5 with credentials provider?"
- It gave me the basic setup
- I had to debug the session callbacks myself (AI's version didn't work)
- Spent 30 minutes reading NextAuth docs to fix it

**Dashboard**
- Used Copilot for the layout components
- Wrote the stats calculation logic myself
- AI suggested using cards for the overview, which looked good

**Job Management**
- Asked: "Create a form component for job CRUD with validation"
- Got a basic form, but I added:
  - The markdown description field
  - Better error handling
  - The active/inactive toggle
- The API endpoints were mostly AI-generated, but I added ownership checks

**Page Builder**
- This was tricky. I asked: "How should I store flexible content for different section types?"
- AI suggested JSON, which I went with
- The form component was AI-assisted
- I manually wrote the section rendering logic on the public page

**Filters**
- Asked: "Create a client component with search and filters for jobs"
- AI gave me the basic structure
- I added the "clear filters" button myself
- Tweaked the filter logic to be more intuitive

### Styling (1 hour)

I'm not great at design, so I leaned on AI here:

"Create a modern, professional design for a careers page with Tailwind CSS"

It gave me color schemes and component styles. I used probably 70% of what it suggested and adjusted the rest to look less "template-y".

The gradient backgrounds and card shadows were AI suggestions. The spacing and typography I adjusted manually.

### Debugging (1-2 hours)

When I hit errors, I'd paste them into ChatGPT:

"I'm getting this error: [error message]. Here's my code: [code]. What's wrong?"

This worked about 60% of the time. The other 40% I had to:
- Read documentation
- Google the error
- Try different approaches myself

The NextAuth session type errors took forever. AI kept giving me outdated v4 solutions. I eventually found the v5 docs and fixed it myself.

### Refinements

After getting everything working, I asked AI:

"Review this code and suggest improvements for security and performance"

It suggested:
- Adding indexes (I did this)
- Using bcrypt for passwords (already had it)
- Validating inputs on the backend (added more validation)
- Using React.memo for performance (didn't do this, seemed unnecessary)

## What AI Did Well

- Boilerplate code (forms, API routes, components)
- Suggesting libraries and tools
- Explaining concepts I didn't understand
- Generating sample data
- Basic styling and layout

## What AI Did Poorly

- NextAuth v5 setup (kept giving v4 code)
- Complex TypeScript types (had to fix manually)
- Understanding my specific requirements
- Security considerations (I had to add most checks)
- Edge cases (empty states, error handling)

## What I Did Myself

- Overall architecture decisions
- Database schema design (AI gave starting point)
- Security and ownership checks
- Multi-tenancy implementation
- URL structure decisions
- Preview mode feature
- Most of the debugging
- Testing and edge cases
- Refining the UI to not look AI-generated

## Prompts That Worked Well

"Create a [component name] that does [specific thing] with [constraints]"

Example: "Create a job form component that handles create and edit modes with validation and error handling"

"How do I [specific technical question]?"

Example: "How do I protect routes in Next.js App Router with middleware?"

"Review this code for [specific concern]"

Example: "Review this API endpoint for security issues"

## Prompts That Didn't Work

Vague questions like "Make this better" - too open-ended

Asking it to build entire features - the code was usually broken

Asking for "best practices" - got generic advice

## Lessons Learned

1. AI is great for getting started quickly, but you need to understand what it's doing
2. Always test AI-generated code - it often has subtle bugs
3. Use AI for boilerplate, but write critical logic yourself
4. Don't trust AI for security - verify everything
5. AI-generated designs look generic - add your own touches
6. Reading docs is still faster than debugging AI mistakes sometimes

## Time Breakdown

- Planning with AI: 30 min
- AI-assisted coding: 3 hours
- Manual coding: 2 hours
- Debugging AI code: 1.5 hours
- Styling/refinement: 1 hour
- Testing: 30 min

Total: About 8.5 hours

## Would I Use AI Again?

Yes, but differently:

- Use it more for learning and less for direct code generation
- Ask better, more specific questions
- Verify everything it suggests
- Use it as a pair programmer, not a replacement
- Keep the docs open alongside AI chat

Overall, AI probably saved me 2-3 hours on this project, but also cost me about an hour in debugging. Net positive, but not as much as I expected.

The best use was for boilerplate and explaining concepts. The worst was for complex features where I had to rewrite most of what it generated anyway.
