// import React, { useState } from 'react';
// import {
//   Box,
//   Heading,
//   Table,
//   Thead,
//   Tbody,
//   Tr,
//   Th,
//   Td,
//   Badge,
//   useColorModeValue,
//   Icon,
//   Button,
//   HStack,
// } from '@chakra-ui/react';
// import { FiThumbsUp } from 'react-icons/fi';

// const UsageProfileCard = ({ usageProfiles, cabinName }) => {
//   console.log(usageProfiles, 'usageProfiles');
//   const cardBg = useColorModeValue('white', 'gray.700');
//   const headerBg = useColorModeValue('green.500', 'green.600');
//   const headerColor = useColorModeValue('white', 'gray.100');
//   const altRowBg = useColorModeValue('gray.50', 'gray.800');

//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 20; // Change this to however many items you want per page

//   const getFeedbackBadge = (feedback) => {
//     if (!feedback || feedback === 'Not Given') {
//       return <Badge colorScheme="gray">Not Given</Badge>;
//     }
//     return (
//       <Badge colorScheme="green">
//         <Icon as={FiThumbsUp} mr={1} />
//         {feedback}
//       </Badge>
//     );
//   };

//   // const formatTime = (timestampInSeconds) => {
//   //   if (typeof timestampInSeconds !== 'number') {
//   //     return '-';
//   //   }
//   //   const date = new Date(timestampInSeconds * 1000);
//   //   return date.toLocaleTimeString();
//   // };


//   const formatTime = (timestamp) => {
//     console.log(timestamp, 'timestamp');
//     if (!timestamp) return '-';  // Handle empty values

//     const date = new Date(timestamp);  // Convert the timestamp string to a Date object
//     return date.toLocaleString();  // Show both date and time
//   };


//   // Paginate the data based on current page
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = usageProfiles.slice(indexOfFirstItem, indexOfLastItem);
//   // console.log(currentItems, 'currentItems');
//   // Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage > 0 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//     }
//   };

//   // Calculate the total number of pages
//   const totalPages = Math.ceil(usageProfiles.length / itemsPerPage);

//   return (
//     <Box p={5} borderRadius="lg" boxShadow="lg" bg={cardBg} overflowX="auto">
//       <Box
//         p={3}
//         mb={4}
//         borderRadius="md"
//         bgGradient="linear(to-r, green.400, green.600)"
//       >
//         <Heading size="md" color={headerColor}>
//           📊 Usage Profile
//         </Heading>
//       </Box>

//       <Table size="sm" variant="striped">
//         <Thead bg={headerBg}>
//           <Tr>
//             <Th color={headerColor}>Date</Th>
//             <Th color={headerColor}>Entry Time</Th>
//             <Th color={headerColor}>Exit Time</Th>
//             <Th color={headerColor}>Cabin Name</Th>
//             <Th color={headerColor}>Duration</Th>
//             <Th color={headerColor}>Usage Charge</Th>
//             <Th color={headerColor}>Feedback</Th>
//             {/* <Th color={headerColor}>Entry Type</Th> */}
//             <Th color={headerColor}>Fan Time</Th>
//             <Th color={headerColor}>Floor Clean</Th>
//             <Th color={headerColor}>Full Flush</Th>
//             <Th color={headerColor}>Manual Flush</Th>
//             <Th color={headerColor}>Light Time</Th>
//             <Th color={headerColor}>Mini Flush</Th>
//             <Th color={headerColor}>Pre Flush</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {currentItems.map((item, index) => (
//             <Tr key={item.id} bg={index % 2 === 0 ? 'white' : altRowBg}>
//               <Td>{new Date(item.created_at).toLocaleDateString()}</Td>
//               <Td>{formatTime(item.Entry_TIME, 'time')}</Td>
//               <Td>{formatTime(item.Exit_TIME)}</Td>
//               <Td>{cabinName || 'N/A'}</Td>
//               <Td>{item.Duration || '-'}</Td>
//               <Td>{item.Amountcollected ? `₹${item.Amountcollected.replace(/[^0-9.]/g, '')}` : '₹0'}</Td>
//               <Td>{getFeedbackBadge(item.feedback)}</Td>
//               {/* <Td>
//                 <Badge
//                   colorScheme={item.Entrytype === 'Exit' ? 'blue' : 'purple'}
//                 >
//                   {item.Entrytype}
//                 </Badge>
//               </Td> */}
//               <Td>{item.Fantime || '0'}</Td>
//               <Td>{item.Floorclean || '0'}</Td>
//               <Td>{item.Fullflush || '0'}</Td>
//               <Td>{item.Manualflush || '0'}</Td>
//               <Td>{item.Lighttime || '0'}</Td>
//               <Td>{item.Miniflush || '0'}</Td>
//               <Td>{item.Preflush || '0'}</Td>
//             </Tr>
//           ))}
//         </Tbody>
//       </Table>

