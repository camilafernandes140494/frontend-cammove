import { useState } from 'react';
import { Image, View, ActivityIndicator, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import { deleteFiles, postFiles } from '@/api/files/files.api';
import * as ImageManipulator from 'expo-image-manipulator';

interface ImageUploadProps {
    onSelect: (url: string) => void;
    labelButton?: string;
    deletePreviousImage?: string | null
}

export default function ImageUpload({ onSelect, deletePreviousImage, labelButton = 'Escolher imagem' }: ImageUploadProps) {
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const pickImage = async () => {
        setError(null); // Limpa erros anteriores

        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            setError('Permissão para acessar imagens foi negada.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // correto para pegar imagens
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedAsset = result.assets[0];
            setImage(selectedAsset.uri);
            await handleSave(selectedAsset);
        }
    };

    const handleSave = async (asset: ImagePicker.ImagePickerAsset) => {
        setIsLoading(true);
        try {
            const deleteImage = deletePreviousImage?.split('/')

            if (deleteImage) { await deleteFiles(deleteImage[3], deleteImage[4]) }

            const compressImage = async (uri: string) => {
                const result = await ImageManipulator.manipulateAsync(
                    uri,
                    [],
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );
                return result.uri;
            };

            const getMimeType = (filename: string) => {
                const extension = filename.split('.').pop()?.toLowerCase();
                switch (extension) {
                    case 'jpg':
                    case 'jpeg':
                        return 'image/jpeg';
                    case 'png':
                        return 'image/png';
                    case 'webp':
                        return 'image/webp';
                    default:
                        return 'application/octet-stream';
                }
            };

            // Comprimir imagem
            const compressedUri = await compressImage(asset.uri);

            const file = {
                uri: compressedUri,
                name: asset.fileName || `photo_${Date.now()}.jpg`,
                type: getMimeType(asset.fileName || ''),
            } as any;

            const formData = new FormData();
            formData.append('file', file);

            const uploadResult = await postFiles('users', formData);
            console.log('Upload feito com sucesso:', uploadResult);

            // A resposta vem com o 'key' e 'url'
            const { key, url } = uploadResult;

            // Exemplo de como usar a URL assinada
            console.log('URL da imagem:', url);  // Aqui você pode usar a URL para exibir a imagem ou fazer outra coisa

            // Passar o `key` para o método `onSelect`, caso precise do path do arquivo
            onSelect(url);

        } catch (error) {
            console.error('Erro ao fazer upload ou buscar o arquivo:', error);
            setError('Erro ao enviar imagem.');
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <View >
            <Button mode="contained" onPress={pickImage}
                style={{
                    marginBottom: image ? 1 : 10,
                }}>
                {labelButton}
            </Button>

            {image && (
                <View style={{
                    marginTop: 20,
                    alignItems: 'center',
                }}>
                    <Image
                        source={{ uri: image }}
                        style={{
                            width: 200,
                            height: 200,
                            borderRadius: 10,
                            marginBottom: 10,
                        }}
                    />
                    {isLoading && <ActivityIndicator animating={true} size="large" />}
                </View>
            )}

            {error && (
                <Text style={{
                    color: 'red',
                    marginTop: 10,
                }}>
                    {error}
                </Text>
            )}
        </View>
    );
}
