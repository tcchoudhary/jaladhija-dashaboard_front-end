// import React, { useEffect, useState } from 'react';
// import {
//   Box,
//   Text,
//   VStack,
//   Flex,
//   Icon,
//   Card,
//   useToast,
//   Modal,
//   ModalOverlay,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalCloseButton,
//   Select,
//   Button,
// } from '@chakra-ui/react';
// import { FaRegSmileBeam } from 'react-icons/fa';
// import axios from 'axios';
// import { BaseUrl } from 'utils/configurable';

// const ActiveTickets = () => {
//   const [Ticketlist, setTicketlist] = useState([]);
//   const [selectedTicket, setSelectedTicket] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const toast = useToast();

//   const token = localStorage.getItem('token');
//   const userRole = JSON.parse(localStorage.getItem('user')); // 1 = admin
//   const handleTicket = async () => {
//     try {
//      const response = await axios.post(
//         `${BaseUrl}/ticket-list`, 
//         {}, 
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: token,
//           },
//         }
//       );

//       if (Array.isArray(response?.data?.data)) {
//         setTicketlist(response.data.data);
//       } else {
//         setTicketlist([]);
//       }
//     } catch (error) {
//       console.error('API Error:', error);
//       setTicketlist([]);
//     }
//   };

//   const handleTicketClick = (ticket) => {
//     setSelectedTicket(ticket);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setSelectedTicket(null);
//   };

//   const handleStatusUpdate = async (newStatus) => {
//     try {
//       await axios.post(
//         `${BaseUrl}/ticket-status-update`,
//         {
//           ticket_id: selectedTicket.ticket_id,
//           status: newStatus,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: token,
//           },
//         }
//       );
//       toast({ title: 'Status updated successfully', status: 'success' });
//       closeModal();
//       handleTicket(); // refresh
//     } catch (err) {
//       console.error('Update Error:', err);
//       toast({ title: 'Failed to update status', status: 'error' });
//     }
//   };

//   useEffect(() => {
//     handleTicket();
//   }, []);

//   return (
//     <VStack align="stretch" spacing={6} px={4} py={6}>
//       <Text fontSize="2xl" fontWeight="bold" color="teal.700">
//         🎫 Active Tickets
//       </Text>

//       {Array.isArray(Ticketlist) && Ticketlist.length > 0 ? (
//         Ticketlist.map((ticket) => (
//           <Box
//             key={ticket.ticket_id}
//             p="4"
//             borderRadius="xl"
//             bg="linear-gradient(90deg, rgba(93, 12, 255, 1) 0%, rgba(155, 0, 250, 1) 50%, rgba(0, 255, 255, 1) 100%)"
//             boxShadow="lg"
//             color="white"
//             transition="all 0.2s"
//             _hover={{ transform: 'scale(1.02)', cursor: 'pointer' }}
//             onClick={() => handleTicketClick(ticket)}
//           >
//             <Text fontWeight="bold" fontSize="lg">
//               {ticket.title}
//             </Text>
//             <Text fontSize="sm" mt={1}>
//               {ticket.description}
//             </Text>
//             <Text fontSize="xs" mt={2}>
//               Status: <strong>{ticket.status}</strong>
//             </Text>
//           </Box>
//         ))
//       ) : (
//         <Card h="180px" position="relative" display="flex" alignItems="center">
//           <Flex flex="1" justify="center">
//             <Icon as={FaRegSmileBeam} boxSize="110px" opacity={0.25} />
//           </Flex>
//           <Text position="absolute" right="40px">
//             No active tickets listed. Tickets once generated will be listed here.
//           </Text>
//           <Card
//             position="absolute"
//             top="12px"
//             right="12px"
//             p="6px 10px"
//             fontSize="14px"
//             fontWeight="semibold"
//             bg="white"
//             color="blue"
//           >
//             All units working fine
//           </Card>
//         </Card>
//       )}

//       <Modal isOpen={isModalOpen} onClose={closeModal} size="lg" isCentered>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader bg="purple.600" color="white">
//             🎫 Ticket Details
//           </ModalHeader>
//           <ModalCloseButton color="white" />
//           <ModalBody pb={6}>
//             {selectedTicket && (
//               <VStack align="stretch" spacing={4}>
//                 <Box>
//                   <Text fontWeight="bold">Title:</Text>
//                   <Text>{selectedTicket.title}</Text>
//                 </Box>
//                 <Box>
//                   <Text fontWeight="bold">Description:</Text>
//                   <Text>{selectedTicket.description}</Text>
//                 </Box>
//                 <Box>
//                   <Text fontWeight="bold">Status:</Text>
//                   {userRole == 1 ? (
//                     <Select
//                       value={selectedTicket.status}
//                       onChange={(e) => handleStatusUpdate(e.target.value)}
//                     >
//                       <option value="Active">Active</option>
//                       <option value="In Progress">In Progress</option>
//                       <option value="Queued">Queued</option>
//                       <option value="Closed">Closed</option>
//                     </Select>
//                   ) : (
//                     <Text>{selectedTicket.status}</Text>
//                   )}
//                 </Box>
//               </VStack>
//             )}
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </VStack>
//   );
// };