//       <HStack justify="center" mt={4}>
//         <Button
//           onClick={() => handlePageChange(currentPage - 1)}
//           isDisabled={currentPage === 1}
//         >
//           Previous
//         </Button>
//         <Button
//           onClick={() => handlePageChange(currentPage + 1)}
//           isDisabled={currentPage === totalPages}
//         >
//           Next
//         </Button>
//       </HStack>
//     </Box>
//   );
// };

// export default UsageProfileCard;





import React, { useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  Icon,
  Button,
  HStack,
} from '@chakra-ui/react';
import { FiThumbsUp } from 'react-icons/fi';

const UsageProfileCard = ({ usageProfiles, cabinName }) => {
  console.log(usageProfiles, 'usageProfiles');
  const cardBg = useColorModeValue('white', 'gray.700');
  const headerBg = useColorModeValue('green.500', 'green.600');
  const headerColor = useColorModeValue('white', 'gray.100');
  const altRowBg = useColorModeValue('gray.50', 'gray.800');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Change this to however many items you want per page

  const getFeedbackBadge = (feedback) => {
    if (!feedback || feedback === 'Not Given') {
      return <Badge colorScheme="gray">Not Given</Badge>;
    }
    return (
      <Badge colorScheme="green">
        <Icon as={FiThumbsUp} mr={1} />
        {feedback}
      </Badge>
    );
  };

  // Function to calculate the difference in minutes
  const calculateDurationInMinutes = (entryTime, exitTime) => {
    const entryDate = new Date(entryTime);
    const exitDate = new Date(exitTime);
    const diffInMs = exitDate - entryDate; // Difference in milliseconds
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60)); // Convert to minutes
    return diffInMinutes;
  };

  // Format time function to show both date and time
  const formatTime = (timestamp) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleString(); // Show both date and time
  };

  // Paginate the data based on current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = usageProfiles.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Calculate the total number of pages
  const totalPages = Math.ceil(usageProfiles.length / itemsPerPage);

  return (
    <Box p={5} borderRadius="lg" boxShadow="lg" bg={cardBg} overflowX="auto">
      <Box
        p={3}
        mb={4}
        borderRadius="md"
        bgGradient="linear(to-r, green.400, green.600)"
      >
        <Heading size="md" color={headerColor}>
          📊 Usage Profile
        </Heading>
      </Box>

      <Table size="sm" variant="striped">
        <Thead bg={headerBg}>
          <Tr>
            <Th color={headerColor}>Date</Th>
            <Th color={headerColor}>Entry Time</Th>
            <Th color={headerColor}>Exit Time</Th>
            <Th color={headerColor}>Cabin Name</Th>
            <Th color={headerColor}>Duration</Th>
            <Th color={headerColor}>Usage Charge</Th>
            <Th color={headerColor}>Feedback</Th>
            {/* <Th color={headerColor}>Entry Type</Th> */}
            <Th color={headerColor}>Fan Time</Th>
            <Th color={headerColor}>Floor Clean</Th>
            <Th color={headerColor}>Full Flush</Th>
            <Th color={headerColor}>Manual Flush</Th>
            <Th color={headerColor}>Light Time</Th>
            <Th color={headerColor}>Mini Flush</Th>
            <Th color={headerColor}>Pre Flush</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentItems.map((item, index) => {
            const durationInMinutes = calculateDurationInMinutes(item.Entry_TIME, item.Exit_TIME);
            const durationWithMinusFlag = durationInMinutes < 0 ? `-${Math.abs(durationInMinutes)}` : `${durationInMinutes}`;

            return (
              <Tr key={item.id} bg={index % 2 === 0 ? 'white' : altRowBg}>
                <Td>{new Date(item.created_at).toLocaleDateString()}</Td>
                <Td>{formatTime(item.Entry_TIME)}</Td>
                <Td>{formatTime(item.Exit_TIME)}</Td>
                <Td>{cabinName || 'N/A'}</Td>
                <Td>{durationWithMinusFlag} Min</Td> {/* Show Duration with Minus Flag */}
                <Td>{item.Amountcollected && '₹0'}</Td>
                <Td>{getFeedbackBadge(item.feedback)}</Td>
                {/* <Td>
                  <Badge
                    colorScheme={item.Entrytype === 'Exit' ? 'blue' : 'purple'}
                  >
                    {item.Entrytype}
                  </Badge>
                </Td> */}
                <Td>{durationWithMinusFlag} Min</Td> {/* Display the duration in Fan Time */}
                <Td>{item.Floorclean || '0'}</Td>
                <Td>{item.Fullflush || '0'}</Td>
                <Td>{item.Manualflush || '0'}</Td>
                <Td>{durationWithMinusFlag} Min</Td> {/* Display the duration in Light Time */}
                <Td>{item.Miniflush || '0'}</Td>
                <Td>{item.Preflush || '0'}</Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      <HStack justify="center" mt={4}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        >
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default UsageProfileCard;
