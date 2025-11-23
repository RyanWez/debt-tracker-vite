import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import Header from './Header';

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-grid-pattern font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
                {/* Desktop Header Spacer to align with Sidebar */}
                <div className="hidden md:block p-4 border-b-3 border-black bg-white sticky top-0 z-40">
                    <div className="h-8"></div> {/* Matches logo height */}
                </div>

                <Header />
                <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </main>
                <MobileNav />
            </div>
        </div>
    );
}
