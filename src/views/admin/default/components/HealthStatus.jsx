// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Text,
//   SimpleGrid,
//   VStack,
//   HStack,
//   useToast,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   Select,
//   useDisclosure,
//   Spinner,
// } from '@chakra-ui/react';
// import { FaToilet } from 'react-icons/fa';
// import axios from 'axios';
// import { BaseUrl } from 'utils/configurable';

// const HealthStatus = () => {
//   const [complexes, setComplexes] = useState([]);
//   const [selectedComplex, setSelectedComplex] = useState(null);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const toast = useToast();
//   const [loading, setLoading] = useState(false);
//   const userRole = JSON.parse(localStorage.getItem('user'));




//   const fetchHealthStatus = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       // Fetch the health status using axios
//       const { data } = await axios.get(`${BaseUrl}/health-status`, {
//         headers: {
//           Authorization: token,
//         },
//       });

//       // Update the complexes state with the fetched data
//       setComplexes(data?.complexes || []);

//       // Update selected complex if it exists
//       if (selectedComplex) {
//         const updatedComplex = data.complexes.find((c) => c.complex_name === selectedComplex.complex_name);
//         if (updatedComplex) setSelectedComplex(updatedComplex);
//       }
//     } catch (err) {
//       console.error('Error fetching health status:', err);
//       toast({
//         title: 'Failed to fetch health status',
//         description: err?.message || 'Something went wrong',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//         position: 'top',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdate = async (complexName, cabinName, faultKey, newValue) => {
//     try {
//       // Make the post request to update the health status
//       await axios.post(
//         `${BaseUrl}/health-status-update`,
//         {
//           complex_name: complexName,
//           cabin_name: cabinName,
//           fault_key: faultKey,
//           new_value: newValue,
//         },
//         {
//           headers: {
//             Authorization: localStorage.getItem('token'),
//           },
//         }
//       );

//       // Notify success and refresh health status
//       toast({
//         title: 'Updated successfully',
//         status: 'success',
//         duration: 2000,
//         isClosable: true,
//         position: 'top',
//       });

//       // Fetch the updated health status
//       await fetchHealthStatus();
//     } catch (err) {
//       console.error('Error updating health status:', err);
//       toast({
//         title: 'Update failed',
//         description: err?.message || 'An error occurred while updating.',
//         status: 'error',
//         duration: 3000,
//         isClosable: true,
//         position: 'top',
//       });
//     }
//   };


//   const faultValidValues = {
//     "lockHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD"],
//     "flushHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD"],
//     "floorCleanHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD"],
//     "fanHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD"],
//     "freshWaterLevel": ["HIGH", "MEDIUM", "LOW"],
//     "lightHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD"],
//     "recycleWaterLevel": ["HIGH", "MEDIUM", "LOW"],
//     "tapHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD"],
//     "odsHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD"],
//     "airDryerHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD"],
//     "chokeHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD"],
//   };

//   useEffect(() => {
//     fetchHealthStatus();
//   }, []);
//   const openModal = (complex) => {
//     setSelectedComplex(complex);
//     onOpen();
//   };

//   return (
//     <Box p={6} bgGradient="linear(to-br, gray.100, white)" >
//       <Text
//         fontSize="2xl"
//         fontWeight="bold"
//         mb={6}
//         bgGradient="linear(to-r, purple.500, blue.400)"
//         bgClip="text"
//       >
//         🚑 Health Status Overview
//       </Text>

//       {loading ? (
//         <HStack justify="center" mt={10}>
//           <Spinner size="lg" color="blue.500" />
//         </HStack>
//       ) : (
//         <SimpleGrid columns={[1, 1, 2, 3]} spacing={6} pb={10}>
//           {complexes.map((complex, idx) => (
//             <Box
//               key={idx}
//               p={5}
//               borderRadius="2xl"
//               bgGradient="linear(to-r, blue.50, purple.50)"
//               boxShadow="lg"
//               borderLeft="6px solid #805AD5"
//               _hover={{
//                 transform: 'scale(1.02)',
//                 cursor: userRole == "1" ? 'pointer' : "",
//                 boxShadow: 'xl',
//               }}
//               transition="all 0.3s"
//               onClick={() => {
//                 if (
//                   userRole == 1 &&
//                   complex.cabins.some((cabin) => cabin.fault_count > 0)
//                 ) {
//                   openModal(complex);
//                 }
//               }}
//             >
//               <HStack justify="space-between">
//                 <HStack spacing={2}>
//                   <FaToilet color="#805AD5" />
//                   <Text fontWeight="bold" color="blue.700" fontSize="lg">
//                     {complex.complex_name}
//                   </Text>
//                 </HStack>
//               </HStack>

