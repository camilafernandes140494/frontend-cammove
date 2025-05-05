import { useTheme } from '@/context/ThemeContext';
import React, { useState, useMemo } from 'react';
import { Chip, ChipProps } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface CustomChipProps extends Omit<ChipProps, 'children'> {
  label: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  color: 'primary' | 'secondary' | 'tertiary' | 'error' | 'warning';
  outlined?: boolean;
  onSelect?: (selected: boolean) => void;
}

const CustomChip: React.FC<CustomChipProps> = ({ label, color, outlined = false, icon, onSelect, ...props }) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState(false);

  const chipColor = theme.colors[color];
  const container = useMemo(() => theme.colors[`${color}Container`], [theme, color]);
  const colorText = useMemo(() => theme.colors[`on${color.charAt(0).toUpperCase() + color.slice(1)}Container`], [theme, color]);

  const handleSelect = () => {
    const newSelectedState = !selected;
    setSelected(newSelectedState);
    onSelect?.(newSelectedState);
  };

  return (
    <Chip
      mode={outlined ? 'outlined' : 'flat'}
      textStyle={{ color: colorText }}
      {...props}
      icon={(props) =>
        icon ? <MaterialCommunityIcons {...props} name={icon} size={20} color={colorText} /> : null
      } style={{
        backgroundColor: selected ? chipColor : outlined ? 'transparent' : container,
        borderColor: outlined ? chipColor : 'transparent',
        borderWidth: outlined ? 1 : 0,
        marginVertical: 4,
        ...(props.style && typeof props.style === 'object' ? props.style : {})
      }}
      onPress={handleSelect}
    >
      {label}
    </Chip>
  );
};

export default CustomChip;
