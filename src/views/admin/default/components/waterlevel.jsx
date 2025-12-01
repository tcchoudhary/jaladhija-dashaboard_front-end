
// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Text,
//   VStack,
//   SimpleGrid,
//   Button,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   useDisclosure,
//   Select,
// } from '@chakra-ui/react';
// import axios from 'axios';
// import { BaseUrl } from 'utils/configurable';
// const WaterStatusPage = () => {
//   const [complexes, setComplexes] = useState([]); // State to store all complexes
//   const [selectedComplex, setSelectedComplex] = useState(null); // State for selected complex to update water level
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const emp_role = JSON.parse(localStorage.getItem('user'));

//   // Function to fetch water level status
//   const fetchStatus = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.get(`${BaseUrl}/water-level-status`, {
//         headers: {
//           Authorization: token,
//         },
//       });


//       const devices = res.data.devices || [];

//       const grouped = devices.reduce((acc, device) => {
//         const complexId = device.cabin.complex_id;
//         const complexName = device.cabin.complex.name;

//         if (!acc[complexId]) {
//           acc[complexId] = {
//             complexId,
//             complex_name: complexName,
//             cabins: [],
//           };
//         }

//         acc[complexId].cabins.push({
//           cabin_id: device.cabin_id,
//           name: device.cabin.cabin_name,
//           freshWaterLevel: device.freshWaterLevel,
//           recycleWaterLevel: device.recycleWaterLevel,
//         });

//         return acc;
//       }, {});

//       // Convert object to array
//       const allComplexes = Object.values(grouped);

//       // Randomly select 2 complexes to display for today
//       const dailyComplexes = getRandomComplexes(allComplexes, 10);

//       setComplexes(dailyComplexes); // Set the selected 2 complexes
//     } catch (err) {
//       console.error('Error fetching data:', err);
//     }
//   };

//   // Helper function to get random complexes
//   const getRandomComplexes = (complexes, number) => {
//     const shuffled = [...complexes].sort(() => 0.5 - Math.random());
//     return shuffled.slice(0, number);
//   };

//   useEffect(() => {
//     fetchStatus(); // Fetch the data when the component mounts
//   }, []);

//   // Function to open the modal for updating water levels
//   const openUpdateModal = (complex) => {
//     setSelectedComplex(complex);
//     onOpen();
//   };

//   // Function to handle water level change and update on the backend
//   const handleLevelChange = async (cabinName, levelType, value) => {
//     try {
//       const res = await axios.post(
//         `${BaseUrl}/update-single-cabin-water-level`, // Update API endpoint
//         {
//           complex_id: selectedComplex?.complexId,
//           cabin_name: cabinName,
//           [levelType]: value,
//         },
//         {
//           headers: {
//             Authorization: localStorage.getItem('token'),
//           },
//         }
//       );
//       fetchStatus(); // Refresh data after update
//       // onClose(); // Keep modal open
//     } catch (error) {
//       console.log('Error updating water level:', error);
//     }
//   };

//   return (
//     <VStack mt="80px" px={6} spacing={8} align="stretch">
//       <Text fontSize="2xl" fontWeight="bold">
//         Water Level Status
//       </Text>

//       {/* Displaying Complexes with Low Water Levels */}
//       <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
//         {complexes
//           .filter((complex) =>
//             complex.cabins.some(
//               (cabin) =>
//                 Number(cabin.freshWaterLevel) <= 30 || Number(cabin.recycleWaterLevel) <= 30
//             )
//           ) // Filter complexes with low water levels (threshold: 30)
//           .map((complex, i) => {
//             const lowCabins = complex.cabins.filter(
//               (cabin) =>
//                 Number(cabin.freshWaterLevel) <= 30 || Number(cabin.recycleWaterLevel) <= 30
//             );

