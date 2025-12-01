import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';

const ConfigModal = ({ isOpen, onClose, configData, title }) => {
  if (!configData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title} Configuration</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {Object.entries(configData).map(([key, value]) => {
            if (
              key === "id" ||
              key === "cabin_id" ||
              key === "created_at" ||
              key === "updated_at"
            )
              return null;

            return (
              <FormControl key={key} mb={4}>
                <FormLabel textTransform="capitalize">{key}</FormLabel>
                <Input defaultValue={value} isReadOnly />
              </FormControl>
            );
          })}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};



export default ConfigModal;