import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  useColorModeValue,
  Icon,
  HStack,
  Badge,
  VStack,
  Card,
  Tabs,
  TabList,
  Tab,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  useTheme, // Import useTheme hook to access theme colors
} from '@chakra-ui/react';
import {
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiDroplet,
  FiKey,
  FiRefreshCw,
  FiInfo,
} from 'react-icons/fi';
import UsageProfileCard from './UsageProfile';

const HealthMetricCard = ({ title, status, description }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  let colorScheme = 'gray';
  let icon = FiInfo;
  let statusText = status;

  switch (status?.toUpperCase()) {
    case 'GOOD':
      colorScheme = 'green';
      icon = FiCheckCircle;
      break;
    case 'FAULT':
      colorScheme = 'red';
      icon = FiXCircle;
      break;
    case 'MEDIUM':
      colorScheme = 'orange';
      icon = FiAlertCircle;
      break;
    case 'HIGH':
      colorScheme = 'blue';
      icon = FiDroplet;
      break;
    case 'LOW':
      colorScheme = 'orange';
      icon = FiDroplet;
      break;
    case 'LOCKED':
      colorScheme = 'purple';
      icon = FiKey;
      break;
    case 'UNLOCKED':
      colorScheme = 'teal';
      icon = FiKey;
      break;
    case 'ONLINE':
      colorScheme = 'green';
      icon = FiRefreshCw;
      break;
    case 'OFFLINE':
      colorScheme = 'red';
      icon = FiXCircle;
      break;
    default:
      colorScheme = 'gray';
      icon = FiInfo;
      break;
  }

  return (
    <Card p={4} borderRadius="lg" shadow="md" bg={cardBg}>
      <VStack align="flex-start" spacing={2}>
        <HStack>
          <Icon as={icon} boxSize={6} color={`${colorScheme}.500`} />
          <Text fontWeight="bold" fontSize="md" color={textColor}>
            {title}
          </Text>
        </HStack>
        <Badge
          colorScheme={colorScheme}
          px={2}
          py={1}
          borderRadius="full"
          textTransform="capitalize"
        >
          {statusText}
        </Badge>
        {description && (
          <Text fontSize="sm" color="gray.500">
            {description}
          </Text>
        )}
      </VStack>
    </Card>
  );
};

const MeterSvgBackground = ({
  width,
  height,
  greenEnd,
  yellowEnd,
  greenColor,
  yellowColor,
  redColor,
  greyColor,
}) => {
  const radius = width / 2;
  const strokeWidth = 8;

  const getArcPath = (startPercent, endPercent) => {
    const startAngle = startPercent * 1.8;
    const endAngle = endPercent * 1.8;
    const startRad = (180 - startAngle) * (Math.PI / 180);
    const endRad = (180 - endAngle) * (Math.PI / 180);

    const startX = radius + radius * Math.cos(startRad);
    const startY = radius - radius * Math.sin(startRad);

    const endX = radius + radius * Math.cos(endRad);
    const endY = radius - radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle > 90 ? 1 : 0;
    const sweepFlag = 0;

    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
  };

  return (
    <svg
      width={width + strokeWidth}
      height={radius + strokeWidth / 2}
      viewBox={`0 0 ${width + strokeWidth} ${radius + strokeWidth / 2}`}
    >
      <g transform={`translate(${strokeWidth / 2}, ${strokeWidth / 2})`}>
        {/* Gray background track */}
        <path
          d={getArcPath(0, 100)}
          fill="none"
          stroke={greyColor} // Use resolved color
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Green segment */}
        <path
          d={getArcPath(0, greenEnd)}
          fill="none"
          stroke={greenColor} // Use resolved color
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Yellow segment */}
        <path
          d={getArcPath(greenEnd, yellowEnd)}
          fill="none"
          stroke={yellowColor} // Use resolved color
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Red segment */}
        <path
          d={getArcPath(yellowEnd, 100)}
          fill="none"
          stroke={redColor} // Use resolved color
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};