//             return (
//               <Box
//                 key={i}
//                 p={5}
//                 borderWidth="1px"
//                 borderRadius="xl"
//                 shadow="md"
//                 bg="white"
//                 _hover={{
//                   cursor: lowCabins.length > 0 ? 'pointer' : 'default',
//                 }}
//                 onClick={() => lowCabins.length > 0 && openUpdateModal(complex)}
//               >
//                 <Text fontSize="xl" fontWeight="semibold" mb={2}>
//                   {complex.complex_name}
//                 </Text>
//                 {lowCabins.length > 0 ? (
//                   <>
//                     <Text>Low water level reported</Text>
//                     {emp_role == 1 && (
//                       <Button
//                         mt={4}
//                         size="sm"
//                         colorScheme="blue"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           openUpdateModal(complex);
//                         }}
//                       >
//                         Update Water Level
//                       </Button>
//                     )}
//                   </>
//                 ) : (
//                   <Text>Normal water level.</Text>
//                 )}
//               </Box>
//             );
//           })}
//       </SimpleGrid>

//       {/* Modal for updating water levels */}
//       <Modal isOpen={isOpen} onClose={onClose} size="xl">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>
//             Update Water Level - {selectedComplex?.complex_name}
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             {selectedComplex?.cabins
//               .filter(
//                 (cabin) =>
//                   Number(cabin.freshWaterLevel) <= 30 ||
//                   Number(cabin.recycleWaterLevel) <= 30
//               )
//               .map((cabin, idx) => (
//                 <Box key={idx} p={3} borderWidth="1px" mb={3} borderRadius="lg">
//                   <Text fontWeight="medium" mb={2}>
//                     {cabin.name}
//                   </Text>
//                   <Box mb={2}>
//                     <Text fontWeight="bold" mb={1}>Fresh Water Level:</Text>
//                     {emp_role == 1 ? (
//                       <Select
//                         placeholder={`Fresh Water Level (${cabin.freshWaterLevel})`}
//                         value={cabin.freshWaterLevel}
//                         onChange={(e) =>
//                           handleLevelChange(
//                             cabin.name,
//                             'freshWaterLevel',
//                             e.target.value
//                           )
//                         }
//                       >
//                         <option value="NORMAL">NORMAL</option>
//                         <option value="MEDIUM">MEDIUM</option>
//                         <option value="LOW">LOW</option>
//                       </Select>
//                     ) : (
//                       <Text fontSize="sm" color="gray.600">
//                         {cabin.freshWaterLevel}
//                       </Text>
//                     )}
//                   </Box>
//                   <Box>
//                     <Text fontWeight="bold" mb={1}>Recycle Water Level:</Text>
//                     {emp_role == 1 ? (
//                       <Select
//                         placeholder={`Recycle Water Level (${cabin.recycleWaterLevel})`}
//                         value={cabin.recycleWaterLevel}
//                         onChange={(e) =>
//                           handleLevelChange(
//                             cabin.name,
//                             'recycleWaterLevel',
//                             e.target.value
//                           )
//                         }
//                       >
//                         <option value="NORMAL">NORMAL</option>
//                         <option value="MEDIUM">MEDIUM</option>
//                         <option value="LOW">LOW</option>
//                       </Select>
//                     ) : (
//                       <Text fontSize="sm" color="gray.600">
//                         {cabin.recycleWaterLevel}
//                       </Text>
//                     )}
//                   </Box>
//                 </Box>
//               ))}
//           </ModalBody>

//           <ModalFooter>
//             <Button onClick={onClose}>Close</Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </VStack>
//   );
// };

// export default WaterStatusPage;





import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  SimpleGrid,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
} from '@chakra-ui/react';
import axios from 'axios';
import { BaseUrl } from 'utils/configurable';

