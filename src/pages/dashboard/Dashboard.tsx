import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, Grid, Card, Text, Group, Button, Image, Center, Stack } from '@mantine/core';
import { Rocket, Calendar } from 'lucide-react';
import { rocketsService } from '../../services/rockets.service';
import { launchesService } from '../../services/launches.service';
import { Rocket as RocketType } from '../../types/rocket';
import { Launch } from '../../types/launch';
import Loading from '../../components/common/Loading';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rockets, setRockets] = useState<RocketType[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [rocketsData, launchesData] = await Promise.all([
          rocketsService.getAllRockets(),
          launchesService.getAllLaunches(),
        ]);

        setRockets(rocketsData);
        // Sort launches by date (newest first) and take only the upcoming ones
        const upcomingLaunches = launchesData
          .filter(launch => launch.upcoming)
          .sort((a, b) => new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime())
          .slice(0, 3);
        setLaunches(upcomingLaunches);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">
        Dashboard
      </Title>

      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder shadow="sm" radius="md" p="md">
            <Group mb="md">
              <Rocket size={24} color="#0B3D91" />
              <Title order={3}>SpaceX Rockets</Title>
            </Group>
            
            <Text mb="lg">
              Explore the SpaceX rocket fleet, including the Falcon 9, Falcon Heavy, and the
              revolutionary Starship.
            </Text>
            
            {rockets.length > 0 ? (
              <Grid>
                {rockets.slice(0, 2).map((rocket) => (
                  <Grid.Col span={12} key={rocket.id}>
                    <Card withBorder shadow="sm" radius="md" p="sm" mb="sm">
                      <Group>
                        {rocket.flickr_images && rocket.flickr_images.length > 0 && (
                          <Image
                            src={rocket.flickr_images[0]}
                            radius="md"
                            h={80}
                            w={80}
                            fit="cover"
                          />
                        )}
                        <div>
                          <Text fw={700}>{rocket.name}</Text>
                          <Text size="sm" c="dimmed" lineClamp={2}>
                            {rocket.description}
                          </Text>
                        </div>
                      </Group>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <Center p="xl">
                <Text c="dimmed">No rockets found</Text>
              </Center>
            )}

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="md"
              onClick={() => navigate('/rockets')}
            >
              View all rockets
            </Button>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder shadow="sm" radius="md" p="md">
            <Group mb="md">
              <Calendar size={24} color="#0B3D91" />
              <Title order={3}>Upcoming Launches</Title>
            </Group>
            
            <Text mb="lg">
              Stay informed about upcoming SpaceX missions, launch schedules, and mission details.
            </Text>
            
            {launches.length > 0 ? (
              <Stack>
                {launches.map((launch) => (
                  <Card key={launch.id} withBorder shadow="sm" radius="md" p="sm">
                    <Group justify="space-between">
                      <div>
                        <Text fw={700}>{launch.name}</Text>
                        <Text size="sm">
                          {new Date(launch.date_utc).toLocaleDateString()} • Mission{' '}
                          {launch.flight_number}
                        </Text>
                      </div>
                      <Button
                        variant="subtle"
                        onClick={() => navigate(`/launches/${launch.id}`)}
                      >
                        Details
                      </Button>
                    </Group>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Center p="xl">
                <Text c="dimmed">No upcoming launches found</Text>
              </Center>
            )}

            <Button
              variant="light"
              color="blue"
              fullWidth
              mt="md"
              onClick={() => navigate('/launches')}
            >
              View all launches
            </Button>
          </Card>
        </Grid.Col>
      </Grid>
    </Container>
  );
}