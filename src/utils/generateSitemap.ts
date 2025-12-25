interface SitemapUrl {
    loc: string;
    lastmod: string;
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority: number;
}

export const generateSitemap = (): string => {
    const baseUrl = 'https://techsavvysolution.in';
    const today = new Date().toISOString().split('T')[0];

    const urls: SitemapUrl[] = [
        // Main Pages
        { loc: '/', lastmod: today, changefreq: 'daily', priority: 1.0 },
        { loc: '/aboutus', lastmod: today, changefreq: 'monthly', priority: 0.9 },
        { loc: '/contactus', lastmod: today, changefreq: 'monthly', priority: 0.9 },

        // Services
        { loc: '/services', lastmod: today, changefreq: 'weekly', priority: 0.9 },

        // Programs
        { loc: '/programs', lastmod: today, changefreq: 'weekly', priority: 0.9 },

        // Projects
        { loc: '/projects', lastmod: today, changefreq: 'weekly', priority: 0.8 },

        // Student Portal
        { loc: '/student/login', lastmod: today, changefreq: 'monthly', priority: 0.7 },
        { loc: '/student/signup', lastmod: today, changefreq: 'monthly', priority: 0.7 },

        // Legal Pages
        { loc: '/privacy-policy', lastmod: today, changefreq: 'monthly', priority: 0.6 },
        { loc: '/terms-of-service', lastmod: today, changefreq: 'monthly', priority: 0.6 },
        { loc: '/refund-policy', lastmod: today, changefreq: 'monthly', priority: 0.6 },
        { loc: '/sitemap', lastmod: today, changefreq: 'monthly', priority: 0.5 },
    ];

    const xmlUrls = urls.map(url => `
    <url>
        <loc>${baseUrl}${url.loc}</loc>
        <lastmod>${url.lastmod}</lastmod>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
    </url>`).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${xmlUrls}
</urlset>`;
};
