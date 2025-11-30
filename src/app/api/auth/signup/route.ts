import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, password, companyName, companySlug } = body

        // Validate required fields
        if (!name || !email || !password || !companyName || !companySlug) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            )
        }

        // Validate password length
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            )
        }

        // Validate slug format
        if (!/^[a-z0-9-]+$/.test(companySlug)) {
            return NextResponse.json(
                { error: 'Company slug can only contain lowercase letters, numbers, and hyphens' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { error: 'Email already registered' },
                { status: 400 }
            )
        }

        // Check if company slug already exists
        const existingCompany = await prisma.company.findUnique({
            where: { slug: companySlug }
        })

        if (existingCompany) {
            return NextResponse.json(
                { error: 'Company URL slug already taken. Please choose another.' },
                { status: 400 }
            )
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Create company and user in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create company
            const company = await tx.company.create({
                data: {
                    slug: companySlug,
                    name: companyName,
                    logoUrl: `https://via.placeholder.com/200x60/4F46E5/FFFFFF?text=${encodeURIComponent(companyName)}`,
                    themeColor: '#4F46E5',
                }
            })

            // Create user
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    passwordHash,
                    companyId: company.id,
                }
            })

            // Create default page sections
            await tx.pageSection.createMany({
                data: [
                    {
                        companyId: company.id,
                        sectionType: 'about_us',
                        title: `About ${companyName}`,
                        content: JSON.stringify({
                            text: `Welcome to ${companyName}! We're building something amazing.`
                        }),
                        order: 1,
                        isVisible: true,
                    },
                    {
                        companyId: company.id,
                        sectionType: 'benefits',
                        title: 'Benefits & Perks',
                        content: JSON.stringify({
                            benefits: [
                                { icon: '🏥', title: 'Health Insurance', description: 'Comprehensive coverage' },
                                { icon: '💰', title: 'Competitive Salary', description: 'Market-leading compensation' },
                                { icon: '🏖️', title: 'Flexible PTO', description: 'Take time off when you need it' },
                            ]
                        }),
                        order: 2,
                        isVisible: true,
                    },
                ]
            })

            return { company, user }
        })

        return NextResponse.json({
            success: true,
            company: {
                id: result.company.id,
                slug: result.company.slug,
                name: result.company.name,
            },
            user: {
                id: result.user.id,
                email: result.user.email,
                name: result.user.name,
            }
        })

    } catch (error) {
        console.error('Signup error:', error)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}
