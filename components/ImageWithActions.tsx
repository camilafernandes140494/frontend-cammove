import { useTheme } from '@/app/ThemeContext';
import React, { useState } from 'react';
import { View, Modal, Image, Pressable, StyleSheet, Dimensions } from 'react-native';
import { IconButton, Dialog, Portal, Button, Text } from 'react-native-paper';

interface Props {
  uri: string;
  onDelete: () => void;
}

export const ImageWithActions: React.FC<Props> = ({ uri, onDelete }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const { theme } = useTheme();
  return (
    <View style={styles.container}>
      {/* Imagem + Botão de deletar */}
      <Pressable onPress={() => setModalVisible(true)}>
        <Image source={{ uri }} style={styles.image} />
      </Pressable>

      <IconButton
        mode='outlined'
        theme={{ colors: { outline: theme.colors.error } }}
        iconColor={theme.colors.error}
        icon="delete"
        size={20}
        onPress={() => setConfirmVisible(true)}
        style={styles.deleteButton}
      />

      {/* Modal com imagem em zoom */}
      <Modal visible={modalVisible} transparent>
        <Pressable style={styles.modalBackground} onPress={() => setModalVisible(false)}>
          <Image source={{ uri }} style={styles.zoomedImage} resizeMode="contain" />
        </Pressable>
      </Modal>

      {/* Modal de confirmação */}
      <Portal>
        <Dialog visible={confirmVisible} onDismiss={() => setConfirmVisible(false)}>
          <Dialog.Title>Confirmar exclusão</Dialog.Title>
          <Dialog.Content>
            <Text>Tem certeza que deseja remover esta imagem?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmVisible(false)}>Cancelar</Button>
            <Button onPress={() => {
              onDelete();
              setConfirmVisible(false);
            }}>
              Remover
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  deleteButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    // backgroundColor: 'white',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomedImage: {
    width: width - 40,
    height: width - 40,
  },
});