const StatusMeterCard = ({ title, value, unit, max = 100 }) => {
  const theme = useTheme();

  const cardBg = useColorModeValue('white', 'gray.700');
  const valueColor = useColorModeValue('gray.800', 'gray.100');
  const titleColor = useColorModeValue('gray.600', 'gray.300');

  const greenMeterColor = theme.colors.green[500];
  const yellowMeterColor = theme.colors.yellow[400];
  const redMeterColor = theme.colors.red[500];
  const greyMeterColor = theme.colors.gray[200];

  const greenEndPercentage = 33;
  const yellowEndPercentage = 66;

  const clampedValue = Math.min(Math.max(value, 0), max);
  const rotationDegrees = (clampedValue / max) * 180;

  const meterWidth = 120;
  const meterHeight = 60;
  const pointerLength = 55;
  const pointerBaseRadius = 6;
  const meterStrokeWidth = 8;

  return (
    <Card
      p={4}
      borderRadius="lg"
      shadow="md"
      bg={cardBg}
      textAlign="center"
      transition="all 0.2s ease-in-out"
      _hover={{
        shadow: 'lg',
        transform: 'translateY(-1px)',
      }}
    >
      <VStack spacing={2} align="center">
        <Box
          position="relative"
          width={meterWidth + meterStrokeWidth}
          height="100px"
        >
          <Box position="absolute" top="0" left="0" width="100%" height="100%">
            <MeterSvgBackground
              width={meterWidth}
              height={meterHeight}
              greenEnd={greenEndPercentage}
              yellowEnd={yellowEndPercentage}
              // Pass the resolved colors to the SVG component
              greenColor={greenMeterColor}
              yellowColor={yellowMeterColor}
              redColor={redMeterColor}
              greyColor={greyMeterColor}
            />
          </Box>

          <Box
            position="absolute"
            bottom={`${meterStrokeWidth / 2}px`}
            left="50%"
            transformOrigin="bottom center"
            transform={`translateX(-50%) rotate(${rotationDegrees - 90}deg)`}
            width="2px"
            height={`${pointerLength}px`}
            bg="gray.800"
            borderRadius="full"
            zIndex="2"
            transition="transform 0.5s ease-out"
          />
          <Box
            position="absolute"
            bottom={`${meterStrokeWidth / 2}px`}
            left="50%"
            transform="translateX(-50%)"
            width={`${pointerBaseRadius * 2}px`}
            height={`${pointerBaseRadius * 2}px`}
            borderRadius="full"
            bg="gray.800"
            zIndex="3"
          />
        </Box>

        <Text fontSize="2xl" fontWeight="bold" color={valueColor} mt={-2}>
          {value} {unit}
        </Text>
        <Text fontSize="sm" color={titleColor}>
          {title}
        </Text>
      </VStack>
    </Card>
  );
};

