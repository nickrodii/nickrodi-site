type CardVariant = 'default' | 'featured';
type LinkUrl = { label: string; href: string; };

export type Project = {
    id: string;
    title: string;
    description: string;
    imageUrl?: string;
    linkUrl?: { repo?: LinkUrl; live?: LinkUrl; article?: LinkUrl; };
    variant?: CardVariant;
}