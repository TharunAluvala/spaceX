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
  Accordion,
  List,
  Tabs,
  Timeline,
  Anchor,
  Stack,
  Center,
} from '@mantine/core';
import { ArrowLeft, Rocket as RocketIcon, Calendar, ExternalLink, Info } from 'lucide-react';
import { rocketsService } from '../../services/rockets.service';
import { launchesService } from '../../services/launches.service';
import { Rocket } from '../../types/rocket';
import { Launch } from '../../types/launch';
import Loading from '../../components/common/Loading';

export default function RocketDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rocket, setRocket] = useState<Rocket | null>(null);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [launchesLoading, setLaunchesLoading] = useState(false);

  useEffect(() => {
    const fetchRocketData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const data = await rocketsService.getRocket(id);
        setRocket(data);
        
        // Fetch related launches after getting rocket data (data enrichment)
        setLaunchesLoading(true);
        const launchesData = await launchesService.getLaunchesByRocket(id);
        setLaunches(launchesData);
        setLaunchesLoading(false);
      } catch (error) {
        console.error('Error fetching rocket details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRocketData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!rocket) {
    return (
      <Container size="lg" py="xl">
        <Center>
          <Stack align="center">
            <Text>Rocket not found</Text>
            <Button onClick={() => navigate('/rockets')}>Back to Rockets</Button>
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
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <Container size="lg" py="xl">
      <Button
        variant="subtle"
        leftSection={<ArrowLeft size={16} />}
        onClick={() => navigate('/rockets')}
        mb="md"
      >
        Back to Rockets
      </Button>

      <Card withBorder p={0} radius="md">
        <Grid gutter={0}>
          <Grid.Col span={{ base: 12, md: 5 }}>
            {rocket.flickr_images && rocket.flickr_images.length > 0 && (
              <Image
                src={rocket.flickr_images[0]}
                height={400}
                fit="cover"
                alt={rocket.name}
              />
            )}
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Stack p="lg">
              <Group justify="space-between">
                <Title order={2}>{rocket.name}</Title>
                <Badge size="lg" color={rocket.active ? 'green' : 'gray'}>
                  {rocket.active ? 'Active' : 'Inactive'}
                </Badge>
              </Group>

              <Text c="dimmed">{rocket.description}</Text>

              <Grid>
                <Grid.Col span={6}>
                  <Text fw={500}>First Flight</Text>
                  <Text>{formatDate(rocket.first_flight)}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={500}>Success Rate</Text>
                  <Text>{rocket.success_rate_pct}%</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={500}>Company</Text>
                  <Text>{rocket.company}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={500}>Country</Text>
                  <Text>{rocket.country}</Text>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Text fw={500}>Cost Per Launch</Text>
                  <Text>${formatNumber(rocket.cost_per_launch)}</Text>
                </Grid.Col>
              </Grid>

              {rocket.wikipedia && (
                <Anchor href={rocket.wikipedia} target="_blank" rel="noopener noreferrer">
                  <Group>
                    <ExternalLink size={16} />
                    <Text>Wikipedia Page</Text>
                  </Group>
                </Anchor>
              )}
            </Stack>
          </Grid.Col>
        </Grid>
      </Card>

      <Tabs defaultValue="specs" mt="xl">
        <Tabs.List>
          <Tabs.Tab value="specs" leftSection={<Info size={16} />}>
            Specifications
          </Tabs.Tab>
          <Tabs.Tab value="launches" leftSection={<Calendar size={16} />}>
            Launches
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="specs" pt="md">
          <Accordion>
            <Accordion.Item value="dimensions">
              <Accordion.Control>Dimensions</Accordion.Control>
              <Accordion.Panel>
                <Grid>
                  <Grid.Col span={6}>
                    <Text fw={500}>Height</Text>
                    <Text>{rocket.height.meters} m / {rocket.height.feet} ft</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fw={500}>Diameter</Text>
                    <Text>{rocket.diameter.meters} m / {rocket.diameter.feet} ft</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fw={500}>Mass</Text>
                    <Text>{formatNumber(rocket.mass.kg)} kg / {formatNumber(rocket.mass.lb)} lb</Text>
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="engines">
              <Accordion.Control>Engines</Accordion.Control>
              <Accordion.Panel>
                <Grid>
                  <Grid.Col span={6}>
                    <Text fw={500}>Number of Engines</Text>
                    <Text>{rocket.engines.number}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fw={500}>Type</Text>
                    <Text>{rocket.engines.type}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fw={500}>Version</Text>
                    <Text>{rocket.engines.version}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fw={500}>Layout</Text>
                    <Text>{rocket.engines.layout || 'N/A'}</Text>
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Text fw={500}>Propellant</Text>
                    <Text>{rocket.engines.propellant_1} / {rocket.engines.propellant_2}</Text>
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="stages">
              <Accordion.Control>Stages</Accordion.Control>
              <Accordion.Panel>
                <Text fw={700} mb="sm">First Stage</Text>
                <Grid mb="md">
                  <Grid.Col span={6}>
                    <Text fw={500}>Reusable</Text>
                    <Text>{rocket.first_stage.reusable ? 'Yes' : 'No'}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fw={500}>Engines</Text>
                    <Text>{rocket.first_stage.engines}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fw={500}>Fuel Amount</Text>
                    <Text>{rocket.first_stage.fuel_amount_tons} tons</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fw={500}>Burn Time</Text>
                    <Text>{rocket.first_stage.burn_time_sec || 'N/A'} sec</Text>
                  </Grid.Col>
                </Grid>

                <Divider my="md" />

                <Text fw={700} mb="sm">Second Stage</Text>
                <Grid>
                  <Grid.Col span={6}>
                    <Text fw={500}>Reusable</Text>
                    <Text>{rocket.second_stage.reusable ? 'Yes' : 'No'}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fw={500}>Engines</Text>
                    <Text>{rocket.second_stage.engines}</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fw={500}>Fuel Amount</Text>
                    <Text>{rocket.second_stage.fuel_amount_tons} tons</Text>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Text fw={500}>Burn Time</Text>
                    <Text>{rocket.second_stage.burn_time_sec || 'N/A'} sec</Text>
                  </Grid.Col>
                </Grid>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="payload">
              <Accordion.Control>Payload Capacity</Accordion.Control>
              <Accordion.Panel>
                <List spacing="xs">
                  {rocket.payload_weights.map((payload) => (
                    <List.Item key={payload.id}>
                      <Text>
                        <Text span fw={500}>{payload.name}:</Text> {formatNumber(payload.kg)} kg / {formatNumber(payload.lb)} lb
                      </Text>
                    </List.Item>
                  ))}
                </List>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Tabs.Panel>

        <Tabs.Panel value="launches" pt="md">
          {launchesLoading ? (
            <Loading message="Loading launches..." />
          ) : launches.length > 0 ? (
            <Timeline active={-1}>
              {launches.slice(0, 10).map((launch) => (
                <Timeline.Item
                  key={launch.id}
                  title={launch.name}
                  bullet={<RocketIcon size={16} />}
                >
                  <Text size="sm">Launch Date: {formatDate(launch.date_utc)}</Text>
                  <Text size="sm" c="dimmed" lineClamp={2}>
                    {launch.details || 'No details available'}
                  </Text>
                  <Button 
                    variant="subtle" 
                    size="xs" 
                    mt="xs"
                    onClick={() => navigate(`/launches/${launch.id}`)}
                  >
                    View Details
                  </Button>
                </Timeline.Item>
              ))}
            </Timeline>
          ) : (
            <Text ta="center" p="xl" c="dimmed">
              No launches found for this rocket.
            </Text>
          )}

          {launches.length > 10 && (
            <Center mt="md">
              <Button variant="light" onClick={() => navigate('/launches', { state: { rocketId: id } })}>
                View All Launches
              </Button>
            </Center>
          )}
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}