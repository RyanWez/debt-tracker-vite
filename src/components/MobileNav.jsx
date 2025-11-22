import { LayoutDashboard, Users, FileText, CreditCard, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';

const navItems = [
    { icon: LayoutDashboard, label: 'ပင်မ', path: '/' },
    { icon: Users, label: 'ဖောက်သည်', path: '/customers' },
    { icon: FileText, label: 'ကြွေး', path: '/debts' },
    { icon: CreditCard, label: 'ငွေ', path: '/payments' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function MobileNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-3 border-black z-50 pb-safe">
            <div className="grid grid-cols-5">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                'flex flex-col items-center justify-center p-2 text-[10px] font-bold border-r-2 border-black last:border-r-0',
                                isActive ? 'bg-yellow-300' : 'bg-white active:bg-gray-100'
                            )
                        }
                    >
                        <item.icon size={20} className="mb-1" />
                        {item.label}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
}