const ConfigModal = ({ isOpen, onClose, configData, title }) => {
  if (!configData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title} Configuration</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {Object.entries(configData).map(([key, value]) => {
            if (
              key === 'id' ||
              key === 'cabin_id' ||
              key === 'created_at' ||
              key === 'updated_at'
            )
              return null;

            return (
              <FormControl key={key} mb={4}>
                <FormLabel textTransform="capitalize">{key}</FormLabel>
                <Input defaultValue={value} isReadOnly />
              </FormControl>
            );
          })}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const CabinHealthDashboard = ({ Data }) => {
  const cabinName = Data?.cabin_name;
  const {
    gasReadings,
    deviceHealthStatus,
    ucemsConfig,
    cmsConfig,
    odsConfig,
    usageProfiles,
  } = Data || {};
  const dummyCommand = {
    command: 'Light',
    duration: 10, // numeric value (seconds)
    action: 'Switch ON',
    override: 'Override Command',
  };



  const cabinHealth = deviceHealthStatus?.[0] ?? deviceHealthStatus;


  console.log(cabinHealth, ' cabin health')
  const dashboardBg = useColorModeValue('white', 'gray.800');
  const sectionHeadingColor = useColorModeValue('gray.700', 'gray.100');

  const methaneValue = gasReadings[0]?.concentrationCH4 || 0;
  const coValue = gasReadings[0]?.concentrationCO || 0;
  const nh3Value = gasReadings[0]?.concentrationNH3 || 0;
  const luminosityValue = gasReadings[0]?.concentrationLuminosityStatus || 0;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const handleTabClick = (configData, title) => {
    setSelectedConfig(configData);
    setModalTitle(title);
    onOpen();
  };

  if (!cabinHealth) {
    return (
      <Box p={5} textAlign="center">
        <Text fontSize="lg" color="gray.500">
          No cabin health details available.
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6} borderWidth="1px" borderRadius="lg" shadow="xl" bg={dashboardBg}>
      <Heading size="md" mb={4} color={sectionHeadingColor}>
        <Icon as={FiAlertCircle} mr={2} color="orange.500" /> Cabin Status
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4} mb={8}>
        <StatusMeterCard
          title="Methane Concentration"
          value={methaneValue}
          unit="PPM"
          max={100}
        />
        <StatusMeterCard
          title="Carbon Monoxide Concentration"
          value={coValue}
          unit="PPM"
          max={100}
        />
        <StatusMeterCard
          title="Ammonia Concentration"
          value={nh3Value}
          unit="PPM"
          max={100}
        />
        <StatusMeterCard
          title="Luminous Intensity"
          value={luminosityValue}
          unit="Lumen"
          max={100}
        />
      </SimpleGrid>

      <Box paddingTop={'40px'}>
        <Heading size="md" mb={4} color={sectionHeadingColor}>
          <Icon as={FiCheckCircle} mr={2} color="green.500" /> Cabin Health
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={4}>
          <HealthMetricCard title="Flush" status={cabinHealth.flushHealth} />
          <HealthMetricCard
            title="Floor Clean"
            status={cabinHealth.floorCleanHealth}
          />
          <HealthMetricCard title="Fan" status={cabinHealth.fanHealth} />
          <HealthMetricCard title="Light" status={cabinHealth.lightHealth} />
          <HealthMetricCard title="ODS " status={cabinHealth.odsHealth} />
          <HealthMetricCard title="Lock" status={cabinHealth.lockStatus} />
        </SimpleGrid>
      </Box>

      <Box mt={12}>
        <Heading size="md" mb={4}>
          Commands and Settings
        </Heading>
        <Tabs variant="unstyled">
          <TabList display="flex" flexDirection="column" gap="2">
            <Tab
              onClick={() => handleTabClick(ucemsConfig, 'UCEMS Config')}
              _selected={{ bg: 'gray.200', shadow: 'md', color: 'black' }}
              p={4}
              borderRadius="md"
              bg="linear-gradient(90deg, rgba(93, 12, 255, 1) 0%, rgba(155, 0, 250, 1) 50%, rgba(0, 255, 255, 1) 100%)"
              color="white"
              boxShadow="sm"
            >
              UCEMS Config
            </Tab>

            <Tab
              onClick={() => handleTabClick(cmsConfig, 'CMS Config')}
              _selected={{ bg: 'gray.200', shadow: 'md', color: 'black' }}
              p={4}
              borderRadius="md"
              bg="linear-gradient(90deg, rgba(93, 12, 255, 1) 0%, rgba(155, 0, 250, 1) 50%, rgba(0, 255, 255, 1) 100%)"
              color="white"
              boxShadow="sm"
            >
              CMS Config
            </Tab>

            <Tab
              onClick={() => handleTabClick(odsConfig, 'ODS Config')}
              _selected={{ bg: 'gray.200', shadow: 'md', color: 'black' }}
              p={4}
              borderRadius="md"
              bg="linear-gradient(90deg, rgba(93, 12, 255, 1) 0%, rgba(155, 0, 250, 1) 50%, rgba(0, 255, 255, 1) 100%)"
              color="white"
              boxShadow="sm"
            >
              ODS Config
            </Tab>
            <Tab
              onClick={() => handleTabClick(dummyCommand, 'Command Config')}
              _selected={{ bg: 'gray.200', shadow: 'md', color: 'black' }}
              p={4}
              borderRadius="md"
              bg="linear-gradient(90deg, rgba(93, 12, 255, 1) 0%, rgba(155, 0, 250, 1) 50%, rgba(0, 255, 255, 1) 100%)"
              color="white"
              boxShadow="sm"
            >
              Commands
            </Tab>
          </TabList>
        </Tabs>
      </Box>

      <Box mt={12}>
        <UsageProfileCard usageProfiles={usageProfiles} cabinName={cabinName} />
      </Box>

      {/* Modal for Config Data */}
      <ConfigModal
        isOpen={isOpen}
        onClose={onClose}
        configData={selectedConfig}
        title={modalTitle}
      />
    </Box>
  );
};

export default CabinHealthDashboard;
