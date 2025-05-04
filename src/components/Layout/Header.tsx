import { Group, Text, Button } from '@mantine/core';
import { Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Group justify="space-between" style={{ width: '100%' }}>
      <Group>
        <Rocket size={24} />
        <Text size="lg" fw={700} c="blue.7">
          SpaceX Explorer
        </Text>
      </Group>

      <Group>
        {user && <Text size="sm">Welcome, {user.name}</Text>}
        <Button variant="subtle" onClick={handleLogout}>
          Logout
        </Button>
      </Group>
    </Group>
  );
}