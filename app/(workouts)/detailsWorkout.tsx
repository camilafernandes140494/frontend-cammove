import React, { useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import {
  Text,
  Snackbar, Appbar,
  Card, IconButton,
  Button
} from 'react-native-paper';
import { useStudent } from '../context/StudentContext';
import { deleteWorkoutsByStudentId, duplicateWorkout, getWorkoutsByStudentId } from '@/api/workout/workout.api';
import { useQuery } from '@tanstack/react-query';
import StudentCard from '@/components/StudentCard';
import Skeleton from '@/components/Skeleton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';
import CustomModal from '@/components/CustomModal';
import { useTheme } from '../ThemeContext';

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


  const { data: workoutsStudent, isLoading, refetch } = useQuery({
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
    <FlatList
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      ListHeaderComponent={
        <>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.navigate('Workouts')} />
            <Appbar.Content title="Treinos" />
          </Appbar.Header>
          <StudentCard
            children={
              <Button
                icon="plus"
                mode='text'
                onPress={() => navigation.navigate('CreateWorkout', { studentId: activeStudentId })}
              >Novo treino
              </Button>
            }
          />

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
        </>
      }
      data={workoutsStudent}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <>{isLoading ? <Skeleton style={{ width: '90%', height: 50, borderRadius: 20 }} /> : <Card style={{ marginHorizontal: 20, marginVertical: 10 }}
      >
        <Card.Title
          title={item.nameWorkout}
          subtitle={`ID ${item.id}`}
          right={(props) => <IconButton {...props} icon="arrow-right" onPress={() => { navigation.navigate('CreateWorkout', { workoutId: item.id, studentId: activeStudentId }) }} />}
        />
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
    />
  );
};

export default DetailsWorkout;
