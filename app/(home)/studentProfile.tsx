import React from 'react';
import { FlatList, View } from 'react-native';
import {
  Text, Avatar,
  Surface,
  Divider
} from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import { calculateAge, getInitials } from '@/common/common';
import InfoField from '@/components/InfoField';
import { getUserById } from '@/api/users/users.api';
import { useQuery } from '@tanstack/react-query';

const StudentProfile = () => {
  const route = useRoute();
  const { user } = useUser();
  const { studentProfileId } = route.params as { studentProfileId: string | undefined };
  const { theme } = useTheme();

  const { data: studentId } = useQuery({
    queryKey: ['studentId', studentProfileId],
    queryFn: () => getUserById(studentProfileId || ''),
    enabled: !!studentProfileId,
  });


  return (
    <FlatList
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      data={[{}]}
      keyExtractor={() => 'header'}
      renderItem={() =>
        <>
          <View style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Avatar.Text label={getInitials(user?.name || '')} />
            <Text variant="headlineMedium">{user?.name}</Text>
          </View>
          <Surface elevation={2} style={{ display: 'flex', gap: 16, margin: 16, padding: 16 }}>
            <InfoField title='Data de Nascimento' description={`${calculateAge(studentId?.birthDate || '')} anos`} />
            <Divider />
            <InfoField title='E-mail' description={user?.email || ''} />

            <Divider />
            <InfoField title='Gênero' description={user?.gender || ''} />
            <Divider />
            <Text> Data de Nascimento: 15/08/1995 (29 anos)</Text>

          </Surface>
        </>


      }
    />
  );
};

export default StudentProfile;
