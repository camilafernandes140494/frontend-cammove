import { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { postUpload } from '@/api/exercise/exercise.api';
import { Button } from 'react-native-paper';

export default function ImageUpload() {
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        setIsLoading(true)

        if (image) {
            // Fazendo a conversão de URI para Blob
            const response = await fetch(image);
            const blob = await response.blob();

            // Criação do FormData
            const formData = new FormData();
            formData.append('file', {
                uri: image,
                name: 'uploaded-file.jpg',
                type: blob.type
            } as any);
            formData.append('folder', 'exercises');

            try {
                const response = await postUpload(formData);
                console.log('Upload bem-sucedido:', response);
            } catch (error) {
                console.error('Erro ao upload de arquivo:', error);
            }
            finally {
                setIsLoading(false)

            }
        } else {
            console.log('Nenhuma imagem selecionada');
        }
    };


    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', }}>
            <Button onPress={pickImage}>Escolher uma imagem </Button>
            {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, }} />}
            <Button onPress={handleSave} loading={isLoading}>Salvar</Button>
        </View>
    );
}

