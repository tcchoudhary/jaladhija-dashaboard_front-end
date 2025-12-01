import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  Spinner,
  Text,
  Divider,
  useColorModeValue,
  HStack,
  SimpleGrid,
  Card,
  Flex,
  Icon,
  Progress,
  useToast,
} from '@chakra-ui/react';
import {
  FiMapPin,
  FiGlobe,
  FiTarget,
  FiHome,
  FiArrowLeft,
  FiInfo,
} from 'react-icons/fi'; // Added FiInfo icon
import axios from 'axios';
import { BaseUrl } from 'utils/configurable';
import CabinHealthDetailsTable from './CabinHealthDetailsTable';
// --- Reusable SelectionCard Component ---
const SelectionCard = ({ icon, title, description, onClick, isSelected }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHoverBg = useColorModeValue('green.50', 'green.700');
  const cardSelectedBorderColor = useColorModeValue('green.400', 'green.300');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Card
      p={4}
      textAlign="center"
      onClick={onClick}
      cursor="pointer"
      borderWidth="1px"
      borderColor={isSelected ? cardSelectedBorderColor : cardBorderColor}
      _hover={{
        bg: cardHoverBg,
        shadow: 'md',
        transform: 'translateY(-2px)',
      }}
      transition="all 0.2s ease-in-out"
      bg={cardBg}
      shadow="sm"
      minH="120px"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <VStack spacing={2}>
        <Icon as={icon} boxSize={8} color="green.500" />
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
        {description && (
          <Text fontSize="sm" color="gray.500">
            {description}
          </Text>
        )}
      </VStack>
    </Card>
  );
};