// export default ActiveTickets;


import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  VStack,
  Flex,
  Icon,
  Card,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
  Button,
} from '@chakra-ui/react';
import { FaRegSmileBeam } from 'react-icons/fa';
import axios from 'axios';
import { BaseUrl } from 'utils/configurable';

const ActiveTickets = () => {
  const [Ticketlist, setTicketlist] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast();

  const token = localStorage.getItem('token');
  const userRole = JSON.parse(localStorage.getItem('user')); // 1 = admin
  const handleTicket = async () => {
    try {
      const response = await axios.post(
        `${BaseUrl}/ticket-list`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );

      if (Array.isArray(response?.data?.data)) {
        setTicketlist(response.data.data);
      } else {
        setTicketlist([]);
      }
    } catch (error) {
      console.error('API Error:', error);
      setTicketlist([]);
    }
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await axios.post(
        `${BaseUrl}/ticket-status-update`,
        {
          ticket_id: selectedTicket.ticket_id,
          status: newStatus,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      );
      toast({ title: 'Status updated successfully', status: 'success' });
      closeModal();
      handleTicket(); // refresh
    } catch (err) {
      console.error('Update Error:', err);
      toast({ title: 'Failed to update status', status: 'error' });
    }
  };

  useEffect(() => {
    handleTicket();
  }, []);

  return (
    <VStack align="stretch" spacing={6} px={4} py={6}>
      <Text fontSize="2xl" fontWeight="bold" color="teal.700">
        🎫 Active Tickets
      </Text>

      {Array.isArray(Ticketlist) && Ticketlist.length > 0 ? (
        Ticketlist.map((ticket) => (
          <Box
            key={ticket.ticket_id}
            p="4"
            borderRadius="xl"
            bg="linear-gradient(90deg, rgba(93, 12, 255, 1) 0%, rgba(155, 0, 250, 1) 50%, rgba(0, 255, 255, 1) 100%)"
            boxShadow="lg"
            color="white"
            transition="all 0.2s"
            _hover={{ transform: 'scale(1.02)', cursor: 'pointer' }}
            onClick={() => handleTicketClick(ticket)}
          >
            <Text fontWeight="bold" fontSize="lg">
              {ticket.title}
            </Text>
            {ticket.description && (
              <Text fontSize="sm" mt={1}>
                {ticket.description}
              </Text>
            )}
            <Flex mt={2} direction="column" gap={1}>
              <Text fontSize="xs">
                User: <strong>{ticket.user_firstname} {ticket.user_lastname}</strong>
              </Text>
              <Text fontSize="xs">
                Complex: <strong>{ticket.complex_name}</strong>
              </Text>
              <Text fontSize="xs">
                Created: <strong>{new Date(ticket.created_at).toLocaleDateString()}</strong>
              </Text>
              <Text fontSize="xs">
                Status: <strong>{ticket.status}</strong>
              </Text>
            </Flex>
          </Box>
        ))
      ) : (
        <Card h="180px" position="relative" display="flex" alignItems="center">
          <Flex flex="1" justify="center">
            <Icon as={FaRegSmileBeam} boxSize="110px" opacity={0.25} />
          </Flex>
          <Text position="absolute" right="40px">
            No active tickets listed. Tickets once generated will be listed here.
          </Text>
          <Card
            position="absolute"
            top="12px"
            right="12px"
            p="6px 10px"
            fontSize="14px"
            fontWeight="semibold"
            bg="white"
            color="blue"
          >
            All units working fine
          </Card>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader bg="purple.600" color="white">
            🎫 Ticket Details
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody pb={6}>
            {selectedTicket && (
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold">Title:</Text>
                  <Text>{selectedTicket.title}</Text>
                </Box>
                {selectedTicket.description && (
                  <Box>
                    <Text fontWeight="bold">Description:</Text>
                    <Text>{selectedTicket.description}</Text>
                  </Box>
                )}
                <Box>
                  <Text fontWeight="bold">User:</Text>
                  <Text>{selectedTicket.user_firstname} {selectedTicket.user_lastname}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Complex:</Text>
                  <Text>{selectedTicket.complex_name}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Created At:</Text>
                  <Text>{new Date(selectedTicket.created_at).toLocaleString()}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Status:</Text>
                  {userRole == 1 ? (
                    <Select
                      value={selectedTicket.status}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                    >
                      <option value="Active">Active</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Queued">Queued</option>
                      <option value="Closed">Closed</option>
                    </Select>
                  ) : (
                    <Text>{selectedTicket.status}</Text>
                  )}
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ActiveTickets;