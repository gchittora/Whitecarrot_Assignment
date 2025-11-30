# Careers Page Builder

A platform that lets companies create and manage their own branded careers pages. Recruiters can customize their page, post jobs, and share a public link. Candidates can browse jobs with filters and search.

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- PostgreSQL database (I used Neon's free tier)

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd careers-page-builder
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create a `.env` file in the root directory:

```
DATABASE_URL="your-postgresql-connection-string"
AUTH_SECRET="any-long-random-string-for-jwt-signing"
```

For the database, I recommend Neon.tech's free tier. Just sign up and copy the connection string.

For AUTH_SECRET, you can generate one with:
```bash
openssl rand -base64 32
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

This creates the tables and adds sample data (WhiteCarrot company with 30 jobs).

5. Run the development server
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### Test Credentials

After seeding, you can log in with:
- Email: recruiter@whitecarrot.com
- Password: password123

## What I Built

### For Recruiters

**Authentication**
- Sign up creates a new company and admin user
- Login with email and password
- Protected dashboard routes

**Dashboard**
- Overview showing stats (total jobs, active jobs, sections)
- Quick actions to create jobs or edit content
- Recent jobs list

**Job Management**
- Create, edit, and delete job postings
- Toggle jobs active/inactive
- Fields: title, location, type, department, description
- Description supports basic markdown (##, -, **)
- Table view of all jobs with filters

**Page Builder**
- Add, edit, and delete page sections
- Section types: About Us, Life at Company, Benefits, Values
- Reorder sections by changing order number
- Toggle section visibility
- Content stored as JSON (flexible for different section types)

**Company Settings**
- Update company name and URL slug
- Add logo and banner image URLs
- Set YouTube video URL
- Choose theme color (applies to public page)
- Preview link to see changes

**Preview Mode**
- Banner appears when viewing your own careers page
- Quick link back to dashboard

### For Candidates

**Public Careers Page**
- Clean, branded design with company logo and colors
- Hero section with company info
- Optional video section
- Customizable content sections
- List of open positions

**Job Browsing**
- Search by job title
- Filter by department
- Filter by location
- Filter by job type
- Shows active filter count
- Clear all filters button
- Empty state when no results

**Job Details**
- Full job description
- Location, type, and department info
- Posted date
- Apply button (placeholder for now)
- Back link to careers page

## How It Works

### Multi-Tenancy

Each company gets their own:
- Unique URL (yoursite.com/company-slug/careers)
- Separate data (jobs, sections, settings)
- One admin user

All data is isolated by companyId. When you log in, your session includes your companyId, and all queries filter by it. This means companies can't see or edit each other's data.

### Data Flow

1. User signs up -> Creates Company and User records
2. User logs in -> NextAuth creates session with companyId
3. User creates job -> API checks session, adds job with companyId
4. Public page loads -> Fetches company by slug, shows their jobs/sections
5. Filters applied -> Client-side filtering (no page reload)

### URL Structure

- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Admin dashboard (protected)
- `/dashboard/jobs` - Job management (protected)
- `/dashboard/page-builder` - Section management (protected)
- `/dashboard/settings` - Company settings (protected)
- `/{company-slug}/careers` - Public careers page
- `/{company-slug}/careers/jobs/{job-id}` - Job details page

## User Guide

### Getting Started

1. Go to /signup
2. Fill in your name, email, password, company name, and desired URL slug
3. You'll be auto-logged in and redirected to the dashboard

### Creating Your First Job

1. Click "Jobs" in the navigation
2. Click "Create New Job"
3. Fill in the job details:
   - Title (e.g., "Senior Software Engineer")
   - Location (e.g., "San Francisco, CA" or "Remote")
   - Job Type (Full-time, Part-time, Contract, Internship)
   - Department (optional, e.g., "Engineering")
   - Description (supports ## for headings, - for bullets, ** for bold)
   - Check "Active" to make it visible
4. Click "Create Job"

The job will appear on your careers page immediately.

### Customizing Your Page

1. Click "Page Builder" in the navigation
2. You'll see your existing sections (created during signup)
3. To edit a section:
   - Click "Edit"
   - Modify the title or content (JSON format)
   - Change the order number to reorder
   - Uncheck "Visible" to hide it
   - Click "Update Section"
4. To add a section:
   - Click "Add New Section"
   - Choose a section type
   - Fill in title and content
   - Set the order number
   - Click "Create Section"

### Updating Company Settings

1. Click "Settings" in the navigation
2. Update any of these:
   - Company name
   - URL slug (be careful, this changes your public URL)
   - Description (shows in hero section)
   - Logo URL (link to your logo image)
   - Banner URL (background image for hero)
   - Video URL (YouTube link)
   - Theme color (hex code, affects buttons and hero)
3. Click "Save Settings"

Changes apply immediately. Use the "View Careers Page" link to preview.

### Managing Jobs

**To edit a job:**
1. Go to Jobs page
2. Click "Edit" on any job
3. Make changes
4. Click "Update Job"

**To hide a job:**
1. Edit the job
2. Uncheck "Active"
3. Save

**To delete a job:**
1. Edit the job
2. Click "Delete Job" at the bottom
3. Confirm

### Sharing Your Careers Page

Your public URL is: yoursite.com/{your-slug}/careers

Share this link on your website, social media, or anywhere you want to attract candidates.

## Future Improvements

If I had more time, here's what I'd add:

**High Priority**
- Application form so candidates can actually apply
- Email notifications when someone applies
- File upload for logos/banners instead of requiring URLs
- Password reset flow
- Email verification on signup
- Better markdown editor for job descriptions

**Medium Priority**
- Analytics dashboard (page views, applications per job)
- Multiple users per company with different roles
- Draft/publish workflow for jobs and sections
- Duplicate job feature
- Bulk actions (delete multiple jobs)
- Export jobs to CSV

**Nice to Have**
- Custom domain support
- More section types (team photos, testimonials, FAQ)
- Visual page builder (drag and drop)
- Application tracking system
- Interview scheduling
- Candidate database

**Technical**
- Automated tests
- Better error handling
- Rate limiting on API
- Image optimization
- Caching for public pages
- Structured data for SEO
- Full accessibility audit

## Tech Stack

- Next.js 16 (App Router)
- React
- TypeScript
- Tailwind CSS
- NextAuth.js v5
- Prisma ORM
- PostgreSQL (Neon)

## Project Structure

```
careers-page-builder/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data
├── src/
│   ├── app/
│   │   ├── [companySlug]/careers/  # Public pages
│   │   ├── dashboard/              # Admin area
│   │   ├── login/                  # Auth pages
│   │   ├── signup/
│   │   └── api/                    # API routes
│   ├── components/                 # Shared components
│   ├── lib/                        # Utilities
│   └── types/                      # TypeScript types
├── .env                       # Environment variables
└── package.json
```

## Troubleshooting

**Database connection fails**
- Check your DATABASE_URL in .env
- Make sure your database is running
- Try `npx prisma db push` again

**Login doesn't work**
- Make sure AUTH_SECRET is set in .env
- Restart the dev server after adding it
- Check the browser console for errors

**Changes don't appear**
- Hard refresh the page (Cmd+Shift+R or Ctrl+Shift+R)
- Check if the job/section is marked as active/visible
- Make sure you're viewing the right company's page

**TypeScript errors**
- Run `npx prisma generate` to update types
- Restart your editor
- Check for missing dependencies


