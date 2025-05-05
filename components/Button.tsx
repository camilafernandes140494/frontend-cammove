
import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';


interface ButtonProps extends TouchableOpacityProps {
    variant?: 'primary' | 'secondary' | 'success' | 'error';
    title: string;
}

const Button = ({ variant = 'primary', title, ...props }: ButtonProps) => {

    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={{ borderRadius: 30, backgroundColor: theme[variant], paddingVertical: 10, alignItems: 'center' }}
            {...props}
        >
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.textButton }}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;