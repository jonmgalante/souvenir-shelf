import React from 'react';
import { NavLink } from 'react-router-dom';
import { Map, Grid, FolderPlus, PlusCircle, User } from 'lucide-react';
import { useAuth } from '@/context/auth';
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
        />
        <NavItem to="/trips" icon={<FolderPlus className="nav-icon" />} label="Trips" />

        {/* Always show Account/Profile tab so user can access deletion + sign out */}
        <NavItem
          to="/profile"
          icon={<User className="nav-icon" />}
          label={user ? "Account" : "Profile"}
        />
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