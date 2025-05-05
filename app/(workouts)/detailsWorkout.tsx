import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import {
  Text,
  Snackbar, Appbar,
  Card, IconButton,
  Button,
  Chip
} from 'react-native-paper';
import { useStudent } from '../../context/StudentContext';
import { deleteWorkoutsByStudentId, duplicateWorkout, getWorkoutsByStudentId } from '@/api/workout/workout.api';
import { useQuery } from '@tanstack/react-query';
import StudentCard from '@/components/StudentCard';
import Skeleton from '@/components/Skeleton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useUser } from '@/context/UserContext';
import CustomModal from '@/components/CustomModal';
import { useTheme } from '@/context/ThemeContext';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type RootStackParamList = {
  Workouts: undefined;
  CreateWorkout: { workoutId?: string, studentId?: string };
};

type DetailsWorkoutProps = {
  route: {
    params?: {
      studentId?: string;
    };
  };
};

const DetailsWorkout = ({ route }: DetailsWorkoutProps) => {
  const [visible, setVisible] = useState(false);
  const { student, refetchStudent } = useStudent();
  const { studentId } = route.params || {};

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { theme } = useTheme();

  const [isLoadingButtonDelete, setIsLoadingButtonDelete] = useState(false);
  const { user } = useUser();

  const activeStudentId = useMemo(() => {
    return studentId ?? student?.id ?? '';
  }, [studentId, student?.id]);

  useEffect(() => {
    if (!!studentId) {
      refetchStudent(activeStudentId)

    }
  }, [activeStudentId])


  const { data: workoutsStudent, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['getWorkoutsByStudentId', activeStudentId],
    queryFn: () => getWorkoutsByStudentId(activeStudentId),
    enabled: !!activeStudentId
  });

  const handleDelete = async (workoutId: string) => {
    setIsLoadingButtonDelete(true);
    try {
      await deleteWorkoutsByStudentId(workoutId, activeStudentId, user?.id || '');
      refetch()
    } catch (error) {
      console.error('Erro ao criar exercício:', error);
    } finally {
      setIsLoadingButtonDelete(false);
    }
  };

  const handleDuplicate = async (workoutId: string) => {
    setIsLoadingButton(true);
    try {
      await duplicateWorkout(workoutId, activeStudentId, user?.id || '');
      refetch()
    } catch (error) {
      console.error('Erro ao criar exercício:', error);
    } finally {
      setIsLoadingButton(false);
    }
  };
  return (
    <>
      <Appbar.Header mode='small'>
        <Appbar.BackAction onPress={() => navigation.navigate('Workouts')} />
        <Appbar.Content title="Treinos" />
        <Button
          icon="plus"
          mode='contained'
          onPress={() => navigation.navigate('CreateWorkout', { studentId: activeStudentId })}
        >Novo treino
        </Button>
      </Appbar.Header>
      <StudentCard />

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: '',
          icon: 'close',
          onPress: () => setVisible(false),
        }}
      >
        <Text>Erro ao cadastrar</Text>
      </Snackbar>

      <FlatList
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        data={workoutsStudent}
        refreshing={isLoading || isFetching}
        onRefresh={refetch}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <>{isLoading ? <Skeleton style={{ width: '90%', height: 50, borderRadius: 20 }} /> : <Card style={{ marginHorizontal: 20, marginVertical: 10 }}
        >
          <Card.Title
            title={item.nameWorkout}
            subtitle={`ID ${item.id}`}
            titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
            subtitleStyle={{ fontSize: 12, color: 'gray' }}
            right={(props) => <IconButton {...props} icon="arrow-right" onPress={() => { navigation.navigate('CreateWorkout', { workoutId: item.id, studentId: activeStudentId }) }} />}
          />
          <Card.Content>
            <Chip
              style={{ alignSelf: 'flex-start' }}
              icon='calendar'>
              {format(item?.createdAt, "dd/MM/yyyy")}
            </Chip>
          </Card.Content>
          <Card.Actions>


            <CustomModal
              onPress={() => handleDelete(item.id)}
              title='Tem certeza que deseja deletar o treino?'
              primaryButtonLabel='Deletar' />
            <CustomModal
              onPress={() => handleDuplicate(item.id)}
              title='Tem certeza que deseja duplicar o treino?'
              primaryButtonLabel="Duplicar"
              trigger={<Button
                disabled={isLoadingButton}
                loading={isLoadingButton}
                mode='contained'
              >Duplicar</Button>} />

          </Card.Actions>
        </Card>
        }
        </>
        }
        ListEmptyComponent={
          isLoading || isFetching ? (
            <View>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  style={{
                    width: '90%',
                    height: 60,
                    borderRadius: 4,
                    marginVertical: 8,
                    alignSelf: 'center',
                  }}
                />
              ))}
            </View>
          ) : <View style={{ alignItems: 'center', padding: 40 }}>
            <MaterialCommunityIcons name="playlist-remove" size={48} color="#999" />
            <Text style={{ fontSize: 16, marginVertical: 12, color: '#555' }}>
              Nenhum dado encontrado.
            </Text>
            <Button onPress={() => refetch()} >Tentar novamente</Button>
          </View>
        }
      />
    </>

  );
};

export default DetailsWorkout;
