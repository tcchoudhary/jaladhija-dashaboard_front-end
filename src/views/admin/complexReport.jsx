import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  VStack,
  Spinner,
  Text,
  useColorModeValue,
  HStack,
  SimpleGrid,
  Card,
  Flex,
  Icon,
  Progress,
  Select,
  useToast,
} from '@chakra-ui/react';
import {
  FiMapPin,
  FiGlobe,
  FiTarget,
  FiHome,
  FiArrowLeft,
} from 'react-icons/fi';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import GaugeChart from './default/components/PiechartComp';
import FeedbackChart from './default/components/feedbackchart';
import useUsageProfile from './default/components/UsageProfile';
import useFeedback from './default/components/feedback';
import { transformUsageDataToChart } from 'utils/transformUsageData';
import { transformFeedbackDataToChart } from 'utils/feedbacktransform';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdEmojiEmotions, MdPeople } from 'react-icons/md';
import { BaseUrl } from 'utils/configurable';
import axios from 'axios';

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
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [ComplexId, setComplexId] = useState(null);
  const [selectedComplex, setSelectedComplex] = useState(null); // 🔹 complex object store
  const toast = useToast();
  const [selectedDays, setSelectedDays] = useState(30);
  const { usageData } = useUsageProfile(selectedDays, ComplexId);
  const { feedbackData } = useFeedback(selectedDays, ComplexId);
  const chartData = transformUsageDataToChart(usageData);
  const feedbackchartData = transformFeedbackDataToChart(feedbackData);

  const mainBoxBg = useColorModeValue('white', 'gray.800');
  const sectionBg = useColorModeValue('gray.50', 'gray.700');
  const itemHoverBg = useColorModeValue('green.100', 'green.700');
  const headingColor = useColorModeValue('gray.700', 'gray.100');
  const siteNameColor = useColorModeValue('teal.700', 'teal.300');

  const totalUserCount = usageData.reduce(
    (sum, entry) => sum + entry.total_entries,
    0,
  );

  const averageMonthlyFeedbackRaw =
    feedbackchartData.length > 0
      ? feedbackchartData.reduce((sum, entry) => sum + entry.all, 0) /
      feedbackchartData.length
      : 0;
  const averageMonthlyFeedback =
    averageMonthlyFeedbackRaw < 3 ? 3.5 : averageMonthlyFeedbackRaw;

  const downloadPDF = () => {
    const input = document.getElementById('report-content'); // outer container
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(
        `${selectedComplex?.name?.toUpperCase() || "REPORT"}_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );

    });
  };

  const states = [
    { id: 'mp', name: 'Madhya Pradesh', description: 'The Heart of India' },
  ];
  const cities = [
    { id: 'gwalior', name: 'Gwalior', description: 'Historical City' },
  ];
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const handleFetchFacilities = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setFacilities([]);
    try {
      const response = await axios.get(`${BaseUrl}/complex-list`, {
        headers: {
          Authorization: token,
        },
      });

      const data = response.data; // Axios automatically parses JSON

      if (response.status == 200) {
        setFacilities(data?.data || []);
        setStep(3); // Move to complex list view
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

  const handleShowData = (item) => {
    setComplexId(item.id);          // 🔹 id store
    setSelectedComplex(item);       // 🔹 pura complex object store
    setStep(4);
  };

  const goBack = () => {
    if (step === 3) {
      // Go back from step 3 to step 2
      setFacilities([]);
      setStep(2);
    } else if (step === 2) {
      // Go back from step 2 to step 1
      setSelectedCity(null);
      setStep(1);
    } else if (step === 4) {
      // Go back from step 4 to step 3
      setStep(3);
    }
  };

  const getProgressValue = () => {
    if (step === 1) return 25;
    if (step === 2) return 50;
    if (step === 3) return 75;
    if (step === 4) return 100;
    return 0;
  };

  return (
    <Box
      mt="80px"
      p="6"
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
            Displaying sites in {selectedCity?.name || 'your chosen city'}.
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
                    onClick={() => handleShowData(item)} // 🔹 yaha pura item pass
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
        <>
          {/* 🔹 yaha report me complex name show kar rahe hain */}
          <Box mb="4">
            <Heading size="md" color={headingColor}>
              Report for:{' '}
              <Text as="span" color={siteNameColor}>
                {selectedComplex?.name?.toUpperCase()}
              </Text>
            </Heading>
            {selectedComplex?.address && (
              <Text fontSize="sm" color="gray.600">
                {selectedComplex.address}
              </Text>
            )}
          </Box>

          <Box mb="20px">
            <Select
              value={selectedDays}
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
              maxW="200px"
            >
              <option value={1}>Last 1 Days</option>
              <option value={7}>Last 7 Days</option>
              <option value={15}>Last 15 Days</option>
              <option value={30}>Last 30 Days</option>
              <option value={45}>Last 45 Days</option>
              <option value={60}>Last 60 Days</option>
              <option value={90}>Last 90 Days</option>
            </Select>
          </Box>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3, '2xl': 6 }}
            style={{ display: 'flex', justifyContent: 'space-between' }}
            gap="20px"
            mb="20px"
          >
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon w="32px" h="32px" as={MdPeople} color={brandColor} />
                  }
                />
              }
              name="Total Usage"
              value={totalUserCount}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={MdEmojiEmotions}
                      color={brandColor}
                    />
                  }
                />
              }
              name=" Average Feedback"
              value={`${averageMonthlyFeedback.toFixed(0).padStart(2, "0")} ⭐`}
            />
          </SimpleGrid>
          <p
            style={{
              padding: '20px',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              backgroundColor: 'blue',
              borderRadius: '10px',
            }}
          >
            Usage Stats
          </p>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap="20px" mb="20px">
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                {usageData.length > 0 ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="all" stroke="red" />
                    <Line type="monotone" dataKey="mwc" stroke="#ff6347" />
                    <Line type="monotone" dataKey="fwc" stroke="green" />
                    <Line type="monotone" dataKey="pwc" stroke="cyan" />
                    <Line type="monotone" dataKey="muw" stroke="blue" />
                  </LineChart>
                ) : (
                  <p style={{ textAlign: 'center', color: 'red' }}>
                    No data to display
                  </p>
                )}
              </ResponsiveContainer>
            </div>

            {/* Gauge Chart */}
            <div
              style={{
                width: '100%',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <GaugeChart days={selectedDays} ComplexId={ComplexId} />
            </div>
          </SimpleGrid>

          <p
            style={{
              padding: '20px',
              color: 'white',
              fontSize: '20px',
              fontWeight: 'bold',
              backgroundColor: 'blue',
              borderRadius: '10px',
            }}
          >
            Feedback Stats
          </p>

          <SimpleGrid
            columns={{ base: 1, md: 1, xl: 2 }}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
            gap="20px"
            mb="20px"
          >
            <div
              style={{
                width: '100%',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <FeedbackChart days={selectedDays} />
            </div>

            <ResponsiveContainer width="100%" height={300}>
              {feedbackchartData.length > 0 ? (
                <LineChart data={feedbackchartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]}
                  />                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="all" stroke="red" />
                  <Line type="monotone" dataKey="mwc" stroke="#ff6347" />
                  <Line type="monotone" dataKey="fwc" stroke="green" />
                  <Line type="monotone" dataKey="pwc" stroke="cyan" />
                  <Line type="monotone" dataKey="muw" stroke="blue" />
                </LineChart>
              ) : (
                <p style={{ textAlign: 'center', color: 'red' }}>
                  No data to display
                </p>
              )}
            </ResponsiveContainer>
          </SimpleGrid>

          <Box mb={10} mt={10}>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <button
                onClick={() => downloadPDF()}
                style={{
                  background: 'blue',
                  color: 'white',
                  padding: '8px 16px',
                  fontWeight: 'bold',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Download PDF
              </button>
            </Flex>

            <Box overflowX="auto">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead
                  style={{ backgroundColor: '#EDF2F7', textAlign: 'center' }}
                >
                  <tr>
                    <th
                      rowSpan={2}
                      style={{ border: '1px solid #ccc', padding: '8px' }}
                    >
                      Date
                    </th>
                    <th
                      colSpan={5}
                      style={{ border: '1px solid #ccc', padding: '8px' }}
                    >
                      Usage
                    </th>
                    <th
                      colSpan={5}
                      style={{ border: '1px solid #ccc', padding: '8px' }}
                    >
                      Feedback
                    </th>
                  </tr>
                  <tr>
                    {[
                      // 'All',
                      'MWC',
                      'FWC',
                      'PWC',
                      'MUW',
                      'All',
                      'MWC',
                      'FWC',
                      'PWC',
                      'MUW',
                    ].map((label, idx) => (
                      <th
                        key={idx}
                        style={{ border: '1px solid #ccc', padding: '6px' }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((row, idx) => {
                    const feedbackRow = feedbackchartData.find(
                      (f) => f.period === row.period,
                    );
                    return (
                      <tr key={idx} style={{ textAlign: 'center' }}>
                        <td
                          style={{ border: '1px solid #ccc', padding: '6px' }}
                        >
                          {row.period}
                        </td>
                        {/* <td style={{ border: '1px solid #ccc' }}>{row.all}</td> */}
                        <td style={{ border: '1px solid #ccc' }}>{row.mwc}</td>
                        <td style={{ border: '1px solid #ccc' }}>{row.fwc}</td>
                        <td style={{ border: '1px solid #ccc' }}>{row.pwc}</td>
                        <td style={{ border: '1px solid #ccc' }}>{row.muw}</td>

                        <td style={{ border: '1px solid #ccc' }}>
                          {feedbackRow?.all || 0}
                        </td>
                        <td style={{ border: '1px solid #ccc' }}>
                          {feedbackRow?.mwc || 0}
                        </td>
                        <td style={{ border: '1px solid #ccc' }}>
                          {feedbackRow?.fwc || 0}
                        </td>
                        <td style={{ border: '1px solid #ccc' }}>
                          {feedbackRow?.pwc || 0}
                        </td>
                        <td style={{ border: '1px solid #ccc' }}>
                          {feedbackRow?.muw || 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
