'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface MenuItem {
  label: string;
  icon?: string;
  isNew?: boolean;
  isHot?: boolean;
  href?: string; // 添加链接属性
}

interface DropdownMenuProps {
  label: string;
  items: MenuItem[];
  isActive: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function DropdownMenu({
  label,
  items,
  isActive,
  onOpenChange,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    setIsOpen(isActive);
  }, [isActive]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
    onOpenChange(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      onOpenChange(false);
    }, 150);
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:text-primary hover:bg-accent hover:rounded-md transition-colors text-foreground">
        {label}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-2 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-50 min-w-48 animate-in fade-in slide-in-from-top-2">
          <div className="py-2">
           {items.map((item, index) => (
              item.href ? (
                <Link
                  prefetch={false}
                  key={index}
                  href={item.href}
                  className="block w-full px-4 py-3 text-left hover:bg-secondary transition-colors text-foreground text-sm flex items-center justify-between group relative"
                >
                  <span className="flex items-center gap-2">
                    {item.icon && <span className="text-base">{item.icon}</span>}
                    <span className="group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    {item.isNew && (
                      <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded">
                        NEW
                      </span>
                    )}
                    {item.isHot && (
                      <span className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-700 rounded">
                        HOT
                      </span>
                    )}
                  </span>
                  <div className="h-0.5 bg-green-500 absolute bottom-0 left-0 w-0 group-hover:w-full transition-all duration-300" />
                </Link>
              ) : (
                <button
                  key={index}
                  className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors text-foreground text-sm flex items-center justify-between group relative"
                >
                  <span className="flex items-center gap-2">
                    {item.icon && <span className="text-base">{item.icon}</span>}
                    <span className="group-hover:text-primary transition-colors">
                      {item.label}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    {item.isNew && (
                      <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded">
                        NEW
                      </span>
                    )}
                    {item.isHot && (
                      <span className="text-xs font-semibold px-2 py-1 bg-orange-100 text-orange-700 rounded">
                        HOT
                      </span>
                    )}
                  </span>
                  <div className="h-0.5 bg-green-500 absolute bottom-0 left-0 w-0 group-hover:w-full transition-all duration-300" />
                </button>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
