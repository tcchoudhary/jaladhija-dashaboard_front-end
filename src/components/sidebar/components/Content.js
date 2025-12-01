

import { Box, Flex, Stack } from "@chakra-ui/react";
import Links from "components/sidebar/components/Links";
import React from "react";

function SidebarContent(props) {
  const { routes } = props;
  // SIDEBAR
  return (
    <Flex direction='column' height='100%' pt='25px' px="16px" borderRadius='30px'>
      <Stack direction='column' mb='auto' mt='8px'>
        <Box ps='20px' pe={{ md: "16px", "2xl": "1px" }}>
          <Links routes={routes} />
        </Box>
      </Stack>

      <Box
        mt='60px'
        mb='40px'
        borderRadius='30px'>
        {/* <SidebarCard /> */}
      </Box>
    </Flex>
  );
}

export default SidebarContent;
