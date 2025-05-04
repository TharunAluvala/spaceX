import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Grid,
  Card,
  Image,
  Button,
  Divider,
  Anchor,
  Stack,
  Center,
  List,
  ThemeIcon,
} from '@mantine/core';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  Rocket as RocketIcon,
  Youtube,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { launchesService } from '../../services/launches.service';
import { rocketsService } from '../../services/rockets.service';
import { Launch } from '../../types/launch';
import { Rocket } from '../../types/rocket';
import Loading from '../../components/common/Loading';

export default function LaunchDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [launch, setLaunch] = useState<Launch | null>(null);
  const [rocket, setRocket] = useState<Rocket | null>(null);
  const [rocketLoading, setRocketLoading] = useState(false);

  useEffect(() => {
    const fetchLaunchData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await launchesService.getLaunch(id);
        setLaunch(data);
        
        // Fetch rocket data as enrichment
        if (data.rocket) {
          setRocketLoading(true);
          try {
            const rocketData = await rocketsService.getRocket(data.rocket);
            setRocket(rocketData);
          } catch (error) {
            console.error('Error fetching rocket data:', error);
          } finally {
            setRocketLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching launch details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!launch) {
    return (
      <Container size="lg" py="xl">
        <Center>
          <Stack align="center">
            <Text>Launch not found</Text>
            <Button onClick={() => navigate('/launches')}>Back to Launches</Button>
          </Stack>
        </Center>
      </Container>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getLaunchStatusColor = () => {
    if (launch.upcoming) return 'blue';
    if (launch.success === true) return 'green';
    if (launch.success === false) return 'red';
    return 'gray';
  };

  const getLaunchStatusText = () => {
    if (launch.upcoming) return 'Upcoming';
    if (launch.success === true) return 'Success';
    if (launch.success === false) return 'Failed';
    return 'Unknown';
  };

  const getStatusIcon = () => {
    if (launch.upcoming) return <Clock size={18} />;
    if (launch.success === true) return <CheckCircle size={18} />;
    if (launch.success === false) return <XCircle size={18} />;
    return <HelpCircle size={18} />;
  };

  return (
    <Container size="lg" py="xl">
      <Button
        variant="subtle"
        leftSection={<ArrowLeft size={16} />}
        onClick={() => navigate('/launches')}
        mb="md"
      >
        Back to Launches
      </Button>

      <Card withBorder p="xl" radius="md">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Center>
              {launch.links?.patch?.large ? (
                <Image
                  src={launch.links.patch.large}
                  height={200}
                  width={200}
                  fit="contain"
                  alt={launch.name}
                />
              ) : (
                <Center h={200} w={200}>
                  <Calendar size={80} opacity={0.5} />
                </Center>
              )}
            </Center>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Stack>
              <Group justify="space-between" wrap="nowrap">
                <Title order={2}>{launch.name}</Title>
                <Badge size="lg" color={getLaunchStatusColor()}>
                  {getLaunchStatusText()}
                </Badge>
              </Group>

              <Group>
                <Text size="sm">
                  <Text span fw={500}>Flight Number:</Text> {launch.flight_number}
                </Text>
                <Text size="sm">
                  <Text span fw={500}>Date:</Text> {formatDate(launch.date_utc)}
                </Text>
              </Group>

              <Text>{launch.details || 'No details available for this mission.'}</Text>

              {launch.links?.wikipedia && (
                <Anchor href={launch.links.wikipedia} target="_blank" rel="noopener noreferrer">
                  <Group>
                    <ExternalLink size={16} />
                    <Text>Wikipedia Page</Text>
                  </Group>
                </Anchor>
              )}

              {launch.links?.webcast && (
                <Anchor href={launch.links.webcast} target="_blank" rel="noopener noreferrer">
                  <Group>
                    <Youtube size={16} />
                    <Text>Watch Webcast</Text>
                  </Group>
                </Anchor>
              )}
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="lg" />

        <Grid>
          <Grid.Col span={12}>
            <Title order={3} mb="md">Mission Details</Title>
            
            <List spacing="sm" size="sm" center icon={
              <ThemeIcon color={getLaunchStatusColor()} radius="xl">
                {getStatusIcon()}
              </ThemeIcon>
            }>
              <List.Item>
                <Text>
                  <Text span fw={500}>Launch Date:</Text> {formatDate(launch.date_utc)}
                </Text>
              </List.Item>
              <List.Item>
                <Text>
                  <Text span fw={500}>Launch Status:</Text> {getLaunchStatusText()}
                </Text>
              </List.Item>
              {launch.static_fire_date_utc && (
                <List.Item>
                  <Text>
                    <Text span fw={500}>Static Fire Test Date:</Text> {formatDate(launch.static_fire_date_utc)}
                  </Text>
                </List.Item>
              )}
              <List.Item>
                <Text>
                  <Text span fw={500}>Launch Window:</Text> {launch.window ? `${launch.window} seconds` : 'Instantaneous'}
                </Text>
              </List.Item>
              {launch.failures && launch.failures.length > 0 && (
                <List.Item>
                  <Text fw={500}>Failure Details:</Text>
                  {launch.failures.map((failure, index) => (
                    <Text key={index} ml="md">
                      {failure.reason}
                      {failure.time ? ` at T+${failure.time}s` : ''}
                      {failure.altitude ? ` at altitude ${failure.altitude}m` : ''}
                    </Text>
                  ))}
                </List.Item>
              )}
            </List>
          </Grid.Col>
        </Grid>

        {/* Rocket information (data enrichment) */}
        <Divider my="lg" label="Rocket Information" labelPosition="center" />

        {rocketLoading ? (
          <Center p="md">
            <Loader size="sm" />
            <Text ml="xs">Loading rocket data...</Text>
          </Center>
        ) : rocket ? (
          <Grid>
            <Grid.Col span={{ base: 12, md: 5 }}>
              {rocket.flickr_images && rocket.flickr_images.length > 0 && (
                <Image
                  src={rocket.flickr_images[0]}
                  height={200}
                  radius="md"
                  fit="cover"
                  alt={rocket.name}
                />
              )}
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Group mb="xs">
                <RocketIcon size={20} />
                <Text fw={700}>{rocket.name}</Text>
                <Badge color={rocket.active ? 'green' : 'gray'}>
                  {rocket.active ? 'Active' : 'Inactive'}
                </Badge>
              </Group>

              <Text size="sm" mb="md">{rocket.description}</Text>

              <Grid>
                <Grid.Col span={6}>
                  <Text size="sm">
                    <Text span fw={500}>First Flight:</Text> {new Date(rocket.first_flight).toLocaleDateString()}
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm">
                    <Text span fw={500}>Success Rate:</Text> {rocket.success_rate_pct}%
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm">
                    <Text span fw={500}>Height:</Text> {rocket.height.meters}m
                  </Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text size="sm">
                    <Text span fw={500}>Stages:</Text> {rocket.stages}
                  </Text>
                </Grid.Col>
              </Grid>

              <Button
                variant="light"
                color="blue"
                mt="md"
                onClick={() => navigate(`/rockets/${rocket.id}`)}
              >
                View Rocket Details
              </Button>
            </Grid.Col>
          </Grid>
        ) : (
          <Text ta="center" p="md" c="dimmed">
            No rocket data available.
          </Text>
        )}

        {/* Media section */}
        {launch.links?.flickr?.original && launch.links.flickr.original.length > 0 && (
          <>
            <Divider my="lg" label="Mission Images" labelPosition="center" />
            <Grid>
              {launch.links.flickr.original.slice(0, 4).map((image, index) => (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                  <Image
                    src={image}
                    height={150}
                    radius="md"
                    fit="cover"
                    alt={`Launch image ${index + 1}`}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </>
        )}
      </Card>
    </Container>
  );
}