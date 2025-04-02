
import { useTheme } from '@/app/ThemeContext';
import React from 'react';
import { View, ViewProps } from 'react-native';
import { Text } from 'react-native-paper';


interface InfoFieldProps extends ViewProps {
  title: string;
  description: string
}

const InfoField = ({ title, description, ...props }: InfoFieldProps) => {

  const { theme } = useTheme();

  return (
    <View {...props} style={{ display: 'flex', gap: 10 }}>
      <Text variant='bodySmall' style={{ textTransform: 'uppercase' }}>{title}</Text>
      <Text variant='bodyLarge' style={{ fontWeight: 600 }}>{description}</Text>
    </View>

  );
};

export default InfoField;