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

export default function Register() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoading(true);

    try {
      const success = await register(values.name, values.email, values.password);

      if (success) {
        notifications.show({
          title: 'Success',
          message: 'Account created successfully',
          color: 'green',
        });
        navigate('/');
      } else {
        notifications.show({
          title: 'Error',
          message: 'Email already exists',
          color: 'red',
        });
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'An error occurred during registration',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
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
          Create an account
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Your name"
              required
              {...form.getInputProps('name')}
            />

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

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              required
              {...form.getInputProps('confirmPassword')}
            />
          </Stack>

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Register
          </Button>
        </form>

        <Text ta="center" mt="md">
          Already have an account?{' '}
          <Anchor component={Link} to="/login">
            Login
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}