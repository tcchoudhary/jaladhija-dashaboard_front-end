import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Avatar,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
  Text,
  VStack,
  Flex,
  Divider,
} from '@chakra-ui/react';
import banner from 'assets/img/auth/banner.png';
import avatarDefault from 'assets/img/avatars/avatar4.png';
import { BaseUrl } from 'utils/configurable';
import { DocUrl } from 'utils/configurable';
import axios from 'axios';

export default function Overview() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(avatarDefault);

  const userDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BaseUrl}/User-details`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });
      if(res?.data){
        setUser(res?.data?.data)
      }else{
        setUser(null)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    userDetails()
  }, []);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!selectedFile) return;
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${BaseUrl}/profile-update`, {
        method: 'POST',
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        const newPath = `${BaseUrl}/${result.data.profileimg_path}`;
        setProfileImage(newPath);
        const updatedUser = {
          ...user,
          profileimg_path: result.data.profileimg_path,
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        console.error('Upload failed:', result);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
    }

    onClose();
  };

  if (!user) return null;

  return (
    <Box pt={{ base: '100px', md: '80px', xl: '80px' }} px={4}>
      <Grid
        templateColumns="1fr"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        maxW="600px"
        mx="auto"
        bg="white"
        boxShadow="lg"
        borderRadius="lg"
        overflow="hidden"
      >
        <Box
          bgImage={`url(${banner})`}
          bgSize="cover"
          bgPosition="center"
          p={6}
        >
          <Flex direction="column" align="center" gap={2}>
            <Box onClick={onOpen} cursor="pointer">
              <Avatar size="2xl" name={user.firstname} src={user?.profileimg_path ? `${DocUrl}/${user.profileimg_path}`:avatarDefault} />
              <Text fontSize="sm" mt={2} color="whiteAlpha.800">
                Click to update profile picture
              </Text>
            </Box>
            <Text fontSize="2xl" fontWeight="bold" color="white">
              {user.firstname} {user.lastname}
            </Text>
          </Flex>
        </Box>

        <VStack spacing={3} p={6} align="stretch" textAlign="left">
          <Text fontSize="lg" fontWeight="semibold">
            User Information
          </Text>
          <Divider />

          <Flex justify="space-between">
            <Text color="gray.600">Email:</Text>
            <Text fontWeight="medium">{user.email}</Text>
          </Flex>

          <Flex justify="space-between">
            <Text color="gray.600">Phone:</Text>
            <Text fontWeight="medium">{user.contactnumber}</Text>
          </Flex>

          <Flex justify="space-between">
            <Text color="gray.600">User ID:</Text>
            <Text fontWeight="medium">{user.id}</Text>
          </Flex>

          <Flex justify="space-between">
            <Text color="gray.600">Account Active:</Text>
            <Text fontWeight="medium">
              {user.isactive === 1 ? 'Yes' : 'No'}
            </Text>
          </Flex>
        </VStack>
      </Grid>

      {/* Modal for image update */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Profile Picture</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {previewImage && (
              <Image
                src={previewImage}
                alt="Preview"
                mb={4}
                borderRadius="md"
                maxH="200px"
                objectFit="cover"
              />
            )}
            <Input type="file" accept="image/*" onChange={handleImageChange} />
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUpdate}
              isDisabled={!selectedFile}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
