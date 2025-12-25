import { useEffect } from 'react';
import { generateSitemap } from '../utils/generateSitemap';

const SitemapXML = () => {
    useEffect(() => {
        const sitemap = generateSitemap();
        const blob = new Blob([sitemap], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);

        // Redirect to download
        window.location.href = url;
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white text-lg">Generating sitemap...</p>
            </div>
        </div>
    );
};

export default SitemapXML;
