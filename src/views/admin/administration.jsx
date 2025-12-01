
import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Button,
  VStack,
  Image,
  Spacer,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  Link,
} from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import { BaseUrl } from 'utils/configurable';

const Administration = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const toast = useToast();

  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    contactnumber: '',
    permanent_sys_adm: '0',
    password: ""
  });

  const [userlist, setUserlist] = useState([]);
  const emp_role = JSON.parse(localStorage.getItem('user'));
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddMember = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BaseUrl}/user-add`, form, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (res?.data?.status == 1) {
        toast({ title: 'Team member added successfully', status: 'success' });
        onClose();
        setForm({
          firstname: '',
          lastname: '',
          email: '',
          contactnumber: '',
          permanent_sys_adm: '0',
          password: ""
        });
        userlistHandler();
      } else {
        toast({
          title: res?.data?.message || 'Failed to add',
          status: 'error',
        });
      }
    } catch (err) {
      toast({ title: 'Server error', status: 'error' });
      console.error(err);
    }
  };

  const userlistHandler = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BaseUrl}/user-list`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
      if (res?.data?.status == 1) {
        setUserlist(res?.data?.data);
      }
    } catch (error) {
    }
  };

  const MemberActiveInActive = async (user_id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BaseUrl}/User-Status-update`, user_id, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (res?.data) {
        userlistHandler()
      }
    } catch (err) {
    }
  };

  const handleDelete = async (user_id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BaseUrl}/user-delete`, { user_id }, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (res?.data?.status == 1) {
        toast({ title: 'User deleted successfully', status: 'success' });
        userlistHandler();
      } else {
        toast({
          title: res?.data?.message || 'Failed to delete',
          status: 'error',
        });
      }
    } catch (err) {
      toast({ title: 'Server error', status: 'error' });
      console.error(err);
    }
  };

  useEffect(() => {
    userlistHandler();
  }, []);

  const cellStyle = {
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #E2E8F0',
  };

  return (
    <Box marginTop={'120px'}>
      {/* Header */}
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        Administration
      </Text>

      {/* Top Section */}
      <Flex
        align="center"
        justify="space-between"
        p={4}
        bg="gray.100"
        borderRadius="md"
        boxShadow="sm"
        mb={6}
      >
        <Text fontSize="md" fontWeight="medium">
          Team Size: <b>{userlist?.length}</b>
        </Text>
        {emp_role === '1' && (
          <Button
            colorScheme="purple"
            variant="solid"
            leftIcon={<AddIcon />}
            onClick={onOpen}
          >
            Add Team Member
          </Button>
        )}
      </Flex>

      {userlist.length === 0 ? (
        <VStack
          spacing={4}
          bg="gray.50"
          py={10}
          borderRadius="lg"
          border="1px dashed #cbd5e0"
          align="center"
          justify="center"
        >
          <Image
            src="https://cdn.dribbble.com/users/1753953/screenshots/3818678/media/e0d9e06f66043a46c6a0983c9ddc799c.png"
            alt="empty state"
            maxW="200px"
            opacity={0.8}
          />
          <Text fontSize="xl" fontWeight="bold">
            Nothing!!
          </Text>
          <Text color="gray.500" fontSize="sm">
            Your collection list is empty
          </Text>
        </VStack>
      ) : (
        <Box overflowX="auto" borderRadius="lg" border="1px solid #e2e8f0">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#EDF2F7' }}>
                <th style={cellStyle}>Sr No.</th>
                <th style={cellStyle}>First Name</th>
                <th style={cellStyle}>Last Name</th>
                <th style={cellStyle}>Email</th>
                <th style={cellStyle}>Contact</th>
                <th style={cellStyle}>Admin Type</th>
                {emp_role == '1' && (
                  <th style={cellStyle}>Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {userlist.map((user, index) => (
                <tr key={user.id}>
                  <td style={cellStyle}>{index + 1}</td>
                  <td style={cellStyle}>{user.firstname}</td>
                  <td style={cellStyle}>{user.lastname}</td>
                  <td style={cellStyle}>{user.email}</td>
                  <td style={cellStyle}>{user.contactnumber}</td>
                  <td style={cellStyle}>
                    {user.permanent_sys_adm == '1' ? 'Super Admin' : 'User'}
                  </td>

                  {emp_role == '1' && (
                    <td style={cellStyle}>
                      <Button
                        colorScheme={user.isactive == '1' ? 'green' : 'red'}
                        size="sm"
                        onClick={() => MemberActiveInActive({ user_id: user.id })}
                      >
                        {user.isactive == '1' ? 'Active' : 'Inactive'}
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        ml={2}
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}

      {/* Modal for Non-Admins */}
      <Modal isOpen={isModalOpen} onClose={onModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Permission Denied</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              You need to be an Admin to add a team member. Please contact an admin for assistance.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onModalClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Team Member Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Team Member</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={3}>
              <FormLabel>First Name</FormLabel>
              <Input
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Last Name</FormLabel>
              <Input
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={3}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
            </FormControl>

            {/* <FormControl mb={3}>
              <FormLabel>Contact Number</FormLabel>
              <Input
                name="contactnumber"
                value={form.contactnumber}
                onChange={handleChange}
              />
            </FormControl> */}

            <FormControl mb={3}>
              <FormLabel>Admin Type</FormLabel>
              <Select
                name="permanent_sys_adm"
                value={form.permanent_sys_adm}
                onChange={handleChange}
              >
                <option value="1">Admin</option>
                <option value="0">User</option>
              </Select>
            </FormControl>
            <FormControl mb={3}>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="purple" onClick={handleAddMember}>
              Add Member
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Administration;

