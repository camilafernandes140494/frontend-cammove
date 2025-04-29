import { useState } from 'react';
import { View, ActivityIndicator, Text, Video } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-paper';
import { deleteFiles, postFiles } from '@/api/files/files.api';

interface VideoUploadProps {
  onSelect: (urls: string[]) => void;
  labelButton?: string;
  deletePreviousVideo?: string | null;
  storageFolder: string;
}

export default function VideoUpload({
  onSelect,
  deletePreviousVideo,
  labelButton = 'Escolher vídeo',
  storageFolder,
}: VideoUploadProps) {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickVideo = async () => {
    setError(null);

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      setError('Permissão para acessar vídeos foi negada.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedVideo = result.assets[0];
      setVideoUri(selectedVideo.uri);
      await handleSave(selectedVideo);
    }
  };

  const getMimeType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'mp4':
        return 'video/mp4';
      case 'mov':
        return 'video/quicktime';
      case 'webm':
        return 'video/webm';
      default:
        return 'application/octet-stream';
    }
  };

  const handleSave = async (asset: ImagePicker.ImagePickerAsset) => {
    setIsLoading(true);

    try {
      if (deletePreviousVideo) {
        const parts = deletePreviousVideo.split('/');
        await deleteFiles(parts[3], parts[4]);
      }

      const file = {
        uri: asset.uri,
        name: asset.fileName || `video_${Date.now()}.mp4`,
        type: getMimeType(asset.fileName || ''),
      } as any;

      const formData = new FormData();
      formData.append('file', file);

      const uploadResult = await postFiles(storageFolder, formData);
      const { url } = uploadResult;
      onSelect([url]);
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setError('Erro ao enviar vídeo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View>
      <Button mode="contained" onPress={pickVideo}>
        {labelButton}
      </Button>

      {videoUri && (
        <View style={{ marginTop: 20 }}>
          {/* Pode substituir por componente de vídeo do expo-av se quiser controle */}
          <Video
            source={{ uri: videoUri }}
            style={{ width: 300, height: 200 }}
            useNativeControls
            resizeMode="contain"
          />
          {isLoading && <ActivityIndicator animating={true} size="large" />}
        </View>
      )}

      {error && (
        <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>
      )}
    </View>
  );
}
