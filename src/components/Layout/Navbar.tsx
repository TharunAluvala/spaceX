import { useLocation, useNavigate } from 'react-router-dom';
import { Box, NavLink, Text } from '@mantine/core';
import { Rocket, Calendar, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const mainLinks = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Rocket size={20} />, label: 'Rockets', path: '/rockets' },
    { icon: <Calendar size={20} />, label: 'Launches', path: '/launches' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Box>
      <Box py="xs">
        <Text fw={700} size="sm" c="dimmed" mb="xs">
          MAIN
        </Text>
        {mainLinks.map((link) => (
          <NavLink
            key={link.path}
            active={isActive(link.path)}
            label={link.label}
            leftSection={link.icon}
            onClick={() => navigate(link.path)}
          />
        ))}
      </Box>
    </Box>
  );
}