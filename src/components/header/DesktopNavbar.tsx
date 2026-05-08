"use client";

import RoleSwitcher from "./RoleSwitcher";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface menuItems {
    label: string,
    href: string,
};

const menuItems: menuItems[] = [
    { label: "Projects,", href: "/projects" },
    { label: "About,", href: "/about" },
    { label: "Resume", href: "/Sudharshan_R_Resume.pdf" },
];

export default function DesktopNavbar() {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path;
    };

    return (
        <nav className="w-full min-w-fit hidden md:flex justify-between items-center @container mx-auto text-sm lg:text-base xl:text-lg py-6 px-6 select-none">

            <div className="flex-1 max-w-fit flex items-center justify-between gap-10 lg:gap-30 xl:gap-40">
                <Link className="flex items-center gap-2 lg:gap-4 pointer-events-auto" href="/#prehero">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={25}
                        height={25}
                    />
                    <h1 className="text-text-primary text-center font-bold font-roboto text-lg lg:text-xl xl:text-xl 2xl:text-2xl ">rsd.exe</h1>
                </Link>
                <div className="pointer-events-auto">
                    <ul className="flex items-center gap-2 lg:gap-3 xl:gap-4 2xl:gap-5 ml-8 text-text-secondary font-mono font-semibold " >
                        {menuItems.map((item, index) => (
                            <Link 
                                key={index} 
                                href={item.href} 
                                className={isActive(item.href) ? "text-text-primary" : ""}
                                {...(item.href.endsWith(".pdf") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="flex items-center justify-between gap-16 lg:gap-16 xl:gap-20 2xl:gap-24 ml-8 text-text-secondary font-mono font-semibold pointer-events-auto">
                <div className="flex min-w-fit items-center text-text-primary font-extrabold font-tangerine text-2xl lg:text-3xl xl:text-3xl 2xl:text-4xl">
                    <RoleSwitcher />
                </div>
                <Link href="/contact" className="text-text-primary font-bold font-inter ">
                    Contact
                </Link>
            </div>
        </nav>
    );
};