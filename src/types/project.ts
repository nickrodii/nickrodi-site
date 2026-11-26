type CardVariant = 'default' | 'featured' | 'mini';
type ProjectType = 'personal' | 'class';
type LinkUrl = { label: string; href: string; };

export type Project = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    /** Looping clip shown in place of imageUrl on a featured card. */
    video?: { src: string; poster?: string; };
    linkUrl?: { repo?: LinkUrl; live?: LinkUrl; article?: LinkUrl; };
    variant?: CardVariant;
    projectType?: ProjectType;
}
