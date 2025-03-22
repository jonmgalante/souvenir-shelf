
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, Grid, FolderPlus, PlusCircle, User } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex justify-around py-2">
        <NavItem to="/collection" icon={<Grid className="nav-icon" />} label="Collection" />
        <NavItem to="/map" icon={<Map className="nav-icon" />} label="Map" />
        <NavItem to="/add" icon={<PlusCircle className="nav-icon" />} label="Add" addClass="text-primary" />
        <NavItem to="/trips" icon={<FolderPlus className="nav-icon" />} label="Trips" />
        <NavItem to="/profile" icon={<User className="nav-icon" />} label="Profile" />
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  addClass?: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, addClass = "" }) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex flex-col items-center justify-center px-2 py-1 rounded-lg ${
          isActive ? 'text-primary' : 'text-gray-500'
        } ${addClass}`
      }
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </NavLink>
  );
};

export default Navigation;
