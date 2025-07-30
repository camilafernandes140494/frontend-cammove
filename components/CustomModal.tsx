import { useTheme } from '@/context/ThemeContext';
import React, { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  Modal,
  Portal,
  Switch,
  Text,
} from 'react-native-paper';

interface CustomModalProps {
  onPress: () => void;
  onOpen?: () => void;
  title: string;
  trigger?: React.ReactNode;
  primaryButtonLabel?: string;
  cancelButtonLabel?: string;
  children?: React.ReactNode;
  showPrimaryButton?: boolean;
}

const CustomModal = ({
  onPress,
  onOpen,
  title,
  trigger,
  primaryButtonLabel = 'Salvar',
  showPrimaryButton = true,
  cancelButtonLabel = 'Cancelar',
  children,
}: CustomModalProps) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    if (visibleModal && onOpen) {
      onOpen();
    }
  }, [visibleModal, onOpen]);

  const handleDelete = () => {
    onPress();
    setVisibleModal(false);
  };

  const openModal = () => setVisibleModal(true);

  return (
    <>
      <Portal>
        <Modal
          contentContainerStyle={{
            backgroundColor: theme.colors.surface,
            padding: 20,
            gap: 16,
            marginHorizontal: 16,
            borderRadius: 24,
          }}
          onDismiss={() => setVisibleModal(false)}
          visible={visibleModal}
        >
          <Text variant="titleMedium">{title}</Text>
          {children}
          <Button mode="contained-tonal" onPress={() => setVisibleModal(false)}>
            {cancelButtonLabel}
          </Button>
          {showPrimaryButton && (
            <Button mode="contained" onPress={handleDelete}>
              {primaryButtonLabel}
            </Button>
          )}
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
          mode="outlined"
          onPress={() => setVisibleModal(true)}
          size={20}
        />
      )}
    </>
  );
};

export default CustomModal;