export default function ComplexAccessTree() {
  const [step, setStep] = useState(1);
  const [facilities, setFacilities] = useState([]);
  const [selectedComplex, setSelectedComplex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [Data, setData] = useState(null);
  const toast = useToast();

  const mainBoxBg = useColorModeValue('white', 'gray.800');
  const sectionBg = useColorModeValue('gray.50', 'gray.700');
  const itemHoverBg = useColorModeValue('green.100', 'green.700');
  const headingColor = useColorModeValue('gray.700', 'gray.100');
  const siteNameColor = useColorModeValue('teal.700', 'teal.300');
  const cabinTitleColor = useColorModeValue('blue.700', 'blue.300');
  const cabinBorderColor = useColorModeValue('gray.200', 'gray.600');
  const cabinBg = useColorModeValue('white', 'gray.700');

  const states = [
    { id: 'mp', name: 'Madhya Pradesh', description: 'The Heart of India' },
  ];
  const cities = [
    { id: 'gwalior', name: 'Gwalior', description: 'Historical City' },
  ];

  const handleFetchFacilities = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setFacilities([]);
    try {
      const response = await axios.get(`${BaseUrl}/complex-list`, {
        headers: {
          Authorization: token,
        },
      }
      );
      const data = response.data; // Axios automatically parses JSON
      if (response.status == 200) {
        setFacilities(data?.data || []);
        setStep(3);
        toast({
          title: 'Sites loaded.',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      } else {
        toast({
          title: 'Failed to load sites.',
          description: data?.message || 'Please try again.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (err) {
      console.error('Error fetching facilities:', err);
      toast({
        title: 'Network error.',
        description:
          'Could not connect to the server or an unknown error occurred.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleShowData = async (item) => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setSelectedComplex(null);
    try {
      const response = await axios.post(
        `${BaseUrl}/complexwise-cabin-list`,
        { id: item?.id },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = response.data; // Axios automatically parses JSON

      if (response.status == 200 && result?.data) {
        // Ensure that result.data is an array and pick the first item, or handle multiple
        setSelectedComplex(result.data.length > 0 ? result.data[0] : null);
        setStep(4);
        toast({
          title: 'Complex details loaded.',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        });
      } else {
        setSelectedComplex(null);
        toast({
          title: 'No cabin data found for this complex.',
          status: 'info',
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error fetching complex details.',
        description: 'Please try again or check network.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };


  const handleViewCabinDetails = async (cabinId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${BaseUrl}/cabinwise-health-status`,
        {
          cabin_id: cabinId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        },
      );

      console.log(response?.data?.alldata, 'response')
      if (response?.data?.alldata) {
        setData(response?.data?.alldata);
        setStep(5);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error('Network error fetching cabin details:', error);
    }
  };

  const goBack = () => {
    if (step === 5) {
      setStep(4); // Go back to step 4
    } else if (step === 4) {
      setSelectedComplex(null);
      setStep(3);
    } else if (step === 3) {
      setFacilities([]);
      setStep(2);
    } else if (step === 2) {
      setSelectedCity(null);
      setStep(1);
    }
  };

  const getProgressValue = () => {
    if (step === 1) return 25;
    if (step === 2) return 50;
    if (step === 3) return 75;
    if (step === 4) return 100;
    if (step === 5) return 100;
    return 0;
  };

  return (
    <Box
      mt="80px"
      p="6"
      // maxW="900px"
      // mx="auto"
      borderWidth="1px"
      borderRadius="lg"
      shadow="xl"
      bg={mainBoxBg}
    >
      <Flex justifyContent="space-between" alignItems="center" mb="6">
        {step !== 1 && (
          <Button
            leftIcon={<FiArrowLeft />}
            onClick={goBack}
            colorScheme="gray"
            variant="outline"
            size="sm"
          >
            Back
          </Button>
        )}
        <Box flex="1" ml={step !== 1 ? 4 : 0}>
          <Progress
            value={getProgressValue()}
            size="sm"
            colorScheme="green"
            borderRadius="md"
          />
        </Box>
      </Flex>

      {step === 1 && (
        <VStack spacing={6} py={8}>
          <Heading size="lg" mb="2" color={headingColor}>
            <Icon as={FiGlobe} mr="2" color="blue.500" /> Select Your State
          </Heading>
          <Text fontSize="md" color="gray.600">
            Choose the state where you want to access facilities.
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="100%">
            {states.map((state) => (
              <SelectionCard
                key={state.id}
                icon={FiMapPin}
                title={state.name}
                description={state.description}
                onClick={() => {
                  setSelectedState(state);
                  setStep(2);
                }}
                isSelected={selectedState?.id === state.id}
              />
            ))}
          </SimpleGrid>
        </VStack>
      )}

      {step === 2 && (
        <VStack spacing={6} py={8}>
          <Heading size="lg" mb="2" color={headingColor}>
            <Icon as={FiTarget} mr="2" color="orange.500" /> Select Your City
          </Heading>
          <Text fontSize="md" color="gray.600">
            Now, pick the city within **
            {selectedState?.name || 'the selected state'}** to find available
            sites.
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5} w="100%">
            {cities.map((city) => (
              <SelectionCard
                key={city.id}
                icon={FiHome}
                title={city.name}
                description={city.description}
                onClick={() => {
                  setSelectedCity(city);
                  handleFetchFacilities();
                }}
                isSelected={selectedCity?.id === city.id}
              />
            ))}
          </SimpleGrid>
        </VStack>
      )}

      {step === 3 && (
        <Box py={8}>
          <Heading size="lg" mb="4" color={headingColor}>
            <Icon as={FiMapPin} mr="2" color="purple.500" /> Choose Your Site
          </Heading>
          <Text fontSize="md" color="gray.600" mb="6">

            {selectedCity?.name || 'your chosen city'}
          </Text>
          {loading ? (
            <VStack spacing={4} align="center" py={10}>
              <Spinner size="xl" color="green.500" thickness="4px" />
              <Text fontSize="lg" color="gray.500">
                Loading available sites...
              </Text>
            </VStack>
          ) : (
            <VStack spacing={4} align="stretch">
              {facilities.length > 0 ? (
                facilities.map((item) => (
                  <Box
                    key={item.id}
                    p="4"
                    bg={sectionBg}
                    borderRadius="lg"
                    cursor="pointer"
                    _hover={{
                      bg: itemHoverBg,
                      shadow: 'md',
                      transform: 'translateY(-2px)',
                    }}
                    transition="all 0.2s ease-in-out"
                    onClick={() => handleShowData(item)}
                  >
                    <HStack spacing={4} alignItems="center">
                      <Icon as={FiHome} boxSize={6} color="green.600" />
                      <Box>
                        <Text
                          fontWeight="bold"
                          fontSize="md"
                          color={siteNameColor}
                        >
                          {item.name.toUpperCase()}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {item.address}
                        </Text>
                      </Box>
                    </HStack>
                  </Box>
                ))
              ) : (
                <Text textAlign="center" color="gray.500" py={10} fontSize="lg">
                  No facilities found for this city. Please try another city or
                  state.
                </Text>
              )}
            </VStack>
          )}
        </Box>
      )}

      {step === 4 && (
        <Box py={8}>
          {selectedComplex ? (
            <>
              <Heading size="lg" mb="3" color={siteNameColor}>
                <Icon as={FiHome} mr="2" color="teal.500" />{' '}
                {selectedComplex.name}
              </Heading>
              <Text color="gray.600" mb="4" fontSize="md">
                <Icon as={FiMapPin} mr="1" color="gray.500" />{' '}
                {selectedComplex.address}
              </Text>
              <Divider mb="6" />
              {loading ? (
                <VStack spacing={4} align="center" py={10}>
                  <Spinner size="lg" color="blue.500" thickness="3px" />
                  <Text fontSize="md" color="gray.500">
                    Fetching cabin details...
                  </Text>
                </VStack>
              ) : (
                <VStack align="start" spacing={4}>
                  {selectedComplex.cabins &&
                    selectedComplex.cabins.length > 0 ? (
                    selectedComplex.cabins.map((cabin) => (
                      <Box
                        key={cabin.id}
                        p="4"
                        w="100%"
                        border="1px solid"
                        borderColor={cabinBorderColor}
                        borderRadius="lg"
                        bg={cabinBg}
                        shadow="sm"
                      >
                        <HStack
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box>
                            <Text
                              fontWeight="bold"
                              fontSize="md"
                              color={cabinTitleColor}
                            >
                              {cabin.cabin_name}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              <Text
                                as="span"
                                fontWeight="bold"
                                color={
                                  cabin.connection_status === 'ONLINE'
                                    ? 'green.500'
                                    : 'red.500'
                                }
                              >
                                {cabin.connection_status}
                              </Text>
                            </Text>
                          </Box>
                          <Button
                            size="sm"
                            colorScheme="blue"
                            leftIcon={<FiInfo />}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent Box's onClick from firing
                              handleViewCabinDetails(cabin.id);
                            }}
                          >
                            Details
                          </Button>
                        </HStack>
                      </Box>
                    ))
                  ) : (
                    <Text
                      textAlign="center"
                      color="gray.500"
                      py={5}
                      fontSize="md"
                    >
                      No cabins found for this complex.
                    </Text>
                  )}
                </VStack>
              )}
            </>
          ) : (
            <Text textAlign="center" color="gray.500" py={10} fontSize="lg">
              No complex details available. Please go back and try again.
            </Text>
          )}
        </Box>
      )}

      {step === 5 && (
        <Box py={8}>
          {Data ? (
            <CabinHealthDetailsTable
              Data={Data}
            />
          ) : (
            <Text textAlign="center" color="gray.500" py={10} fontSize="lg">
              Loading cabin health details...
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}
