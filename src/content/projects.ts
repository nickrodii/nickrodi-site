import type { Project } from '@/types/project';

export const projects: Project[] = [
    {
        id: 'dlclip',
        title: 'DLClip',
        description: 'FFmpeg and yt-dlp wrapper built using .NET\'s WPF and C# for Windows PCs',
        imageUrl: '/images/projects/dlclip.png',
        linkUrl: {
            repo: { label: 'GitHub', href: 'https://github.com/nickrodii/dlclip' },
        },
        variant: 'default',
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
        variant: 'default',
    },
    {
        id: 'smptools',
        title: 'SMPtools',
        description: 'A variety of plug-and-play Minecraft server plugins made for small survival servers, built using Maven Java, Paper API, and YAML.',
        // imageUrl: '/images/projects/smptools.png',
        linkUrl: {
            repo: { label: 'GitHub', href: 'https://github.com/nickrodii/smptools' },
            live: { label: 'Check it out', href: 'https://modrinth.com/collection/GQSRign2' },
        },
        variant: 'featured',
    },
]