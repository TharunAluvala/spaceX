import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Badge,
  Group,
  Button,
  TextInput,
  Select,
  Pagination,
  Image,
  Stack,
  Chip,
  Center
} from '@mantine/core';
import { Search, Filter, Calendar } from 'lucide-react';
import { launchesService } from '../../services/launches.service';
import { Launch } from '../../types/launch';
import Loading from '../../components/common/Loading';

export default function LaunchesList() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialRocketId = location.state?.rocketId || null;

  const [loading, setLoading] = useState(true);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [filteredLaunches, setFilteredLaunches] = useState<Launch[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>('all');
  const [timeFilter, setTimeFilter] = useState<string | null>(initialRocketId ? 'all' : 'upcoming');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchLaunches = async () => {
      setLoading(true);
      try {
        const data = await launchesService.getAllLaunches();
        setLaunches(data);
        
        // If rocketId is provided, filter launches for that rocket
        if (initialRocketId) {
          setLaunches(data.filter(launch => launch.rocket === initialRocketId));
        } else {
          setLaunches(data);
        }
      } catch (error) {
        console.error('Error fetching launches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunches();
  }, [initialRocketId]);

  useEffect(() => {
    // Apply filters
    let result = launches;

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (launch) =>
          launch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (launch.details && launch.details.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      if (statusFilter === 'success') {
        result = result.filter((launch) => launch.success === true);
      } else if (statusFilter === 'failed') {
        result = result.filter((launch) => launch.success === false);
      } else if (statusFilter === 'unknown') {
        result = result.filter((launch) => launch.success === null);
      }
    }

    // Time filter
    if (timeFilter && timeFilter !== 'all') {
      const now = new Date();
      if (timeFilter === 'upcoming') {
        result = result.filter((launch) => launch.upcoming);
      } else if (timeFilter === 'past') {
        result = result.filter((launch) => !launch.upcoming);
      } else if (timeFilter === 'recent') {
        // Past 3 months
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        result = result.filter(
          (launch) => 
            new Date(launch.date_utc) >= threeMonthsAgo && 
            new Date(launch.date_utc) <= now
        );
      }
    }

    // Sort by date (newest first)
    result = result.sort((a, b) => new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime());

    setFilteredLaunches(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, statusFilter, timeFilter, launches]);

  // Pagination
  const totalPages = Math.ceil(filteredLaunches.length / itemsPerPage);
  const displayedLaunches = filteredLaunches.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Loading />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getLaunchStatusColor = (launch: Launch) => {
    if (launch.upcoming) return 'blue';
    if (launch.success === true) return 'green';
    if (launch.success === false) return 'red';
    return 'gray';
  };

  const getLaunchStatusText = (launch: Launch) => {
    if (launch.upcoming) return 'Upcoming';
    if (launch.success === true) return 'Success';
    if (launch.success === false) return 'Failed';
    return 'Unknown';
  };

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Group>
          <Calendar size={24} />
          <Title order={2}>SpaceX Launches</Title>
        </Group>
      </Group>

      {/* Filters */}
      <Card withBorder mb="xl">
        <Group>
          <TextInput
            placeholder="Search launches..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.currentTarget.value)}
            style={{ flex: 1 }}
            leftSection={<Search size={16} />}
          />

          <Select
            placeholder="Filter by status"
            value={statusFilter}
            onChange={setStatusFilter}
            leftSection={<Filter size={16} />}
            data={[
              { value: 'all', label: 'All Status' },
              { value: 'success', label: 'Success' },
              { value: 'failed', label: 'Failed' },
              { value: 'unknown', label: 'Unknown' },
            ]}
            style={{ width: 150 }}
          />

          <Select
            placeholder="Filter by time"
            value={timeFilter}
            onChange={setTimeFilter}
            data={[
              { value: 'all', label: 'All Time' },
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'past', label: 'Past' },
              { value: 'recent', label: 'Recent (3m)' },
            ]}
            style={{ width: 150 }}
          />
        </Group>

        {initialRocketId && (
          <Group mt="md">
            <Chip checked>Filtered by rocket</Chip>
            <Button 
              variant="subtle" 
              // compact 
              onClick={() => navigate('/launches')}
            >
              Clear rocket filter
            </Button>
          </Group>
        )}
      </Card>

      {/* Launches Grid */}
      <Grid>
        {displayedLaunches.length > 0 ? (
          displayedLaunches.map((launch) => (
            <Grid.Col key={launch.id} span={{ base: 12, sm: 6, lg: 3 }}>
              <Card withBorder shadow="sm" radius="md" p="md" h="100%">
                <Card.Section p="md">
                  {launch.links?.patch?.small ? (
                    <Center>
                      <Image
                        src={launch.links.patch.small}
                        height={100}
                        width={100}
                        fit="contain"
                        alt={launch.name}
                      />
                    </Center>
                  ) : (
                    <Center h={100}>
                      <Calendar size={48} opacity={0.5} />
                    </Center>
                  )}
                </Card.Section>

                <Stack gap="xs">
                  <Group justify="space-between" mt="md">
                    <Text fw={700} lineClamp={1}>{launch.name}</Text>
                    <Badge color={getLaunchStatusColor(launch)}>
                      {getLaunchStatusText(launch)}
                    </Badge>
                  </Group>

                  <Text size="sm" c="dimmed">
                    {formatDate(launch.date_utc)}
                  </Text>

                  <Text size="sm" c="dimmed" lineClamp={2} mb="xs">
                    {launch.details || 'No details available for this mission.'}
                  </Text>

                  <Button
                    variant="light"
                    color="blue"
                    fullWidth
                    mt="auto"
                    onClick={() => navigate(`/launches/${launch.id}`)}
                  >
                    View Details
                  </Button>
                </Stack>
              </Card>
            </Grid.Col>
          ))
        ) : (
          <Grid.Col span={12}>
            <Card withBorder shadow="sm" p="xl" ta="center">
              <Text>No launches found matching your filters.</Text>
            </Card>
          </Grid.Col>
        )}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setCurrentPage}
          />
        </Group>
      )}
    </Container>
  );
}