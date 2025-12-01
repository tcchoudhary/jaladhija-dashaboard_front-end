import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Select,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdEmojiEmotions, MdPeople } from 'react-icons/md';
import LiveStatus from './components/LiveStatus';
import WaterStatus from './components/waterlevel';
import HealthStatus from './components/HealthStatus';
import ActiveTickets from './components/Ticket';
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
import GaugeChart from './components/PiechartComp';
import FeedbackChart from './components/feedbackchart';
import useUsageProfile from './components/UsageProfile';
import useFeedback from './components/feedback';
import { transformUsageDataToChart } from 'utils/transformUsageData';
import { transformFeedbackDataToChart } from 'utils/feedbacktransform';
import QuickConfigSection from './components/QuickConfigSection'

export default function UserReports() {
  const [selectedDays, setSelectedDays] = useState(30);
  const { usageData } = useUsageProfile(selectedDays);
  const chartData = transformUsageDataToChart(usageData);
  const { feedbackData } = useFeedback(selectedDays);
  const feedbackchartData = transformFeedbackDataToChart(feedbackData);
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

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
              icon={<Icon w="32px" h="32px" as={MdPeople} color={brandColor} />}
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
                {/* <Line type="monotone" dataKey="all" stroke="red" /> */}
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
        <div
          style={{
            width: '100%',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <GaugeChart days={selectedDays} />
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

              {/* Y-axis with range 0 to 5 */}
              <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]}
              />

              <Tooltip />
              <Legend />

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

      <div className="boxex">
        <ActiveTickets />
        <HealthStatus />
        <LiveStatus />
        <WaterStatus />
        <QuickConfigSection />
      </div>
    </Box>
  );
}
