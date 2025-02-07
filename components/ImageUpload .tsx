import { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { postUpload } from '@/api/exercise/exercise.api';
import { Upload } from '@/api/exercise/exercise.types';
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

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        if (image) {
            // Fazendo a conversão de URI para Blob
            const response = await fetch(image);
            const blob = await response.blob();

            // Criando um objeto File com o Blob
            const file = new File([blob], "uploaded-image.jpg", { type: blob.type });

            // Criação do FormData
            const formData = new FormData();
            formData.append('file', file);  // Aqui estamos enviando o file diretamente no FormData
            formData.append('folder', 'exercises');  // Outros dados podem ser anexados no FormData

            // Enviando o FormData para o backend
            try {
                const response = await postUpload(formData);  // Modificado para passar o FormData diretamente
                console.log('Upload bem-sucedido:', response);
            } catch (error) {
                console.error('Erro ao upload de arquivo:', error);
            }
        } else {
            console.log('Nenhuma imagem selecionada');
        }
    };


    return (
        <View style={styles.container}>
            <Button onPress={pickImage} >Escolher uma imagem da galeria</Button>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <Button onPress={handleSave} loading={isLoading}>Salvar</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 200,
        height: 200,
    },
});
