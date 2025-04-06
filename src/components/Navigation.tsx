
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, Grid, FolderPlus, PlusCircle, User } from 'lucide-react';
import { useAuth } from '@/context/auth';
import LogoutButton from './auth/LogoutButton';
import { useIsMobile } from '@/hooks/use-mobile';

const Navigation: React.FC = () => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 shadow-lg z-40 px-2 pt-2 pb-5">
      <div className="flex justify-around">
        <NavItem to="/collection" icon={<Grid className="nav-icon" />} label="Collection" />
        <NavItem to="/map" icon={<Map className="nav-icon" />} label="Map" />
        <NavItem 
          to="/add" 
          icon={<PlusCircle className="nav-icon" />} 
          label="Add" 
          addClass="text-primary relative"
          centerButton={isMobile}
        />
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
            <span className="text-xs font-medium text-gray-500">Log Out</span>
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
  centerButton?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon, 
  label, 
  addClass = "", 
  centerButton = false 
}) => {
  if (centerButton && to === '/add') {
    return (
      <NavLink 
        to={to} 
        className={({ isActive }) => 
          `flex flex-col items-center justify-center px-2 py-1 relative ${
            isActive ? 'text-primary' : 'text-gray-500'
          } ${addClass}`
        }
      >
        <div className="absolute -top-6 bg-primary rounded-full p-3 shadow-lg">
          {icon}
        </div>
        <div className="mt-7">
          <span className="text-xs font-medium">{label}</span>
        </div>
      </NavLink>
    );
  }
  
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