//               <Text mt={2} fontSize="sm" color="gray.600">
//                 {complex.total_faulty_cabins} Faulty Cabin(s) reported.
//               </Text>
//             </Box>
//           ))}
//         </SimpleGrid>
//       )}



//       <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader bg="purple.600" color="white">
//             🛠️ {selectedComplex?.complex_name} - Cabin Faults
//           </ModalHeader>
//           <ModalCloseButton color="white" />
//           <ModalBody pb={6} bg="gray.50">
//             {selectedComplex?.cabins
//               .filter((cabin) => cabin.fault_count > 0)
//               .map((cabin, cIdx) => (
//                 <Box
//                   key={cIdx}
//                   p={4}
//                   mb={5}
//                   bg="white"
//                   borderRadius="lg"
//                   boxShadow="sm"
//                   borderLeft="5px solid #805AD5"
//                 >
//                   <Text fontWeight="semibold" mb={2} fontSize="md" color="gray.700">
//                     🚻 Cabin: {cabin.cabin_name} ({cabin.fault_count} issues)
//                   </Text>

//                   <VStack align="start" spacing={3}>
//                     {cabin.faults.map((fault, fIdx) => {
//                       const [key, value] = fault.split(': ');
//                       const cleanKey = key.trim();
//                       const cleanValue = value.trim();

//                       // Fetch the valid values for the fault key
//                       const validValues = faultValidValues[cleanKey] || [];

//                       return (
//                         <HStack
//                           key={fIdx}
//                           w="full"
//                           p={2}
//                           borderRadius="md"
//                           bg="gray.100"
//                           justify="space-between"
//                         >
//                           <Text flex={1} fontSize="sm" color="gray.700">
//                             {cleanKey.replace('Health', '')}
//                           </Text>

//                           {userRole == 1 ? (
//                             <Select
//                               size="sm"
//                               value={cleanValue}
//                               onChange={(e) =>
//                                 handleUpdate(
//                                   selectedComplex.complex_name,
//                                   cabin.cabin_name,
//                                   cleanKey,
//                                   e.target.value
//                                 )
//                               }
//                               w="130px"
//                               bg="white"
//                             >
//                               {validValues.map((option, idx) => (
//                                 <option key={idx} value={option}>
//                                   {option}
//                                 </option>
//                               ))}
//                             </Select>
//                           ) : (
//                             <></>
//                           )}
//                         </HStack>
//                       );
//                     })}
//                   </VStack>
//                 </Box>
//               ))}
//           </ModalBody>
//         </ModalContent>
//       </Modal>

//     </Box>
//   );
// };

// export default HealthStatus;







import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react';
import { FaToilet } from 'react-icons/fa';
import axios from 'axios';
import { BaseUrl } from 'utils/configurable';

