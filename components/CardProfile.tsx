
import React from 'react';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { useTheme } from '@/context/ThemeContext';
import { AvatarImageSource } from 'react-native-paper/lib/typescript/components/Avatar/AvatarImage';
import { PERMISSION } from '@/api/users/users.types';


interface CardProfileProps {
    color?: string;
    title: string;
    description: string;
    image: AvatarImageSource;
    status: PERMISSION;
    onStatus: (status: PERMISSION) => void
}

const CardProfile = ({ color = 'purple', description, title, image, status, onStatus }: CardProfileProps) => {
    const { theme } = useTheme();

    return (
        <Card mode="contained" contentStyle={{ backgroundColor: theme.colors.card[color].background.default }} >
            <Card.Content
                style={{ display: "flex", flexDirection: 'column', gap: 20, alignItems: 'center' }}>
                <Text variant="headlineSmall" style={{ textAlign: 'center', color: theme.colors.card[color].text.primary }}>{title}</Text>
                <Avatar.Image size={250} source={image} />
                <Text variant="labelMedium"
                    style={{
                        textAlign: 'center',
                        flexWrap: 'wrap',
                        color: theme.colors.card[color].text.secondary,
                    }}>{description}
                </Text>
                <Button
                    mode="contained"
                    onPress={() => onStatus(status)}
                    labelStyle={{
                        color: theme.colors.card[color].button.text,
                    }}
                    style={{
                        backgroundColor: theme.colors.card[color].button.background,
                    }}>
                    Começar Agora
                </Button>
            </Card.Content>
        </Card>
    );
};

export default CardProfile;