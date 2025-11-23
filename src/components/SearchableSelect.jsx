import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function SearchableSelect({ options, value, onChange, placeholder = "Select..." }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (option) => {
        onChange(option.id);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <button
                type="button"
                className={`custom-dropdown-button brutalist-input w-full p-3 ${!selectedOption ? 'empty' : ''} ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-bold text-black">
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <ChevronDown 
                    size={20} 
                    className={`dropdown-arrow transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            {isOpen && (
                <div className="custom-dropdown-panel open">
                    <div className="custom-dropdown-search">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                            <input
                                type="text"
                                className="w-full pl-9 p-2 border-2 border-black font-bold"
                                placeholder="🔍 ရှာရန်..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="custom-dropdown-list hide-scrollbar">
                        {filteredOptions.length === 0 ? (
                            <div className="p-3 text-center text-gray-500 font-bold text-sm">
                                မတွေ့ပါ
                            </div>
                        ) : (
                            filteredOptions.map(option => (
                                <div
                                    key={option.id}
                                    className={`custom-dropdown-item ${option.id === value ? 'selected' : ''}`}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.name}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