const WaterStatusPage = () => {
  const [complexes, setComplexes] = useState([]); // State to store all complexes
  const [devices, setDevices] = useState([]); // State to store water level information of devices
  const [selectedComplex, setSelectedComplex] = useState(null); // State for selected complex to update water level
  const { isOpen, onOpen, onClose } = useDisclosure();
  const emp_role = JSON.parse(localStorage.getItem('user'));

  // Function to fetch water level status
  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BaseUrl}/water-level-status`, {
        headers: {
          Authorization: token,
        },
      });

      const { complexes, devices } = res.data;

      // Grouping devices by complex
      const groupedDevices = devices.reduce((acc, device) => {
        const complexId = device.cabin.complex_id;
        const cabinName = device.cabin.cabin_name;
        if (!acc[complexId]) acc[complexId] = [];
        acc[complexId].push({
          cabin_id: device.cabin_id,
          cabin_name: cabinName,
          freshWaterLevel: device.freshWaterLevel,
          recycleWaterLevel: device.recycleWaterLevel,
        });
        return acc;
      }, {});

      // Attach devices to corresponding complexes
      const updatedComplexes = complexes.map((complex) => {
        return {
          ...complex,
          cabins: complex.low_water_cabin_names.map((cabinName) => {
            const device = groupedDevices[complex.complexId]?.find(
              (device) => device.cabin_name === cabinName
            );
            return device ? { ...device, complex_name: complex.complex_name } : null;
          }).filter(Boolean),
        };
      });

      setComplexes(updatedComplexes); // Set the complexes with water level info
      setDevices(devices); // Set the raw devices data (can be used for other features)
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchStatus(); // Fetch the data when the component mounts
  }, []);

  // Function to open the modal for updating water levels
  const openUpdateModal = (complex) => {
    setSelectedComplex(complex);
    onOpen();
  };

  // Function to handle water level change and update on the backend
  const handleLevelChange = async (cabinName, levelType, value) => {
    try {
      const res = await axios.post(
        `${BaseUrl}/update-single-cabin-water-level`, // Update API endpoint
        {
          complex_id: selectedComplex?.complexId,
          cabin_name: cabinName,
          [levelType]: value,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );
      fetchStatus(); // Refresh data after update
      // onClose(); // Keep modal open
    } catch (error) {
      console.log('Error updating water level:', error);
    }
  };

  return (
    <VStack mt="80px" px={6} spacing={8} align="stretch">
      <Text fontSize="2xl" fontWeight="bold">
        Water Level Status
      </Text>

      {/* Displaying Complexes with Low Water Levels */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {complexes
          .filter((complex) => complex.cabins.length > 0) // Only show complexes with low water level cabins
          .map((complex, i) => {
            return (
              <Box
                key={i}
                p={5}
                borderWidth="1px"
                borderRadius="xl"
                shadow="md"
                bg="white"
                _hover={{
                  cursor: 'pointer',
                }}
                onClick={() => openUpdateModal(complex)}
              >
                <Text fontSize="xl" fontWeight="semibold" mb={2}>
                  {complex.complex_name}
                </Text>
                <Text>Low water level reported in {complex.cabins.length} cabin(s)</Text>
                {emp_role == 1 && (
                  <Button
                    mt={4}
                    size="sm"
                    colorScheme="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      openUpdateModal(complex);
                    }}
                  >
                    Update Water Level
                  </Button>
                )}
              </Box>
            );
          })}
      </SimpleGrid>

      {/* Modal for updating water levels */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Update Water Level - {selectedComplex?.complex_name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedComplex?.cabins.map((cabin, idx) => (
              <Box key={idx} p={3} borderWidth="1px" mb={3} borderRadius="lg">
                <Text fontWeight="medium" mb={2}>
                  {cabin.cabin_name}
                </Text>
                <Box mb={2}>
                  <Text fontWeight="bold" mb={1}>Fresh Water Level:</Text>
                  {emp_role == 1 ? (
                    <Select
                      placeholder={`Fresh Water Level (${cabin.freshWaterLevel})`}
                      value={cabin.freshWaterLevel}
                      onChange={(e) =>
                        handleLevelChange(cabin.cabin_name, 'freshWaterLevel', e.target.value)
                      }
                    >
                      <option value="NORMAL">NORMAL</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </Select>
                  ) : (
                    <Text fontSize="sm" color="gray.600">
                      {cabin.freshWaterLevel}
                    </Text>
                  )}
                </Box>
                <Box>
                  <Text fontWeight="bold" mb={1}>Recycle Water Level:</Text>
                  {emp_role == 1 ? (
                    <Select
                      placeholder={`Recycle Water Level (${cabin.recycleWaterLevel})`}
                      value={cabin.recycleWaterLevel}
                      onChange={(e) =>
                        handleLevelChange(cabin.cabin_name, 'recycleWaterLevel', e.target.value)
                      }
                    >
                      <option value="NORMAL">NORMAL</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="LOW">LOW</option>
                    </Select>
                  ) : (
                    <Text fontSize="sm" color="gray.600">
                      {cabin.recycleWaterLevel}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default WaterStatusPage;
