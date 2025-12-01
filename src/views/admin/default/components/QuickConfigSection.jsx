import React, { useState } from 'react';
import {
  Box,
  Text,
  Flex,
  VStack,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Link,
  Select,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';

const QuickConfigSection = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [clientSelection, setClientSelection] = useState('');
  const [scopeConfig, setScopeConfig] = useState({
    maleWC: false,
    femaleWC: false,
    pdWC: false,
    maleUrinal: false,
  });
  const [preFlush, setPreFlush] = useState(false);
  const [flushDuration, setFlushDuration] = useState(0);
  const [activationDelay, setActivationDelay] = useState(0);
  const [automaticFullFlush, setAutomaticFullFlush] = useState(false);
  const [automaticMiniFlush, setAutomaticMiniFlush] = useState(false);

  const ConfigCard = ({ title }) => (
    <Box
      p="20px"
      bg="blue.500"
      color="white"
      fontSize="20px"
      fontWeight="bold"
      borderRadius="10px"
      position="relative"
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Text>{title}</Text>
        <Button
          fontSize="sm"
          color="black"
          bg="white"
          onClick={() => {
            setSelectedConfig(title);
            onOpen();
          }}
        >
          View
        </Button>
      </Flex>
      <Box
        bg="white"
        color="gray.700"
        fontSize="16px"
        fontWeight="normal"
        borderRadius="10px"
        p={3}
      >
        Configure payment charge and payment mode settings in one go.
      </Box>
    </Box>
  );

  // Handle changes in the form elements
  const handleScopeConfigChange = (e) => {
    const { name, checked } = e.target;
    setScopeConfig((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleClientSelectionChange = (e) => {
    setClientSelection(e.target.value);
  };

  const handlePreFlushChange = () => {
    setPreFlush(!preFlush);
  };

  const handleFlushDurationChange = (e) => {
    setFlushDuration(e.target.value);
  };

  const handleActivationDelayChange = (e) => {
    setActivationDelay(e.target.value);
  };

  const handleAutomaticFullFlushChange = () => {
    setAutomaticFullFlush(!automaticFullFlush);
  };

  const handleAutomaticMiniFlushChange = () => {
    setAutomaticMiniFlush(!automaticMiniFlush);
  };

  return (
    <VStack align="stretch" spacing={4} mt={8}>
      <Text fontSize="xl" fontWeight="semibold">
        Quick Config
      </Text>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
        <ConfigCard title="Flush Config" />
        <ConfigCard title="Floor Clean Config" />
        <ConfigCard title="Light and Fan Config" />
      </SimpleGrid>

      {/* Modal with Tabs */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedConfig} - Settings
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant="enclosed">
              <TabList>
                <Tab>Pre Flush</Tab>
                <Tab>Mini Flush</Tab>
                <Tab>Full Flush</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Text mb={4}>
                    Below listed parameters control the Usage Charge and Payment Mode settings for the units.
                    The changes made here will take effect for all the units/cabins as per the selections made in the Config-Scope Section.
                  </Text>

                  {/* Client Selection */}
                  <FormControl mb={4}>
                    <FormLabel>Client Selection</FormLabel>
                    <Select
                      value={clientSelection}
                      onChange={handleClientSelectionChange}
                    >
                      <option value="">Please Select</option>
                      <option value="client1">Client 1</option>
                      <option value="client2">Client 2</option>
                    </Select>
                  </FormControl>

                  {/* Scope Config */}
                  <FormControl mb={4}>
                    <FormLabel>Scope Config</FormLabel>
                    <Checkbox
                      name="maleWC"
                      isChecked={scopeConfig.maleWC}
                      onChange={handleScopeConfigChange}
                    >
                      Male WC
                    </Checkbox>
                    <Checkbox
                      name="femaleWC"
                      isChecked={scopeConfig.femaleWC}
                      onChange={handleScopeConfigChange}
                    >
                      Female WC
                    </Checkbox>
                    <Checkbox
                      name="pdWC"
                      isChecked={scopeConfig.pdWC}
                      onChange={handleScopeConfigChange}
                    >
                      PD WC
                    </Checkbox>
                    <Checkbox
                      name="maleUrinal"
                      isChecked={scopeConfig.maleUrinal}
                      onChange={handleScopeConfigChange}
                    >
                      Male Urinal
                    </Checkbox>
                  </FormControl>

                  {/* Automatic Pre-Flush */}
                  <FormControl mb={4}>
                    <FormLabel>Automatic Pre-Flush</FormLabel>
                    <Checkbox isChecked={preFlush} onChange={handlePreFlushChange}>
                      Pre-Flush
                    </Checkbox>
                  </FormControl>
                </TabPanel>

                <TabPanel>
                  <Text mb={4}>
                    Below listed parameters control the Usage Charge and Payment Mode settings for the units.
                    The changes made here will take effect for all the units/cabins as per the selections made in the Config-Scope Section.
                  </Text>

                  {/* Client Selection */}
                  <FormControl mb={4}>
                    <FormLabel>Client Selection</FormLabel>
                    <Select
                      value={clientSelection}
                      onChange={handleClientSelectionChange}
                    >
                      <option value="">Please Select</option>
                      <option value="client1">Client 1</option>
                      <option value="client2">Client 2</option>
                    </Select>
                  </FormControl>

                  {/* Scope Config */}
                  <FormControl mb={4}>
                    <FormLabel>Scope Config</FormLabel>
                    <Checkbox
                      name="maleWC"
                      isChecked={scopeConfig.maleWC}
                      onChange={handleScopeConfigChange}
                    >
                      Male WC
                    </Checkbox>
                    <Checkbox
                      name="femaleWC"
                      isChecked={scopeConfig.femaleWC}
                      onChange={handleScopeConfigChange}
                    >
                      Female WC
                    </Checkbox>
                    <Checkbox
                      name="pdWC"
                      isChecked={scopeConfig.pdWC}
                      onChange={handleScopeConfigChange}
                    >
                      PD WC
                    </Checkbox>
                    <Checkbox
                      name="maleUrinal"
                      isChecked={scopeConfig.maleUrinal}
                      onChange={handleScopeConfigChange}
                    >
                      Male Urinal
                    </Checkbox>
                  </FormControl>

                  {/* Automatic Mini-Flush */}
                  <FormControl mb={4}>
                    <FormLabel>Automatic Mini-Flush</FormLabel>
                    <Checkbox isChecked={automaticMiniFlush} onChange={handleAutomaticMiniFlushChange}>
                      Mini-Flush
                    </Checkbox>
                  </FormControl>

                  {/* Flush Duration */}
                  <FormControl mb={4}>
                    <FormLabel>Flush Duration</FormLabel>
                    <Input
                      type="number"
                      value={flushDuration}
                      onChange={handleFlushDurationChange}
                      min="0"
                      max="3600"
                    />
                    <Text fontSize="sm" color="gray.500">
                      Duration in seconds.
                    </Text>
                  </FormControl>

                  {/* Activation Delay */}
                  <FormControl mb={4}>
                    <FormLabel>Activation Delay</FormLabel>
                    <Input
                      type="number"
                      value={activationDelay}
                      onChange={handleActivationDelayChange}
                      min="0"
                      max="3600"
                    />
                    <Text fontSize="sm" color="gray.500">
                      Delay in seconds.
                    </Text>
                  </FormControl>
                </TabPanel>

                <TabPanel>
                  <Text mb={4}>
                    Below listed parameters control the Usage Charge and Payment Mode settings for the units.
                    The changes made here will take effect for all the units/cabins as per the selections made in the Config-Scope Section.
                  </Text>

                  {/* Client Selection */}
                  <FormControl mb={4}>
                    <FormLabel>Client Selection</FormLabel>
                    <Select
                      value={clientSelection}
                      onChange={handleClientSelectionChange}
                    >
                      <option value="">Please Select</option>
                      <option value="client1">Client 1</option>
                      <option value="client2">Client 2</option>
                    </Select>
                  </FormControl>

                  {/* Scope Config */}
                  <FormControl mb={4}>
                    <FormLabel>Scope Config</FormLabel>
                    <Checkbox
                      name="maleWC"
                      isChecked={scopeConfig.maleWC}
                      onChange={handleScopeConfigChange}
                    >
                      Male WC
                    </Checkbox>
                    <Checkbox
                      name="femaleWC"
                      isChecked={scopeConfig.femaleWC}
                      onChange={handleScopeConfigChange}
                    >
                      Female WC
                    </Checkbox>
                    <Checkbox
                      name="pdWC"
                      isChecked={scopeConfig.pdWC}
                      onChange={handleScopeConfigChange}
                    >
                      PD WC
                    </Checkbox>
                    <Checkbox
                      name="maleUrinal"
                      isChecked={scopeConfig.maleUrinal}
                      onChange={handleScopeConfigChange}
                    >
                      Male Urinal
                    </Checkbox>
                  </FormControl>

                  {/* Automatic Full-Flush */}
                  <FormControl mb={4}>
                    <FormLabel>Automatic Full-Flush</FormLabel>
                    <Checkbox isChecked={automaticFullFlush} onChange={handleAutomaticFullFlushChange}>
                      Full-Flush
                    </Checkbox>
                  </FormControl>

                  {/* Flush Duration */}
                  <FormControl mb={4}>
                    <FormLabel>Flush Duration</FormLabel>
                    <Input
                      type="number"
                      value={flushDuration}
                      onChange={handleFlushDurationChange}
                      min="0"
                      max="3600"
                    />
                    <Text fontSize="sm" color="gray.500">
                      Duration in seconds.
                    </Text>
                  </FormControl>

                  {/* Activation Delay */}
                  <FormControl mb={4}>
                    <FormLabel>Activation Delay</FormLabel>
                    <Input
                      type="number"
                      value={activationDelay}
                      onChange={handleActivationDelayChange}
                      min="0"
                      max="3600"
                    />
                    <Text fontSize="sm" color="gray.500">
                      Delay in seconds.
                    </Text>
                  </FormControl>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>

          <ModalFooter>
           
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default QuickConfigSection;
