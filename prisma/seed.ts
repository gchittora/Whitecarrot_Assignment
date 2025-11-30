// Seed script to populate database with sample data
// Run with: npm run db:seed

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import * as bcrypt from 'bcryptjs'

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set')
}

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

// Helper function to convert "X days ago" to actual date
function getDaysAgo(postedText: string): Date {
    if (postedText === 'Posted today') {
        return new Date()
    }
    const match = postedText.match(/(\d+) days ago/)
    if (match) {
        const days = parseInt(match[1])
        const date = new Date()
        date.setDate(date.getDate() - days)
        return date
    }
    return new Date()
}

// Sample job data from the spreadsheet
const jobsData = [
    { title: "Full Stack Engineer", work_policy: "Remote", location: "Berlin, Germany", department: "Product", employment_type: "Full time", experience_level: "Senior", job_type: "Temporary", salary_range: "AED 8K–12K / month", job_slug: "full-stack-engineer-berlin", posted_days_ago: "40 days ago" },
    { title: "Business Analyst", work_policy: "Hybrid", location: "Riyadh, Saudi Arabia", department: "Customer Success", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "USD 4K–6K / month", job_slug: "business-analyst-riyadh", posted_days_ago: "5 days ago" },
    { title: "Software Engineer", work_policy: "Remote", location: "Berlin, Germany", department: "Sales", employment_type: "Contract", experience_level: "Senior", job_type: "Permanent", salary_range: "SAR 10K–18K / month", job_slug: "software-engineer-berlin", posted_days_ago: "32 days ago" },
    { title: "Marketing Manager", work_policy: "Hybrid", location: "Boston, United States", department: "Engineering", employment_type: "Part time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "AED 8K–12K / month", job_slug: "marketing-manager-boston", posted_days_ago: "22 days ago" },
    { title: "UX Researcher", work_policy: "Hybrid", location: "Boston, United States", department: "Engineering", employment_type: "Full time", experience_level: "Senior", job_type: "Permanent", salary_range: "USD 4K–6K / month", job_slug: "ux-researcher-boston", posted_days_ago: "31 days ago" },
    { title: "AI Product Manager", work_policy: "On-site", location: "Athens, Greece", department: "Operations", employment_type: "Full time", experience_level: "Junior", job_type: "Internship", salary_range: "INR 8L–15L / year", job_slug: "ai-product-manager-athens", posted_days_ago: "37 days ago" },
    { title: "Sales Development Representative", work_policy: "Remote", location: "Berlin, Germany", department: "Marketing", employment_type: "Full time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "INR 8L–15L / year", job_slug: "sales-development-representative-berlin", posted_days_ago: "27 days ago" },
    { title: "Frontend Engineer", work_policy: "Hybrid", location: "Athens, Greece", department: "Engineering", employment_type: "Part time", experience_level: "Junior", job_type: "Temporary", salary_range: "USD 80K–120K / year", job_slug: "frontend-engineer-athens", posted_days_ago: "59 days ago" },
    { title: "Sales Development Representative", work_policy: "On-site", location: "Cairo, Egypt", department: "Sales", employment_type: "Contract", experience_level: "Senior", job_type: "Internship", salary_range: "USD 4K–6K / month", job_slug: "sales-development-representative-cairo", posted_days_ago: "Posted today" },
    { title: "Data Analyst", work_policy: "On-site", location: "Dubai, United Arab Emirates", department: "Customer Success", employment_type: "Full time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "AED 8K–12K / month", job_slug: "data-analyst-dubai", posted_days_ago: "53 days ago" },
    { title: "Solutions Consultant", work_policy: "Hybrid", location: "Hyderabad, India", department: "Engineering", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "AED 8K–12K / month", job_slug: "solutions-consultant-hyderabad", posted_days_ago: "41 days ago" },
    { title: "Mobile Developer (Flutter)", work_policy: "Hybrid", location: "Athens, Greece", department: "Operations", employment_type: "Part time", experience_level: "Senior", job_type: "Permanent", salary_range: "USD 80K–120K / year", job_slug: "mobile-developer-flutter-athens", posted_days_ago: "43 days ago" },
    { title: "Operations Associate", work_policy: "Hybrid", location: "Bangalore, India", department: "Analytics", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "SAR 10K–18K / month", job_slug: "operations-associate-bangalore", posted_days_ago: "16 days ago" },
    { title: "QA Engineer", work_policy: "Hybrid", location: "Berlin, Germany", department: "Marketing", employment_type: "Contract", experience_level: "Junior", job_type: "Temporary", salary_range: "INR 8L–15L / year", job_slug: "qa-engineer-berlin", posted_days_ago: "48 days ago" },
    { title: "UX Researcher", work_policy: "On-site", location: "Berlin, Germany", department: "R&D", employment_type: "Full time", experience_level: "Senior", job_type: "Internship", salary_range: "USD 80K–120K / year", job_slug: "ux-researcher-berlin", posted_days_ago: "7 days ago" },
    { title: "Product Designer", work_policy: "On-site", location: "Boston, United States", department: "Operations", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "AED 12K–18K / month", job_slug: "product-designer-boston", posted_days_ago: "52 days ago" },
    { title: "Full Stack Engineer", work_policy: "Hybrid", location: "Dubai, United Arab Emirates", department: "Engineering", employment_type: "Part time", experience_level: "Mid-level", job_type: "Permanent", salary_range: "INR 8L–15L / year", job_slug: "full-stack-engineer-dubai", posted_days_ago: "22 days ago" },
    { title: "Product Designer", work_policy: "Remote", location: "Istanbul, Turkey", department: "Customer Success", employment_type: "Full time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "SAR 10K–18K / month", job_slug: "product-designer-istanbul", posted_days_ago: "17 days ago" },
    { title: "Marketing Manager", work_policy: "On-site", location: "Dubai, United Arab Emirates", department: "Engineering", employment_type: "Full time", experience_level: "Mid-level", job_type: "Internship", salary_range: "AED 8K–12K / month", job_slug: "marketing-manager-dubai", posted_days_ago: "3 days ago" },
    { title: "AI Product Manager", work_policy: "Hybrid", location: "Cairo, Egypt", department: "Analytics", employment_type: "Full time", experience_level: "Junior", job_type: "Permanent", salary_range: "AED 12K–18K / month", job_slug: "ai-product-manager-cairo", posted_days_ago: "17 days ago" },
    { title: "Backend Developer", work_policy: "Hybrid", location: "Bangalore, India", department: "Product", employment_type: "Part time", experience_level: "Senior", job_type: "Temporary", salary_range: "USD 80K–120K / year", job_slug: "backend-developer-bangalore", posted_days_ago: "21 days ago" },
    { title: "Technical Writer", work_policy: "On-site", location: "Berlin, Germany", department: "Sales", employment_type: "Full time", experience_level: "Junior", job_type: "Permanent", salary_range: "SAR 10K–18K / month", job_slug: "technical-writer-berlin", posted_days_ago: "13 days ago" },
    { title: "DevOps Engineer", work_policy: "Hybrid", location: "Dubai, United Arab Emirates", department: "Customer Success", employment_type: "Contract", experience_level: "Junior", job_type: "Internship", salary_range: "USD 80K–120K / year", job_slug: "devops-engineer-dubai", posted_days_ago: "37 days ago" },
    { title: "Customer Success Executive", work_policy: "Hybrid", location: "Istanbul, Turkey", department: "Customer Success", employment_type: "Full time", experience_level: "Junior", job_type: "Temporary", salary_range: "SAR 10K–18K / month", job_slug: "customer-success-executive-istanbul", posted_days_ago: "25 days ago" },
    { title: "Marketing Manager", work_policy: "On-site", location: "Cairo, Egypt", department: "Product", employment_type: "Part time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "USD 80K–120K / year", job_slug: "marketing-manager-cairo", posted_days_ago: "12 days ago" },
    { title: "Sales Development Representative", work_policy: "Hybrid", location: "Hyderabad, India", department: "Marketing", employment_type: "Full time", experience_level: "Senior", job_type: "Permanent", salary_range: "AED 12K–18K / month", job_slug: "sales-development-representative-hyderabad", posted_days_ago: "43 days ago" },
    { title: "Product Designer", work_policy: "Hybrid", location: "Boston, United States", department: "Analytics", employment_type: "Full time", experience_level: "Mid-level", job_type: "Temporary", salary_range: "INR 8L–15L / year", job_slug: "product-designer-boston-2", posted_days_ago: "42 days ago" },
    { title: "Cloud Architect", work_policy: "Remote", location: "Dubai, United Arab Emirates", department: "Customer Success", employment_type: "Contract", experience_level: "Mid-level", job_type: "Permanent", salary_range: "SAR 10K–18K / month", job_slug: "cloud-architect-dubai", posted_days_ago: "48 days ago" },
    { title: "Machine Learning Engineer", work_policy: "Remote", location: "Boston, United States", department: "Sales", employment_type: "Contract", experience_level: "Senior", job_type: "Temporary", salary_range: "INR 8L–15L / year", job_slug: "machine-learning-engineer-boston", posted_days_ago: "6 days ago" },
    { title: "DevOps Engineer", work_policy: "Remote", location: "Berlin, Germany", department: "Sales", employment_type: "Part time", experience_level: "Junior", job_type: "Temporary", salary_range: "SAR 10K–18K / month", job_slug: "devops-engineer-berlin", posted_days_ago: "13 days ago" },
]

async function main() {
    console.log('🌱 Starting database seed...')

    // Clear existing data
    console.log('🗑️  Clearing existing data...')
    await prisma.pageSection.deleteMany()
    await prisma.job.deleteMany()
    await prisma.user.deleteMany()
    await prisma.company.deleteMany()

    // Create company
    console.log('🏢 Creating company...')

    const company = await prisma.company.create({
        data: {
            slug: 'whitecarrot',
            name: 'WhiteCarrot',
            logoUrl: 'https://via.placeholder.com/200x60/4F46E5/FFFFFF?text=WhiteCarrot',
            bannerUrl: 'https://via.placeholder.com/1200x400/4F46E5/FFFFFF?text=WhiteCarrot+Careers',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            themeColor: '#4F46E5',
            description: 'WhiteCarrot is a leading technology company building innovative solutions for the modern workplace. Join our team and help shape the future of work.',
        },
    })

    // Create user (recruiter)
    console.log('👤 Creating user...')

    const hashedPassword = await bcrypt.hash('password123', 10)

    await prisma.user.create({
        data: {
            email: 'recruiter@whitecarrot.com',
            passwordHash: hashedPassword,
            name: 'Recruiter Admin',
            companyId: company.id,
        },
    })

    // Create page sections
    console.log('📄 Creating page sections...')

    await prisma.pageSection.createMany({
        data: [
            {
                companyId: company.id,
                sectionType: 'about_us',
                title: 'About WhiteCarrot',
                content: JSON.stringify({
                    text: 'WhiteCarrot is transforming how companies hire and manage talent. We\'re a global team of innovators, builders, and problem-solvers working to create the best recruitment platform in the world.',
                }),
                order: 1,
                isVisible: true,
            },
            {
                companyId: company.id,
                sectionType: 'life_at_company',
                title: 'Life at WhiteCarrot',
                content: JSON.stringify({
                    text: 'We believe in creating an environment where everyone can do their best work. Our culture is built on trust, transparency, and continuous learning.',
                    highlights: [
                        'Flexible remote work options',
                        'Generous learning & development budget',
                        'Inclusive and diverse workplace',
                        'Regular team events and offsites',
                        'Competitive compensation packages',
                    ],
                }),
                order: 2,
                isVisible: true,
            },
            {
                companyId: company.id,
                sectionType: 'benefits',
                title: 'Benefits & Perks',
                content: JSON.stringify({
                    benefits: [
                        { icon: '🏥', title: 'Health Insurance', description: 'Comprehensive medical, dental, and vision coverage for you and your family' },
                        { icon: '💰', title: 'Competitive Salary', description: 'Market-leading compensation with equity options' },
                        { icon: '🏖️', title: 'Flexible PTO', description: 'Take time off when you need it with our flexible vacation policy' },
                        { icon: '📚', title: 'Learning Budget', description: '$2,000 annual budget for courses, books, and conferences' },
                        { icon: '🏠', title: 'Remote First', description: 'Work from anywhere with flexible hours' },
                        { icon: '🎯', title: 'Career Growth', description: 'Clear career paths and mentorship programs' },
                    ],
                }),
                order: 3,
                isVisible: true,
            },
            {
                companyId: company.id,
                sectionType: 'values',
                title: 'Our Values',
                content: JSON.stringify({
                    values: [
                        { title: 'Customer First', description: 'We obsess over our customers and their success' },
                        { title: 'Innovation', description: 'We embrace new ideas and aren\'t afraid to fail' },
                        { title: 'Transparency', description: 'We communicate openly and honestly' },
                        { title: 'Diversity', description: 'We celebrate different perspectives and backgrounds' },
                        { title: 'Excellence', description: 'We set high standards and deliver quality work' },
                    ],
                }),
                order: 4,
                isVisible: true,
            },
        ],
    })

    // Create jobs from the spreadsheet data
    console.log('💼 Creating jobs...')

    const jobsToCreate = jobsData.map(job => {
        const description = `## About the Role

We're looking for a talented ${job.title} to join our ${job.department} team. This is a ${job.employment_type.toLowerCase()} ${job.job_type.toLowerCase()} position based in ${job.location}.

### Responsibilities
- Collaborate with cross-functional teams to deliver high-quality solutions
- Contribute to technical discussions and decision-making
- Mentor and support team members
- Drive innovation and continuous improvement

### Requirements
- ${job.experience_level} level experience in relevant field
- Strong communication and collaboration skills
- Passion for technology and innovation
- Ability to work in a ${job.work_policy.toLowerCase()} environment

### What We Offer
- Competitive salary: ${job.salary_range}
- Flexible ${job.work_policy.toLowerCase()} work arrangement
- Comprehensive benefits package
- Career growth opportunities

### Location & Work Policy
- **Location**: ${job.location}
- **Work Policy**: ${job.work_policy}
- **Employment Type**: ${job.employment_type}`

        return {
            companyId: company.id,
            title: job.title,
            description: description,
            location: job.location,
            jobType: job.employment_type,
            department: job.department,
            isActive: true,
            createdAt: getDaysAgo(job.posted_days_ago),
        }
    })

    await prisma.job.createMany({
        data: jobsToCreate,
    })

    console.log('✅ Seed completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`- Companies: ${await prisma.company.count()}`)
    console.log(`- Users: ${await prisma.user.count()}`)
    console.log(`- Jobs: ${await prisma.job.count()}`)
    console.log(`- Page Sections: ${await prisma.pageSection.count()}`)
    console.log('\n🔐 Test credentials:')
    console.log('Email: recruiter@whitecarrot.com')
    console.log('Password: password123')
    console.log('\n🌐 Company slug: whitecarrot')
    console.log('Public careers page will be at: /whitecarrot')
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
