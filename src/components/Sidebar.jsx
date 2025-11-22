import { LayoutDashboard, Users, FileText, CreditCard, Settings, Lock } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const navItems = [
    { icon: LayoutDashboard, label: 'ပင်မစာမျက်နှာ', path: '/' },
    { icon: Users, label: 'ဖောက်သည်များ', path: '/customers' },
    { icon: FileText, label: 'ကြွေးမှတ်ရန်', path: '/debts' },
    { icon: CreditCard, label: 'ပြန်ဆပ်ငွေ', path: '/payments' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: Lock, label: 'Lock', path: '/lock' },
];

export default function Sidebar() {
    return (
        <aside className="hidden md:flex flex-col w-64 bg-white border-r-3 border-black h-screen sticky top-0">
            <div className="p-4 border-b-3 border-black gradient-yellow">
                <h1 className="text-xl font-black flex items-center gap-2">
                    <img src="/images/logo.svg" alt="Logo" className="w-8 h-8" />
                    Debt Tracker
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex items-center gap-3 p-3 font-bold border-2 border-black transition-all',
                                isActive
                                    ? 'gradient-yellow text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                                    : 'bg-white hover:bg-gray-100'
                            )
                        }
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4 border-t-3 border-black text-xs font-bold text-center text-gray-500">
                Version 2.0
            </div>
        </aside>
    );
}
