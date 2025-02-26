import React, { useState } from 'react';
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

export type RootStackParamList = {
  Assessments: undefined;
  CreateAssessments: { workoutId?: string };
};

const DetailsAssessments = () => {
  const [visible, setVisible] = useState(false);
  const { student } = useStudent();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoadingButton, setIsLoadingButton] = useState(false);

  const [isLoadingButtonDelete, setIsLoadingButtonDelete] = useState(false);
  const { user } = useUser();

  const { data: workoutsStudent, isLoading, refetch } = useQuery({
    queryKey: ['getWorkoutsByStudentId', student?.id],
    queryFn: () => getWorkoutsByStudentId(student?.id || ''),
    enabled: !!student?.id
  });


  const handleDelete = async (workoutId: string) => {
    setIsLoadingButtonDelete(true);
    try {
      await deleteWorkoutsByStudentId(workoutId, student?.id || '', user?.id || '');
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
      await duplicateWorkout(workoutId, student?.id || '', user?.id || '');
      refetch()
    } catch (error) {
      console.error('Erro ao criar exercício:', error);
    } finally {
      setIsLoadingButton(false);
    }
  };
  return (
    <FlatList
      style={{ flex: 1, }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      ListHeaderComponent={
        <>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.navigate('Assessments')} />
            <Appbar.Content title="Avaliação" />
          </Appbar.Header>
          <StudentCard
            children={
              <Button
                icon="plus"
                mode='text'
                onPress={() => navigation.navigate('CreateAssessments', { workoutId: student?.id })}
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
      keyExtractor={(item) => String(item)}
      renderItem={({ item }) => <>{isLoading ? <Skeleton style={{ width: '90%', height: 50, borderRadius: 20 }} /> : <Card style={{ marginHorizontal: 20, marginVertical: 10 }}
      >
        <Card.Title
          title="Treino"
          subtitle={`ID ${item}`}
          right={(props) => <IconButton {...props} icon="arrow-right" onPress={() => { navigation.navigate('CreateAssessments', { workoutId: item }) }} />}
        />
        <Card.Actions>

          <CustomModal
            onPress={() => handleDelete(item)}
            title='Tem certeza que deseja deletar o treino?'
            primaryButtonLabel='Deletar' />
          <CustomModal
            onPress={() => handleDuplicate(item)}
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

export default DetailsAssessments;
