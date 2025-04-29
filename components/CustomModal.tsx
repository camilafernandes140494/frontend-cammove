import { useTheme } from "@/app/ThemeContext";
import React, { useState } from "react";
import { Button, Dialog, IconButton, Modal, Portal, Text } from "react-native-paper";
import { Switch } from 'react-native-paper';

interface CustomModalProps {
  onPress: () => void
  title: string
  trigger?: React.ReactNode;
  primaryButtonLabel?: string;
  cancelButtonLabel?: string;
  children?: React.ReactNode;
  showPrimaryButton?: boolean
}

const CustomModal = ({ onPress, title, trigger, primaryButtonLabel = 'Salvar', showPrimaryButton = true, cancelButtonLabel = 'Cancelar', children }: CustomModalProps) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const { theme } = useTheme();

  const handleDelete = () => {
    onPress();
    setVisibleModal(false);
  };

  const openModal = () => setVisibleModal(true);


  return (
    <>
      <Portal >
        <Modal visible={visibleModal} onDismiss={() => setVisibleModal(false)} contentContainerStyle={{ backgroundColor: theme.colors.background, padding: 20, gap: 16, marginHorizontal: 16, borderRadius: 24 }}>
          <Text variant="titleMedium">{title}</Text>
          {children}
            <Button mode="contained-tonal" onPress={() => setVisibleModal(false)}>
              {cancelButtonLabel}
            </Button>
            {showPrimaryButton &&
              <Button mode="contained" onPress={handleDelete}>
                {primaryButtonLabel}
              </Button>
            }
        </Modal>

      </Portal>
      {trigger ? (
        React.isValidElement(trigger) &&
        React.cloneElement(trigger as React.ReactElement, {
          ...(trigger.type === Switch
            ? { onValueChange: openModal }
            : { onPress: openModal }),
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