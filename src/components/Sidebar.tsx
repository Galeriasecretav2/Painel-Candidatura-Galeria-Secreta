import React from 'react';
import { Crown, DivideIcon as LucideIcon } from 'lucide-react';

interface SidebarItem {
  icon: LucideIcon;
  label: string;
  active: boolean;
  onClick: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-black shadow-2xl z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Crown className="w-8 h-8 text-amber-400" />
          <div>
            <h2 className="text-xl font-bold text-white">
              Galeria <span className="text-amber-400">Secreta</span>
            </h2>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <button
                onClick={item.onClick}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 group ${
                  item.active
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon 
                  className={`w-5 h-5 transition-transform duration-300 ${
                    item.active ? 'scale-110' : 'group-hover:scale-110'
                  }`} 
                />
                <span className="font-medium">{item.label}</span>
                {item.active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-lg p-4">
          <p className="text-amber-200 text-xs text-center">
            Versão 1.0<br />
            Sistema de Gestão
          </p>
        </div>
      </div>
    </div>
  );
};