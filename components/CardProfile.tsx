
import React from 'react';
import { Button, Card, Text } from 'react-native-paper';
import { Image } from 'react-native';
import { useTheme } from '@/app/ThemeContext';


interface CardProfileProps {
    color?: string;
    title: string;
    description: string
}

const CardProfile = ({ color, description, title, }: CardProfileProps) => {
    const { theme } = useTheme();

    return (
        <Card mode="contained" >
            <Card.Content
                style={{ display: "flex", flexDirection: 'column', gap: 10, alignItems: 'center' }}>
                <Text variant="headlineSmall" style={{ textAlign: 'center' }}>{title}</Text>
                <Image
                    source={{
                        uri: 'https://avatars3.githubusercontent.com/u/17571969?s=400&v=4',
                    }}
                    style={{
                        width: 200,
                        height: 200,
                    }}
                />
                <Text variant="labelMedium" style={{ textAlign: 'center', flexWrap: 'wrap', color: theme.colors.onPrimaryContainer }}>{description}
                </Text>
                <Button mode="contained">Começar Agora</Button>
            </Card.Content>
        </Card>
    );
};

export default CardProfile;