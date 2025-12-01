// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Text,
//   VStack,
//   SimpleGrid,
//   Flex,
//   Stat,
//   StatLabel,
//   useToast,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalCloseButton,
//   ModalBody,
//   ModalFooter,
//   Button,
//   Select,
//   useDisclosure,
// } from '@chakra-ui/react';
// import axios from 'axios';
// import { RepeatIcon } from '@chakra-ui/icons';
// import { BaseUrl } from 'utils/configurable';
// const StatusCard = ({
//   complex_id,
//   complex_name,
//   total_cabins,
//   online_cabins,
//   offline_cabins,
//   offline_cabin_names,
//   emp_role,
//   onUpdateClick,
// }) => (
//   <Box
//     p={5}
//     borderRadius="2xl"
//     bgGradient="linear(to-br, purple.500, blue.500)"
//     color="white"
//     boxShadow="xl"
//     transition="all 0.3s"
//     _hover={{ transform: 'scale(1.02)', boxShadow: '2xl' }}
//   >
//     <Text fontSize="lg" fontWeight="bold" mb={2}>
//       {complex_name.replace(/_/g, ' ')}
//     </Text>
//     <Flex justify="space-between">
//       <Stat>
//         <StatLabel>{offline_cabins} Offline Cabin(s) reported.</StatLabel>
//       </Stat>
//     </Flex>

//     {emp_role === '1' && offline_cabins > 0 && (
//       <Box mt={4}>
//         <Button
//           leftIcon={<RepeatIcon />}
//           mt={3}
//           size="sm"
//           bg="white"
//           color="purple.600"
//           fontWeight="bold"
//           _hover={{ bg: 'purple.200' }}
//           onClick={() =>
//             onUpdateClick({ complex_id, complex_name, offline_cabin_names })
//           }
//         >
//           Update Status
//         </Button>
//       </Box>
//     )}
//   </Box>
// );

// const LiveStatus = () => {
//   const [data, setData] = useState({
//     complexes: [],
//     total_cabins: 0,
//     total_online: 0,
//     total_offline: 0,
//   });
//   const [selectedComplex, setSelectedComplex] = useState(null);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const toast = useToast();
//   const emp_role = JSON.parse(localStorage.getItem('user'));


//   // Function to fetch the live status of the system
//   const fetchStatus = async () => {
//     try {
//       const token = localStorage.getItem('token');

//       // Make a GET request to fetch the live status
//       const res = await axios.get(`${BaseUrl}/live-status`, {
//         headers: {
//           Authorization: token, // Use 'Bearer' prefix for better clarity in token-based auth
//         },
//       });

//       // Check if the status is successful and update the state accordingly
//       if (res.data) {
//         setData(res.data); // Update state with the fetched data
//       } else {
//         toast({
//           title: res.data.message || 'Failed to fetch status',
//           status: 'error',
//           isClosable: true,
//           position: 'top',
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching status:', error); // Log the error for debugging
//       toast({
//         title: 'API Error',
//         description: error?.message || 'Something went wrong while fetching the status.',
//         status: 'error',
//         isClosable: true,
//         position: 'top',
//       });
//     }
//   };

//   // Function to handle cabin status update
//   const handleCabinStatusUpdate = async (complex_id, cabin_name, newStatus) => {
//     try {
//       const token = localStorage.getItem('token');

//       // Make a POST request to update the cabin status
//       const res = await axios.post(
//         `${BaseUrl}/update-single-live-status`,
//         {
//           complex_id,
//           cabin_name,
//           status: newStatus,
//         },
//         {
//           headers: {
//             Authorization: token, // Use 'Bearer' prefix for consistency
//           },
//         }
//       );

//       // Show a success toast after the update
//       toast({
//         title: res.data.message || 'Cabin Status Updated',
//         status: 'success',
//         isClosable: true,
//         position: 'top',
//       });

