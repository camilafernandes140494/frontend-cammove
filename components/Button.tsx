
import { useTheme } from '@/app/ThemeContext';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type ButtonProps = {
    variant?: 'primary' | 'secondary' | 'success' | 'error';
    title: string;
    onPress: VoidFunction;
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', title, onPress }) => {

    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={{ borderRadius: 30, backgroundColor: theme[variant], paddingVertical: 10, alignItems: 'center' }}
            onPress={onPress}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.textButton }}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;