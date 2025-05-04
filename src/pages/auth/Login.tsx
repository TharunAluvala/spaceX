import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Anchor,
  Stack,
  Center,
  Group,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Rocket } from 'lucide-react';
import { useAuthStore } from '../../store/auth.store';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    try {
      const success = await login(values.email, values.password);

      if (success) {
        notifications.show({
          title: 'Success',
          message: 'You have been logged in successfully',
          color: 'green',
        });
        navigate('/');
      } else {
        notifications.show({
          title: 'Error',
          message: 'Invalid email or password',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An error occurred during login',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  // For demonstration purposes, show the test credentials
  const fillTestCredentials = () => {
    form.setValues({
      email: 'user@example.com',
      password: 'password123',
    });
  };

  return (
    <Container size={420} my={40}>
      <Center mb="lg">
        <Group>
          <Rocket size={32} color="#0B3D91" />
          <Title order={2} c="blue.7">
            SpaceX Explorer
          </Title>
        </Group>
      </Center>

      <Paper radius="md" p="xl" withBorder>
        <Title order={2} ta="center" mt="md" mb={20}>
          Welcome back!
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="Your email"
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps('password')}
            />
          </Stack>

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Sign in
          </Button>
        </form>

        <Text ta="center" mt="md">
          Don't have an account?{' '}
          <Anchor component={Link} to="/register">
            Register
          </Anchor>
        </Text>

        <Text size="xs" ta="center" mt="xl" c="dimmed">
          For demo purposes:{' '}
          <Anchor onClick={fillTestCredentials} size="xs">
            Use test credentials
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}