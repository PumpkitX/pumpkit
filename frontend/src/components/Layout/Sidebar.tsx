import React from 'react';
import { NavLink } from 'react-router-dom';
import { Rocket, History } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-background-light border-r border-primary/20 h-[calc(100vh-4rem)] p-4">
      <nav className="space-y-2">
        <NavLink
          to="/dashboard/pump"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-3 rounded-lg transition-all ${
              isActive
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-primary/10'
            }`
          }
        >
          <Rocket className="w-5 h-5" />
          <span>Pump your token</span>
        </NavLink>
        
        <NavLink
          to="/dashboard/history"
          className={({ isActive }) =>
            `flex items-center space-x-2 p-3 rounded-lg transition-all ${
              isActive
                ? 'bg-primary text-white'
                : 'text-gray-400 hover:bg-primary/10'
            }`
          }
        >
          <History className="w-5 h-5" />
          <span>Your pumps</span>
        </NavLink>
      </nav>
    </aside>
  );
}