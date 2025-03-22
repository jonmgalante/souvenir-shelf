
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, Grid, FolderPlus, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LogoutButton from './auth/LogoutButton';

const Navigation: React.FC = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="flex justify-around py-2">
        <NavItem to="/collection" icon={<Grid className="nav-icon" />} label="Collection" />
        <NavItem to="/map" icon={<Map className="nav-icon" />} label="Map" />
        <NavItem to="/add" icon={<PlusCircle className="nav-icon" />} label="Add" addClass="text-primary" />
        <NavItem to="/trips" icon={<FolderPlus className="nav-icon" />} label="Trips" />
        
        {user ? (
          <div className="flex flex-col items-center justify-center">
            <LogoutButton 
              variant="ghost" 
              size="icon" 
              showIcon={true} 
              label="" 
              className="h-auto p-1"
            />
            <span className="text-xs font-medium text-gray-500">Logout</span>
          </div>
        ) : (
          <NavItem to="/profile" icon={<User className="nav-icon" />} label="Profile" />
        )}
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
