import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Heading,
  useToast,
  useColorModeValue,
  Image,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../../assets/img/logo.png'
import { BaseUrl } from 'utils/configurable';


export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BaseUrl}/user-login`,
        new URLSearchParams(formData),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );
      localStorage.setItem('token', res.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify(res?.data?.data?.permanent_sys_adm),
      );
      // Current time save karein (Milliseconds me)
      localStorage.setItem('loginTime', Date.now());
      navigate('/admin');
    } catch (err) {
      toast({
        title: 'Login Failed',
        description: err.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Flex
        direction="column"
        align="center"
        p="20px"
        borderBottom="1px solid"
        borderColor={useColorModeValue("gray.200", "gray.600")}
      >
        <Image
          src={Logo} // Add your logo image path here
          alt="Ak Jaladhija Logo"
          boxSize="50px" // Adjust the size as needed
          objectFit="contain" // Maintain aspect ratio
        />

        <Text fontSize="2xl" fontWeight="bold" color="blue.500">
          Jaladhija
        </Text>
      </Flex>
      <Flex align="center" justify="center" minHeight="100vh" bg="gray.100">
        <Box bg="white" p={8} rounded="md" boxShadow="lg" w="400px">
          <Heading mb={6} textAlign="center">
            Login
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={6} isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type='text'
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </InputGroup>
            </FormControl>
            <Button type="submit" colorScheme="blue" width="100%">
              Login
            </Button>
          </form>
        </Box>
      </Flex>
    </>
  );
}