//       // Fetch the updated status after update
//       fetchStatus();
//       onClose(); // Close the modal (assuming onClose is a function to close the modal)
//     } catch (err) {
//       console.error('Error updating cabin status:', err); // Log the error for debugging
//       toast({
//         title: 'Failed to update cabin status',
//         description: err?.message || 'An error occurred while updating the cabin status.',
//         status: 'error',
//         isClosable: true,
//         position: 'top',
//       });
//     }
//   };


//   useEffect(() => {
//     fetchStatus();
//   }, []);

//   return (
//     <VStack align="stretch" spacing={6} px={4}>
//       <Text fontSize="2xl" fontWeight="bold" mt={4}>
//         Live Status
//       </Text>
//       <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
//         {data.complexes.map((complex) => (
//           <StatusCard
//             key={complex.complex_id}
//             {...complex}
//             emp_role={emp_role}
//             onUpdateClick={(c) => {
//               setSelectedComplex({
//                 complex_id: c.complex_id,
//                 complex_name: c.complex_name,
//                 offline_cabin_names: c.offline_cabin_names || [],
//               });
//               onOpen();
//             }}
//           />
//         ))}
//       </SimpleGrid>

//       {/* Update Modal */}
//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>
//             Update Cabin Status - {selectedComplex?.complex_name}
//           </ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             {selectedComplex?.offline_cabin_names?.length > 0 ? (
//               selectedComplex.offline_cabin_names.map((cabin, idx) => (
//                 <Box key={idx} mb={4}>
//                   <Text fontWeight="medium" mb={2}>
//                     {cabin}
//                   </Text>
//                   <Select
//                     placeholder="Select Reason"
//                     onChange={(e) =>
//                       handleCabinStatusUpdate(
//                         selectedComplex.complex_id,
//                         cabin,
//                         e.target.value,
//                       )
//                     }
//                   >
//                     <option value="Working">Working</option>
//                     <option value="Low data network">Low data network</option>
//                     <option value="ONLINE">Online</option>
//                     <option value="OFFLINE">Offline</option>
//                   </Select>
//                 </Box>
//               ))
//             ) : (
//               <Text>No offline cabins found.</Text>
//             )}
//           </ModalBody>
//           <ModalFooter>
//             <Button onClick={onClose}>Close</Button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </VStack>
//   );
// };

// export default LiveStatus;



import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  SimpleGrid,
  Flex,
  Stat,
  StatLabel,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  useDisclosure,
} from '@chakra-ui/react';
import axios from 'axios';
import { RepeatIcon } from '@chakra-ui/icons';
import { BaseUrl } from 'utils/configurable';
const StatusCard = ({
  complex_id,
  complex_name,
  total_cabins,
  online_cabins,
  offline_cabins,
  offline_cabin_names,
  emp_role,
  onUpdateClick,
}) => (
  <Box
    p={5}
    borderRadius="2xl"
    bgGradient="linear(to-br, purple.500, blue.500)"
    color="white"
    boxShadow="xl"
    transition="all 0.3s"
    _hover={{ transform: 'scale(1.02)', boxShadow: '2xl' }}
    cursor={offline_cabins > 0 ? 'pointer' : 'default'}
    onClick={() => offline_cabins > 0 && onUpdateClick({ complex_id, complex_name, offline_cabin_names })}
  >
    <Text fontSize="lg" fontWeight="bold" mb={2}>
      {complex_name.replace(/_/g, ' ')}
    </Text>
    <Flex justify="space-between">
      <Stat>
        <StatLabel>{offline_cabins} Offline Cabin(s) reported.</StatLabel>
      </Stat>
    </Flex>

    {emp_role === '1' && offline_cabins > 0 && (
      <Box mt={4}>
        <Button
          leftIcon={<RepeatIcon />}
          mt={3}
          size="sm"
          bg="white"
          color="purple.600"
          fontWeight="bold"
          _hover={{ bg: 'purple.200' }}
          onClick={(e) => {
            e.stopPropagation();
            onUpdateClick({ complex_id, complex_name, offline_cabin_names });
          }}
        >
          Update Status
        </Button>
      </Box>
    )}
  </Box>
);

