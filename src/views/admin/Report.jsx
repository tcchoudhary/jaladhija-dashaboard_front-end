// Chakra imports
import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Select,
  Button, // Import Button for the new toggle
} from '@chakra-ui/react';
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdEmojiEmotions, MdPeople } from 'react-icons/md';
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
import GaugeChart from './default/components/PiechartComp';
import FeedbackChart from './default/components/feedbackchart';
import useUsageProfile from './default/components/UsageProfile';
import useFeedback from './default/components/feedback';
import { transformUsageDataToChart } from 'utils/transformUsageData';
import { transformFeedbackDataToChart } from 'utils/feedbacktransform';

// Import the ComplexAccessTree component
import ComplexAccessTree from './complexReport'; // Adjust the path as needed
import { FiArrowLeft, FiHardDrive } from 'react-icons/fi'; // Icons for the button

export default function Reports() {
  const [selectedDays, setSelectedDays] = useState(30);
  const { usageData } = useUsageProfile(selectedDays);
  const { feedbackData } = useFeedback(selectedDays);
  const chartData = transformUsageDataToChart(usageData);
  // console.log(chartData,'chart')
  const feedbackchartData = transformFeedbackDataToChart(feedbackData);
  console.log(feedbackchartData, 'feed')
  // New state to manage which view is active
  const [showComplexView, setShowComplexView] = useState(false);

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

      pdf.save(`Usage_Report_${new Date().toISOString().slice(0, 10)}.pdf`);
    });
  };

  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  return (
    <Box id="report-content" pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex justifyContent="flex-end" mb="20px">
        <Button
          leftIcon={showComplexView ? <FiArrowLeft /> : <FiHardDrive />}
          onClick={() => setShowComplexView(!showComplexView)}
          colorScheme="blue"
        >
          {showComplexView
            ? 'Back to Overall Reports'
            : 'View Complex-wise Reports'}
        </Button>
      </Flex>

      {showComplexView ? (
        <ComplexAccessTree
          chartData={chartData}
          feedbackchartData={feedbackchartData}
          usageData={usageData}
        />
      ) : (
        <>
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
                  {/* <YAxis /> */}
                  <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]}
                  />
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
                      'MWC',
                      'FWC',
                      'PWC',
                      'MUW',

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

                        {/* <td style={{ border: '1px solid #ccc' }}>
                          {feedbackRow?.all || 0}
                        </td> */}
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
