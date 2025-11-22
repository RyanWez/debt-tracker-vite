import { Menu } from 'lucide-react';

export default function Header() {
    return (
        <header className="md:hidden sticky top-0 z-40 bg-white border-b-3 border-black p-4 gradient-yellow flex items-center justify-between">
            <h1 className="text-lg font-black flex items-center gap-2">
                <img src="/images/logo.svg" alt="Logo" className="w-6 h-6" />
                Debt Tracker
            </h1>
        </header>
    );
}