const LiveStatus = () => {
  const [data, setData] = useState({
    complexes: [],
    total_cabins: 0,
    total_online: 0,
    total_offline: 0,
  });
  const [selectedComplex, setSelectedComplex] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const emp_role = JSON.parse(localStorage.getItem('user'));


  // Function to fetch the live status of the system
  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem('token');

      // Make a GET request to fetch the live status
      const res = await axios.get(`${BaseUrl}/live-status`, {
        headers: {
          Authorization: token, // Use 'Bearer' prefix for better clarity in token-based auth
        },
      });

      // Check if the status is successful and update the state accordingly
      if (res.data) {
        setData(res.data); // Update state with the fetched data
      } else {
        toast({
          title: res.data.message || 'Failed to fetch status',
          status: 'error',
          isClosable: true,
          position: 'top',
        });
      }
    } catch (error) {
      console.error('Error fetching status:', error); // Log the error for debugging
      toast({
        title: 'API Error',
        description: error?.message || 'Something went wrong while fetching the status.',
        status: 'error',
        isClosable: true,
        position: 'top',
      });
    }
  };

  // Function to handle cabin status update
  const handleCabinStatusUpdate = async (complex_id, cabin_name, newStatus) => {
    try {
      const token = localStorage.getItem('token');

      // Make a POST request to update the cabin status
      const res = await axios.post(
        `${BaseUrl}/update-single-live-status`,
        {
          complex_id,
          cabin_name,
          status: newStatus,
        },
        {
          headers: {
            Authorization: token, // Use 'Bearer' prefix for consistency
          },
        }
      );

      // Show a success toast after the update
      toast({
        title: res.data.message || 'Cabin Status Updated',
        status: 'success',
        isClosable: true,
        position: 'top',
      });

      // Fetch the updated status after update
      fetchStatus();
      onClose(); // Close the modal (assuming onClose is a function to close the modal)
    } catch (err) {
      console.error('Error updating cabin status:', err); // Log the error for debugging
      toast({
        title: 'Failed to update cabin status',
        description: err?.message || 'An error occurred while updating the cabin status.',
        status: 'error',
        isClosable: true,
        position: 'top',
      });
    }
  };


  useEffect(() => {
    fetchStatus();
  }, []);

  return (
    <VStack align="stretch" spacing={6} px={4}>
      <Text fontSize="2xl" fontWeight="bold" mt={4}>
        Live Status
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {data.complexes.map((complex) => (
          <StatusCard
            key={complex.complex_id}
            {...complex}
            emp_role={emp_role}
            onUpdateClick={(c) => {
              setSelectedComplex({
                complex_id: c.complex_id,
                complex_name: c.complex_name,
                offline_cabin_names: c.offline_cabin_names || [],
              });
              onOpen();
            }}
          />
        ))}
      </SimpleGrid>

      {/* Update Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Update Cabin Status - {selectedComplex?.complex_name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedComplex?.offline_cabin_names?.length > 0 ? (
              selectedComplex.offline_cabin_names.map((cabin, idx) => (
                <Box key={idx} mb={4}>
                  <Text fontWeight="medium" mb={2}>
                    {cabin}
                  </Text>
                  {emp_role === '1' ? (
                    <Select
                      placeholder="Select Status"
                      onChange={(e) =>
                        handleCabinStatusUpdate(
                          selectedComplex.complex_id,
                          cabin,
                          e.target.value,
                        )
                      }
                    >
                      <option value="Working">Working</option>
                      <option value="Low data network">Low data network</option>
                      <option value="ONLINE">Online</option>
                      <option value="OFFLINE">Offline</option>
                    </Select>
                  ) : (
                    <Text fontSize="sm" color="gray.600">
                      Status: Offline
                    </Text>
                  )}
                </Box>
              ))
            ) : (
              <Text>No offline cabins found.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default LiveStatus;