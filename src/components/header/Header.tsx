import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

export default function Header() {
    return (
        <header className="w-screen sticky top-0 z-50 bg-transparent max-w-screen min-w-screen">
            <div className="flex items-center">
                {/* Desktop Navbar */}
                <DesktopNavbar />

                {/* Mobile Navbar */}
                <MobileNavbar />
            </div>
        </header>
    );
};