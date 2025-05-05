import React from 'react';
import { FlatList, View } from 'react-native';
import {
  Text, Avatar,
  Surface,
  Divider,
  Appbar,
  Switch,
  Button
} from 'react-native-paper';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { calculateAge, getInitials } from '@/common/common';
import InfoField from '@/components/InfoField';
import { getUserById, patchUser } from '@/api/users/users.api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Skeleton from '@/components/Skeleton';
import { getStatusRelationships, patchRelationship } from '@/api/relationships/relationships.api';
import CustomModal from '@/components/CustomModal';

export type RootHomeStackParamList = {
  Home: undefined;
  Tabs: undefined;
  WorkoutsScreen: {
    screen: keyof WorkoutsStackParamList;
    params?: any;
  };
  AssessmentsScreen: {
    screen: keyof AssessmentsStackParamList;
    params?: any;
  }
};

export type WorkoutsStackParamList = {
  DetailsWorkout: { workoutId: string };
};

export type AssessmentsStackParamList = {
  DetailsAssessments: { assessmentsId: string };
};



const StudentProfile = () => {
  const route = useRoute();
  const { user } = useUser();
  const { studentProfileId } = route.params as { studentProfileId: string | undefined };
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootHomeStackParamList>>();
  const queryClient = useQueryClient();

  const { data: studentId, isLoading } = useQuery({
    queryKey: ['studentId', studentProfileId],
    queryFn: () => getUserById(studentProfileId || ''),
    enabled: !!studentProfileId,
  });

  const { data: studentStatus, refetch } = useQuery({
    queryKey: ['getStatusRelationships', studentProfileId],
    queryFn: () => getStatusRelationships(user?.id! || '', studentId?.id || ''),
    enabled: Boolean(user?.id) && Boolean(studentId?.id)
  });


  const mutation = useMutation({
    mutationFn: async () => {
      const newStatus = studentStatus?.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

      await patchRelationship(studentStatus?.id!, {
        status: newStatus,
      });

      await patchUser(studentProfileId! || '', {
        status: newStatus,
      });
    },
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['getRelationship'] });

    },
  });

  const onToggleSwitch = () => {
    mutation.mutate();
  };

  const genderMap: Record<string, string> = {
    MALE: 'Masculino',
    FEMALE: 'Feminino',
    OTHER: 'Outro',
    PREFER_NOT_TO_SAY: 'Prefiro não me identificar',
  };


  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Detalhes do aluno(a)" />
      </Appbar.Header>
      <FlatList
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        data={[{}]}
        keyExtractor={() => 'header'}
        renderItem={() =>
          <>
            {isLoading ? <StudentProfileLoading /> : <>
              <View style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <View
                  style={{
                    width: '100%',
                    backgroundColor: theme.colors.primaryContainer,
                    padding: 20,
                    paddingBottom: 100,
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -45,
                      zIndex: 1,
                    }}
                  >
                    {studentId?.image ? <Avatar.Image size={80} source={{ uri: studentId.image }} /> : <Avatar.Text label={getInitials(studentId?.name || '')} />}

                  </View>
                </View>

                <Text
                  variant="headlineMedium"
                  style={{ marginTop: 40 }}
                >
                  {studentId?.name}
                </Text>
              </View>
              <Surface elevation={2} style={{ display: 'flex', gap: 16, margin: 16, padding: 16 }}>
                <InfoField title='E-mail' description={studentId?.email || ''} />
                <Divider />
                <InfoField title='Gênero' description={genderMap[studentId?.gender || ''] || ''} />
                <Divider />
                <InfoField title='Data de Nascimento' description={`${studentId?.birthDate} (${calculateAge(studentId?.birthDate || '')} anos)`} />
                <Divider />
                <View style={{ display: 'flex', gap: 16, flexDirection: 'row', alignItems: 'center' }}>
                  <CustomModal
                    onPress={onToggleSwitch}
                    title="Tem certeza de que deseja alterar o status do usuário?"
                    primaryButtonLabel={studentStatus?.status === 'ACTIVE' ? 'Desativar' : "Ativar"}
                    trigger={
                      <Switch value={studentStatus?.status === 'ACTIVE'} />
                    }
                  />
                  <Text>{studentStatus?.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</Text>
                </View>
                <Divider />
                <Button mode="text" icon="heart-pulse"
                  style={{
                    alignSelf: 'flex-start',
                  }}
                  onPress={() => {
                    navigation.navigate('WorkoutsScreen', {
                      screen: 'DetailsWorkout',
                      params: { studentId: studentId?.id },
                    });
                  }}>
                  Ver treinos
                </Button>
                <Divider />
                <Button mode="text" icon="chart-bar"
                  style={{
                    alignSelf: 'flex-start',
                  }}
                  onPress={() => {
                    navigation.navigate('AssessmentsScreen', {
                      screen: 'DetailsAssessments',
                      params: { studentId: studentId?.id },
                    });
                  }}>
                  Ver Avaliações
                </Button>
              </Surface>
            </>}

          </>


        }
      />
    </>

  );
};

export default StudentProfile;

const StudentProfileLoading = () => {
  const { theme } = useTheme();

  return (
    <>
      <View style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Container superior com fundo */}
        <View
          style={{
            width: '100%',
            backgroundColor: theme.colors.primaryContainer,
            padding: 20,
            paddingBottom: 100,
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Skeleton do Avatar */}
          <View
            style={{
              position: 'absolute',
              bottom: -45,
              zIndex: 1,
            }}
          >
            <Skeleton style={{ width: 80, height: 80, borderRadius: 40 }} />
          </View>
        </View>

        {/* Skeleton do nome */}
        <Skeleton style={{ width: 180, height: 24, borderRadius: 6, marginTop: 40 }} />
      </View>

      {/* Container dos dados */}
      <Surface elevation={2} style={{ display: 'flex', gap: 16, margin: 16, padding: 16 }}>
        <Skeleton style={{ width: '100%', height: 20, borderRadius: 4 }} />
        <Divider />
        <Skeleton style={{ width: '100%', height: 20, borderRadius: 4 }} />
        <Divider />
        <Skeleton style={{ width: '100%', height: 20, borderRadius: 4 }} />
        <Divider />
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <Skeleton style={{ width: 40, height: 20, borderRadius: 10 }} />
          <Skeleton style={{ width: 80, height: 20, borderRadius: 4 }} />
        </View>
      </Surface>
    </>
  );
};
