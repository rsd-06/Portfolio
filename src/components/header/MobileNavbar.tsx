import { useState } from "react";

import StaggeredMenu from "../../../components/StaggeredMenu";

interface menuItems {
    label: string;
    ariaLabel: string;
    link: string;
}

interface socialItems {
    label: string;
    link: string;
}

export default function MobileNavbar() {

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const menuItems = [
        { label: 'Home', ariaLabel: 'Go to home page', link: '/#prehero' },
        { label: 'Projects', ariaLabel: 'Go to projects page', link: '/projects' },
        { label: 'About', ariaLabel: 'Learn about me', link: '/about' },
        { label: 'Resume', ariaLabel: 'View resume', link: '/Sudharshan_R_Resume.pdf' },
        { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
    ];

    const socialItems = [
        { label: 'Instagram', link: 'https://www.instagram.com/rsd_exe/' },
        { label: 'GitHub', link: 'https://github.com/rsd-06' },
        { label: 'LinkedIn', link: 'https://www.linkedin.com/in/sudharshan-r-b0a8b0254/' },
    ];

    return (
        <div className="w-full md:hidden select-none overflow-hidden" style={{ height: isMenuOpen ? '100vh' : '10vh' }}>
            <StaggeredMenu
                position="right"
                isFixed={false}
                items={menuItems}
                socialItems={socialItems}
                displaySocials
                displayItemNumbering={true}
                menuButtonColor="#1F1F1F"
                openMenuButtonColor="#5227FF"
                changeMenuColorOnOpen={true}
                colors={['#B19EEF', '#5227FF']}
                logoUrl="/logo.png"
                accentColor="#3D0FE0"
                onMenuOpen={() => setIsMenuOpen(true)}
                onMenuClose={() => setIsMenuOpen(false)}
            />
        </div>
    );
}