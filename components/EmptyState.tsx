// src/components/EmptyState.tsx
import type React from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native-paper';

type EmptyStateProps = {
  message?: string;
  onRetry: () => void;
};

const EmptyState = ({
  message = 'Nenhum dado encontrado.',
  onRetry,
}: EmptyStateProps) => {
  return (
    <View style={{ alignItems: 'center', padding: 40 }}>
      <Text style={{ fontSize: 16, marginBottom: 12, color: '#555' }}>
        {message}
      </Text>
      <Button onPress={onRetry}>Tentar novamente</Button>
    </View>
  );
};

export default EmptyState;
