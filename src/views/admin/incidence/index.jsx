import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { BaseUrl } from 'utils/configurable';

const ticketTabs = [
  { label: 'All Active Tickets', value: 'ACTIVE' },
  { label: 'Queued Tickets', value: 'QUEUED' },
  { label: 'Self-Assigned Tickets', value: 'SELF_ASSIGNED' },
  { label: 'Team-Assigned Tickets', value: 'TEAM_ASSIGNED' },
  { label: 'Closed Tickets', value: 'Closed' },
];

const TicketTabs = () => {
  const [selectedTab, setSelectedTab] = useState('ACTIVE');
  const [ticketList, setTicketList] = useState([]);
  const [siteList, setSiteList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [form, setForm] = useState({
    title: '',
    description: '',
    criticality: 'Medium',
    complex_id: '',
    cabin_name: '',
  });

  const selectedComplex = siteList.find((site) => site.id == form.complex_id);
  const client = selectedComplex?.client || '';

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetForm = () => {
    setForm({
      title: '',
      description: '',
      criticality: 'Medium',
      complex_id: '',
      cabin_name: '',
    });
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  const fetchTicketList = async (type) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `${BaseUrl}/ticket-list`,
        { type },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        },
      );
      setTicketList(
        Array.isArray(response?.data?.data) ? response.data.data : [],
      );
    } catch {
      setTicketList([]);
    }
  };

  const fetchSiteList = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${BaseUrl}/complex-list`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      setSiteList(
        Array.isArray(response?.data?.data) ? response.data.data : [],
      );
    } catch (error) {
      toast({ title: error.message, status: 'error' });
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await axios.post(
        `${BaseUrl}/ticket-create`,
        {
          ...form,
          user_id: user?.id,
          client,
          type: selectedTab === 'ACTIVE' ? 'RAISED' : selectedTab,
          city: 'GWALIOR',
          district: 'GWALIOR',
          state: 'MADHYA_PRADESH',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        },
      );
      if (response?.data) {
        toast({ title: 'Ticket Raised', status: 'success' });
        handleModalClose();
        fetchTicketList(selectedTab);
      } else {
        toast({
          title: response?.data?.message || 'Failed to raise ticket',
          status: 'error',
        });
      }
    } catch {
      toast({ title: 'Server Error', status: 'error' });
    }
  };

  useEffect(() => {
    fetchSiteList();
  }, []);

  useEffect(() => {
    fetchTicketList(selectedTab);
  }, [selectedTab]);

  return (
    <>
      <Box bg="#E2E8F0" minH="100vh" py={10} mt="100px">
        <Flex justify="flex-end" mb={4} px={6}>
          <Button
            colorScheme="blue"
            bg="#5f57f2"
            _hover={{ bg: '#4a44d4' }}
            onClick={onOpen}
          >
            Raise Ticket
          </Button>
        </Flex>

        <Tabs
          index={ticketTabs.findIndex((tab) => tab.value === selectedTab)}
          onChange={(index) => setSelectedTab(ticketTabs[index].value)}
          variant="enclosed"
          isFitted
          colorScheme="blue"
          bg="white"
          maxW="100%"
          mx="auto"
          borderRadius="lg"
          boxShadow="md"
        >
          <TabList bg="gray.200" borderTopRadius="lg">
            {ticketTabs.map((item) => (
              <Tab
                key={item.value}
                fontWeight="bold"
                _selected={{ color: 'white', bg: '#5f57f2' }}
                _hover={{ bg: '#5f57f2', color: 'white' }}
              >
                {item.label}
              </Tab>
            ))}
          </TabList>

          <TabPanels bg="white" p={4} borderBottomRadius="lg">
            {ticketTabs.map((item) => (
              <TabPanel key={item.value}>
                <Text
                  fontSize="lg"
                  fontWeight="semibold"
                  mb={4}
                  color="gray.800"
                >
                  {item.label}
                </Text>
                {ticketList.length > 0 ? (
                  ticketList.map((ticket) => (
                    <Box
                      key={ticket.ticket_id}
                      p={4}
                      border="1px solid"
                      borderColor="gray.300"
                      borderRadius="lg"
                      mb={4}
                      bg="linear-gradient(90deg, rgba(95,87,242,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"
                      boxShadow="sm"
                    >
                      <Text fontWeight="bold" fontSize="md" color="white">
                        {ticket.title}
                      </Text>
                      <Text fontSize="sm" color="white" mb={1}>
                        {ticket.description}
                      </Text>
                      <Text fontSize="xs" color="white">
                        Status: {ticket.status}
                      </Text>
                    </Box>
                  ))
                ) : (
                  <Box
                    textAlign="center"
                    bg="linear-gradient(90deg, rgba(95,87,242,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)"
                    color="white"
                    p={10}
                    borderRadius="lg"
                    boxShadow="sm"
                  >
                    <Text fontSize="lg" fontWeight="semibold">
                      No tickets found for this tab.
                    </Text>
                  </Box>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Box>

      {/* Modal for Raising Ticket */}
      <Modal isOpen={isOpen} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Raise a New Ticket</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter title"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Complex</FormLabel>
              <Select
                name="complex_id"
                value={form.complex_id}
                onChange={handleChange}
                placeholder="Select Complex"
              >
                {siteList.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* <FormControl mb={4}>
              <FormLabel>Cabin Name</FormLabel>
              <Input
                name="cabin_name"
                value={form.cabin_name}
                onChange={handleChange}
                placeholder="Enter Cabin Name"
              />
            </FormControl> */}


            <FormControl mb={4}>
              <FormLabel>Cabin Type</FormLabel>
              <Select
                name="cabin_type"
                value={form.cabin_type}
                onChange={handleChange}
                placeholder="Select Cabin Type"
              >
                <option value="MWC">MWC</option>
                <option value="FWC">FWC</option>
                <option value="MUR">MUR</option>
                <option value="PWC">PWC</option>
              </Select>
            </FormControl>


            <FormControl mb={4}>
              <FormLabel>Criticality</FormLabel>
              <Select
                name="criticality"
                value={form.criticality}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TicketTabs;
