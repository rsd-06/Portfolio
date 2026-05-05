import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'rsd.exe',
        short_name: 'rsd.exe',
        description: 'Portfolio of rsd.exe',
        start_url: '/',
        display: 'browser',
        background_color: '#FBF9F6',
        // theme_color: '',
        icons: [
        {
            src: '/src/app/favicon.ico',
            sizes: 'any',
            type: 'image/x-icon',
        },
        ],
    }
};