const HealthStatus = () => {
  const [complexes, setComplexes] = useState([]);
  const [selectedComplex, setSelectedComplex] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const userRole = JSON.parse(localStorage.getItem('user'));




  const fetchHealthStatus = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch the health status using axios
      const { data } = await axios.get(`${BaseUrl}/health-status`, {
        headers: {
          Authorization: token,
        },
      });

      // Update the complexes state with the fetched data
      setComplexes(data?.complexes || []);

      // Update selected complex if it exists
      if (selectedComplex) {
        const updatedComplex = data.complexes.find((c) => c.complex_name === selectedComplex.complex_name);
        if (updatedComplex) setSelectedComplex(updatedComplex);
      }
    } catch (err) {
      console.error('Error fetching health status:', err);
      toast({
        title: 'Failed to fetch health status',
        description: err?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (complexName, cabinName, faultKey, newValue) => {
    try {
      // Make the post request to update the health status
      await axios.post(
        `${BaseUrl}/health-status-update`,
        {
          complex_name: complexName,
          cabin_name: cabinName,
          fault_key: faultKey,
          new_value: newValue,
        },
        {
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        }
      );

      // Notify success and refresh health status
      toast({
        title: 'Updated successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });

      // Fetch the updated health status
      await fetchHealthStatus();
    } catch (err) {
      console.error('Error updating health status:', err);
      toast({
        title: 'Update failed',
        description: err?.message || 'An error occurred while updating.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };


  const faultValidValues = {
    "lockHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD", "LOW", "MEDIUM", "HIGH"],
    "flushHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD", "LOW", "MEDIUM", "HIGH"],
    "floorCleanHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD", "LOW", "MEDIUM", "HIGH"],
    "fanHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD", "LOW", "MEDIUM", "HIGH"],
    "freshWaterLevel": ["HIGH", "MEDIUM", "LOW", "NORMAL"], // Added NORMAL if needed
    "lightHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD", "LOW", "MEDIUM", "HIGH"],
    "recycleWaterLevel": ["HIGH", "MEDIUM", "LOW", "NORMAL"],
    "tapHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD", "LOW", "MEDIUM", "HIGH"],
    "odsHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD", "LOW", "MEDIUM", "HIGH"],
    "airDryerHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD", "LOW", "MEDIUM", "HIGH"],
    "chokeHealth": ["OK", "Working", "Faulty", "Not Working", "GOOD", "LOW", "MEDIUM", "HIGH"],
  };

  useEffect(() => {
    fetchHealthStatus();
  }, []);
  const openModal = (complex) => {
    setSelectedComplex(complex);
    onOpen();
  };

  return (
    <Box p={6} bgGradient="linear(to-br, gray.100, white)" >
      <Text
        fontSize="2xl"
        fontWeight="bold"
        mb={6}
        bgGradient="linear(to-r, purple.500, blue.400)"
        bgClip="text"
      >
        🚑 Health Status Overview
      </Text>

      {loading ? (
        <HStack justify="center" mt={10}>
          <Spinner size="lg" color="blue.500" />
        </HStack>
      ) : (
        <SimpleGrid columns={[1, 1, 2, 3]} spacing={6} pb={10}>
          {complexes.map((complex, idx) => (
            <Box
              key={idx}
              p={5}
              borderRadius="2xl"
              bgGradient="linear(to-r, blue.50, purple.50)"
              boxShadow="lg"
              borderLeft="6px solid #805AD5"
              _hover={{
                transform: 'scale(1.02)',
                cursor: complex.cabins.some((cabin) => cabin.fault_count > 0) ? 'pointer' : 'default',
                boxShadow: 'xl',
              }}
              transition="all 0.3s"
              onClick={() => {
                if (complex.cabins.some((cabin) => cabin.fault_count > 0)) {
                  openModal(complex);
                }
              }}
            >
              <HStack justify="space-between">
                <HStack spacing={2}>
                  <FaToilet color="#805AD5" />
                  <Text fontWeight="bold" color="blue.700" fontSize="lg">
                    {complex.complex_name}
                  </Text>
                </HStack>
              </HStack>

              <Text mt={2} fontSize="sm" color="gray.600">
                {complex.total_faulty_cabins} Faulty Cabin(s) reported.
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      )}



      <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="purple.600" color="white">
            🛠️ {selectedComplex?.complex_name} - Cabin Faults
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6} bg="gray.50">
            {selectedComplex?.cabins
              .filter((cabin) => cabin.fault_count > 0)
              .map((cabin, cIdx) => (
                <Box
                  key={cIdx}
                  p={4}
                  mb={5}
                  bg="white"
                  borderRadius="lg"
                  boxShadow="sm"
                  borderLeft="5px solid #805AD5"
                >
                  <Text fontWeight="semibold" mb={2} fontSize="md" color="gray.700">
                    🚻 Cabin: {cabin.cabin_name} ({cabin.fault_count} issues)
                  </Text>

                  <VStack align="start" spacing={3}>
                    {cabin.faults.map((fault, fIdx) => {
                      const [key, value] = fault.split(': ');
                      const cleanKey = key.trim();
                      const cleanValue = value.trim();

                      // Fetch the valid values for the fault key
                      const validValues = faultValidValues[cleanKey] || [];
                      // Check if the current value from API is strictly in the list, otherwise add it dynamically
                      const displayOptions = validValues.includes(cleanValue)
                        ? validValues
                        : [cleanValue, ...validValues]; // Add the unknown value to the top of the list

                      return (
                        <HStack
                          key={fIdx}
                          w="full"
                          p={2}
                          borderRadius="md"
                          bg="gray.100"
                          justify="space-between"
                        >
                          <Text flex={1} fontSize="sm" color="gray.700">
                            {cleanKey.replace('Health', '')}
                          </Text>

                          {userRole == 1 ? (
                            <Select
                              size="sm"
                              value={cleanValue}
                              onChange={(e) =>
                                handleUpdate(
                                  selectedComplex.complex_name,
                                  cabin.cabin_name,
                                  cleanKey,
                                  e.target.value
                                )
                              }
                              w="130px"
                              bg="white"
                            >
                              {displayOptions?.map((option, idx) => (
                                <option key={idx} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Select>
                          ) : (
                            <Text fontSize="sm" color="gray.700" w="130px" textAlign="right">
                              {cleanValue}
                            </Text>
                          )}
                        </HStack>
                      );
                    })}
                  </VStack>
                </Box>
              ))}
          </ModalBody>
        </ModalContent>
      </Modal>

    </Box>
  );
};

export default HealthStatus;