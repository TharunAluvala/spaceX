import { Center, Loader, Text, Stack } from '@mantine/core';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <Center style={{ height: '100vh' }}>
      <Stack align="center" gap="xs">
        <Loader color="blue" size="lg" />
        <Text size="sm" c="dimmed">
          {message}
        </Text>
      </Stack>
    </Center>
  );
}