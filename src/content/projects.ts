import type { Project } from '@/types/project';

// Ordered most impressive first. The list renders in this order within each
// tier: featured, then default, then mini.
export const projects: Project[] = [
    {
        id: 'spinir',
        title: 'spinir',
        description: 'Social platform for cataloging and rating physical music collections, built as a React web app and a native SwiftUI iOS app on a shared Supabase backend.',
        imageUrl: '/images/projects/spinir.png',
        video: {
            src: '/videos/spinir-header.mp4',
            poster: '/videos/spinir-header-poster.jpg',
        },
        linkUrl: {
            live: { label: 'Check it out', href: 'https://spinir.app' },
            article: { label: 'More info', href: '/pages/spinir' },
        },
        variant: 'featured',
        projectType: 'personal',
    },
    {
        id: 'nircraftcore',
        title: 'NircraftCORE',
        description: 'Minecraft plugin built with Java, Maven, and the Paper API that powers Nircraft, an RPG based survival server',
        imageUrl: '/images/projects/nircraftcore.png',
        linkUrl: {
            article: { label: 'More info', href: '/pages/nircraftcore' },
        },
        variant: 'default',
        projectType: 'personal',
    },
    {
        id: 'mcpp',
        title: 'mcpp',
        description: 'Esoteric language interpreter built with C++ that attempts to mirror Minecraft command syntax.',
        imageUrl: '/images/projects/mcpp.png',
        linkUrl: {
            repo: { label: 'GitHub', href: 'https://github.com/nickrodii/mcpp' },
        },
        variant: 'default',
        projectType: 'personal',
    },
    {
        id: 'dlclip',
        title: 'DLClip',
        description: 'FFmpeg and yt-dlp wrapper built using .NET\'s WPF and C# for Windows PCs',
        imageUrl: '/images/projects/dlclip.png',
        linkUrl: {
            repo: { label: 'GitHub', href: 'https://github.com/nickrodii/dlclip' },
        },
        variant: 'default',
        projectType: 'personal',
    },
    {
        id: 'qa-system',
        title: 'Q&A System',
        description: 'Question-and-answer platform built with Java, JavaFX, and SQL that supports account, role, and post management.',
        imageUrl: '/images/projects/qna.png',
        linkUrl: {
            article: { label: 'More info', href: '/pages/qa-system' },
        },
        variant: 'mini',
        projectType: 'class',
    },
    {
        id: 'textmulti',
        title: 'TextMulti',
        description: 'Live text-sync demo built with C#, gRPC, and WPF that streams client input into a desktop UI in real time.',
        imageUrl: '/images/projects/textmulti.png',
        linkUrl: {
            repo: { label: 'GitHub', href: 'https://github.com/nickrodii/TextMulti' },
        },
        variant: 'mini',
        projectType: 'personal',
    },
    {
        id: 'event-finder',
        title: 'Event Finder',
        description: 'Event platform built with ASP.NET and C# that supports authentication, role-based access, and registration.',
        imageUrl: '/images/projects/eventfinder.png',
        linkUrl: {
            article: { label: 'More info', href: '/pages/event-finder' },
        },
        variant: 'mini',
        projectType: 'class',
    },
    {
        id: 'nickrodi-site',
        title: 'nickrodi.com',
        description: 'Portfolio built with Next.js, TypeScript, and Tailwind CSS, hosted from a home server using Debian and Cloudflared',
        imageUrl: '/images/projects/nickrodi-site.png',
        linkUrl: {
            repo: { label: 'GitHub', href: 'https://github.com/nickrodii/nickrodi-site' },
            live: { label: 'Check it out', href: 'https://nickrodi.com' },
        },
        variant: 'mini',
        projectType: 'personal',
    },
    {
        id: 'minecraftplugins',
        title: 'Minecraft plugins',
        description: 'Many different small utility Minecraft plugins.',
        imageUrl: '/images/projects/mcplugins.png',
        linkUrl: {
            live: { label: 'Check it out', href: 'https://modrinth.com/user/nickrodi' },
        },
        variant: 'mini',
        projectType: 'personal',
    },
]
