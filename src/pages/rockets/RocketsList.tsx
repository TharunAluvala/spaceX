import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Badge,
  Group,
  Button,
  Image,
  TextInput,
  Select,
  Pagination,
} from '@mantine/core';
import { Search, Filter, Rocket as RocketIcon } from 'lucide-react';
import { rocketsService } from '../../services/rockets.service';
import { Rocket } from '../../types/rocket';
import Loading from '../../components/common/Loading';

export default function RocketsList() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [filteredRockets, setFilteredRockets] = useState<Rocket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchRockets = async () => {
      setLoading(true);
      try {
        const data = await rocketsService.getAllRockets();
        setRockets(data);
        setFilteredRockets(data);
      } catch (error) {
        console.error('Error fetching rockets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRockets();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = rockets;

    // Search filter
    if (searchQuery) {
      result = result.filter(
        (rocket) =>
          rocket.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rocket.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter && statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      result = result.filter((rocket) => rocket.active === isActive);
    }

    setFilteredRockets(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, statusFilter, rockets]);

  // Pagination
  const totalPages = Math.ceil(filteredRockets.length / itemsPerPage);
  const displayedRockets = filteredRockets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Container size="lg" py="xl">
      <Group justify="space-between" mb="lg">
        <Group>
          <RocketIcon size={24} />
          <Title order={2}>SpaceX Rockets</Title>
        </Group>
      </Group>

      {/* Filters */}
      <Card withBorder mb="xl">
        <Group>
          <TextInput
            placeholder="Search rockets..."
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
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            style={{ width: 200 }}
          />
        </Group>
      </Card>

      {/* Rockets Grid */}
      <Grid>
        {displayedRockets.length > 0 ? (
          displayedRockets.map((rocket) => (
            <Grid.Col key={rocket.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Card withBorder shadow="sm" radius="md" p="md" h="100%">
                <Card.Section>
                  {rocket.flickr_images && rocket.flickr_images.length > 0 && (
                    <Image
                      src={rocket.flickr_images[0]}
                      height={200}
                      fit="cover"
                      alt={rocket.name}
                    />
                  )}
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={700}>{rocket.name}</Text>
                  <Badge color={rocket.active ? 'green' : 'gray'}>
                    {rocket.active ? 'Active' : 'Inactive'}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed" lineClamp={3} mb="md">
                  {rocket.description}
                </Text>

                <Text size="sm">
                  <strong>First Flight:</strong> {rocket.first_flight}
                </Text>
                <Text size="sm">
                  <strong>Success Rate:</strong> {rocket.success_rate_pct}%
                </Text>

                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="auto"
                  onClick={() => navigate(`/rockets/${rocket.id}`)}
                >
                  View Details
                </Button>
              </Card>
            </Grid.Col>
          ))
        ) : (
          <Grid.Col span={12}>
            <Card withBorder shadow="sm" p="xl" ta="center">
              <Text>No rockets found matching your filters.</Text>
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