import React, { useState } from "react";
import { Button, IconButton, Modal, Portal, Text } from "react-native-paper";

interface CustomModalProps {
  onPress: () => void
  title: string
  trigger?: React.ReactNode;
  primaryButtonLabel?: string;
  children?: React.ReactNode;
}

const CustomModal = ({ onPress, title, trigger, primaryButtonLabel, children }: CustomModalProps) => {
  const [visibleModal, setVisibleModal] = useState(false);

  const handleDelete = () => {
    onPress();
    setVisibleModal(false);
  };

  return (
    <>
      <Portal>
        <Modal visible={visibleModal} onDismiss={() => setVisibleModal(false)} contentContainerStyle={{ backgroundColor: 'white', padding: 20, gap: 16 }}>
          <Text variant="bodyMedium">{title}</Text>
          {children}
          <Button mode="contained-tonal" onPress={() => setVisibleModal(false)}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleDelete}>
            {primaryButtonLabel ? primaryButtonLabel : 'Salvar'}
          </Button>
        </Modal>

      </Portal>
      {trigger ? (
        React.isValidElement(trigger) &&
        React.cloneElement(trigger as React.ReactElement, {
          onPress: () => setVisibleModal(true),
        })
      ) : (
        <IconButton
          icon="delete"
          size={20}
          mode="outlined"
          onPress={() => setVisibleModal(true)}
        />
      )}
    </>
  );
};

export default CustomModal;