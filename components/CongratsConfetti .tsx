import { useTheme } from '@/app/ThemeContext';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Button, Modal, Portal, Text } from 'react-native-paper';

interface CongratsConfettiProps {
  visible: boolean;
  onDismiss: VoidFunction;
  onEvaluate: VoidFunction;

}

const CongratsConfetti = ({ visible, onDismiss, onEvaluate }: CongratsConfettiProps) => {
  const { theme } = useTheme();
  const { width } = Dimensions.get('window');

  return (
    <>
      <Portal>
        {visible && (
          <>
            {/* Confetes em ambas as laterais */}
            <View pointerEvents="none" style={styles.confettiWrapper}>
              <ConfettiCannon
                count={80}
                origin={{ x: 0, y: 0 }} // Esquerda
                fadeOut
                autoStart
                fallSpeed={3000}
                explosionSpeed={200}
              />
              <ConfettiCannon
                count={80}
                origin={{ x: width, y: 0 }} // Direita
                fadeOut
                autoStart
                fallSpeed={3000}
                explosionSpeed={200}
              />
            </View>
          </>
        )}

        {/* Modal com mensagem */}
        <Modal
          visible={visible}
          onDismiss={onDismiss}
          contentContainerStyle={{
            backgroundColor: theme.colors.background,
            padding: 20,
            gap: 16,
            marginHorizontal: 20,
            borderRadius: 12,
            zIndex: 1,
          }}
        >
          <View style={{ display: "flex", alignItems: 'center', gap: 16 }}>
            <Text variant='titleLarge'>🎉 Parabéns!</Text>
            <Text variant='titleMedium'>Treino concluído com sucesso 💪</Text>
          </View>

          <Button mode="contained-tonal" onPress={onDismiss}>
            Fechar
          </Button>
          <Button mode="contained" onPress={onEvaluate}>
            Avaliar treino
          </Button>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  confettiWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    elevation: 10,
  },
});

export default CongratsConfetti;
