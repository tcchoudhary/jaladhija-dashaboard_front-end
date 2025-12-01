/*eslint-disable*/
import React from 'react';
import { Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';

export default function Footer() {
  const textColor = useColorModeValue('gray.400', 'white');
  return (
    <Flex
      zIndex="3"
      flexDirection={{
        base: 'column',
        xl: 'row',
      }}
      alignItems={{
        base: 'center',
        xl: 'start',
      }}
      justifyContent="center"
      px={{ base: '30px', md: '50px' }}
      pb="30px"
    >
      <Text
        color={textColor}
        textAlign={{
          base: 'center',
          xl: 'start',
        }}
        mb={{ base: '20px', xl: '0px' }}
      >
        {' '}
        &copy; {1900 + new Date().getYear()}
        <Text  fontWeight="500" ms="4px" textAlign="center">
          All Rights Reserved. Made with love by Tc Choudhary
          <Link
            mx="3px"
            color={textColor}
            target="_blank"
            fontWeight="700"
          ></Link>
        </Text>
      </Text>
    </Flex>
  );
}
