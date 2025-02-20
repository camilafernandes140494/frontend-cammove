import React from 'react';
import { Snackbar } from 'react-native-paper';

interface CustomSnackbarProps {
  visible: boolean;
  message: string;
  onDismiss: () => void;
}

const CustomSnackbar = ({ visible, message, onDismiss }: CustomSnackbarProps) => (
  <Snackbar
    visible={visible}
    onDismiss={onDismiss}
    action={{
      label: 'Fechar',
      icon: 'close',
      onPress: onDismiss,
    }}
  >
    {message}
  </Snackbar>
);

export default CustomSnackbar;
