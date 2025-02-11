import { useState } from 'react';
import { Image, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { postUpload } from '@/api/exercise/exercise.api';
import { Button } from 'react-native-paper';

interface ImageUploadProps {
    onSelect: (url: string) => void
}
export default function ImageUpload({ onSelect }: ImageUploadProps) {
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pickImage = async () => {
        setError(null); // Limpa erros anteriores

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            await handleSave(result.assets[0].uri);
        }
    };

    const handleSave = async (selectedImage: string) => {
        setIsLoading(true);

        try {
            const response = await fetch(selectedImage);
            const blob = await response.blob();

            const formData = new FormData();
            formData.append('file', {
                uri: selectedImage,
                name: 'uploaded-file.jpg',
                type: blob.type
            } as any);
            formData.append('folder', 'exercises');

            const url = await postUpload(formData);
            onSelect(url.url)

        } catch (error) {
            console.error('Erro ao fazer upload:', error);
            setError('Erro ao enviar imagem, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
        }}>
            <Button mode="contained" onPress={pickImage} >
                Escolher imagem
            </Button>

            {image && (
                <View style={{
                    marginTop: 20,
                    alignItems: 'center',
                }}>
                    <Image source={{ uri: image }} style={{
                        width: 200,
                        height: 200,
                        borderRadius: 10,
                        marginBottom: 10,
                    }} />
                    {isLoading && <ActivityIndicator animating={true} size="large" color="#6200ea" />}
                </View>
            )}

            {error && <Text style={{
                color: 'red',
                marginTop: 10,
            }}>{error}</Text>}
        </View>
    );
}

