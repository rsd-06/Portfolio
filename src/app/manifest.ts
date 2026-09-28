import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'rsd.exe',
        short_name: 'rsd.exe',
        description: 'Portfolio of Sudharshan R — Full-Stack Developer & Builder',
        start_url: '/',
        display: 'browser',
        background_color: '#FBF9F6',
        // theme_color: '',
        icons: [
        {
            src: '/favicon.ico',
            sizes: 'any',
            type: 'image/x-icon',
        },
        ],
    }
};