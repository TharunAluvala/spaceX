import { Center, Title, Text, Button, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Center style={{ height: '100vh' }}>
      <Stack align="center" gap="md">
        <Title>404</Title>
        <Text size="xl">Page not found</Text>
        <Text c="dimmed" size="sm" ta="center">
          The page you are looking for doesn't exist or has been moved.
        </Text>
        <Button onClick={() => navigate('/')}>Go to Home</Button>
      </Stack>
    </Center>
  );
}