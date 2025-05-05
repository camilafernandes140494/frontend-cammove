import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar } from 'react-native-paper';


export interface SelectableCardProps {
  label: string;
  icon: string;
  message: string;
  selected?: boolean;
  onPress: (label: string) => void;
}

const SelectableCard = ({ label, icon, message, selected, onPress }: SelectableCardProps) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={() => onPress(label)}>
      <Card
        style={{
          marginVertical: 12,
          padding: 8,
          backgroundColor: selected ? theme.colors.primaryContainer : theme.colors.background,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>

          <Avatar.Icon size={40} icon={icon} style={{ marginRight: 12 }} />
          <View style={{ flex: 1 }}>
            <Text variant="titleMedium" style={{ marginBottom: 4 }}>
              {label}
            </Text>
            <Text variant="bodyMedium">{message}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default SelectableCard;
