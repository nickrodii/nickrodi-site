import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nickrodi.com';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    }, 
    // map over DB results if i make a blog
    // also return baseUrl/(whatever the page is) if u make more pages
  ];
}