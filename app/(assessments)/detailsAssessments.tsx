import React, { useState } from 'react';
import { FlatList } from 'react-native';
import {
  Text,
  Snackbar, Appbar,
  Card, IconButton,
  Button
} from 'react-native-paper';
import { useStudent } from '../context/StudentContext';
import { deleteWorkoutsByStudentId, duplicateWorkout } from '@/api/workout/workout.api';
import { useQuery } from '@tanstack/react-query';
import StudentCard from '@/components/StudentCard';
import Skeleton from '@/components/Skeleton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';
import CustomModal from '@/components/CustomModal';
import { getAssessmentsByStudentId } from '@/api/assessments/assessments.api';
import { useTheme } from '../ThemeContext';

export type RootStackParamList = {
  Assessments: undefined;
  CreateAssessments: { assessmentsId?: string };
};

const DetailsAssessments = () => {
  const [visible, setVisible] = useState(false);
  const { student } = useStudent();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { theme } = useTheme();

  const [isLoadingButtonDelete, setIsLoadingButtonDelete] = useState(false);
  const { user } = useUser();

  const { data: assessmentsStudent, isLoading, refetch } = useQuery({
    queryKey: ['getAssessmentsByStudentId', student?.id],
    queryFn: () => getAssessmentsByStudentId(student?.id || ''),
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
      console.error('Erro ao criar avaliação:', error);
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
            <Appbar.BackAction onPress={() => navigation.navigate('Assessments')} />
            <Appbar.Content title="Avaliação" />
          </Appbar.Header>
          <StudentCard
            children={
              <Button
                icon="plus"
                mode='text'
                onPress={() => navigation.navigate('CreateAssessments', { assessmentsId: student?.id })}
              >Nova avaliação
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
      data={assessmentsStudent}
      keyExtractor={(item) => String(item)}
      renderItem={({ item }) => <>{isLoading ? <Skeleton style={{ width: '90%', height: 50, borderRadius: 20 }} /> : <Card style={{ marginHorizontal: 20, marginVertical: 10 }}
      >
        <Card.Title
          title="Avaliação"
          subtitle={`ID ${item}`}
          right={(props) => <IconButton {...props} icon="arrow-right" onPress={() => { navigation.navigate('CreateAssessments', { assessmentsId: item }) }} />}
        />
        <Card.Actions>

          <CustomModal
            onPress={() => handleDelete(item)}
            title='Tem certeza que deseja deletar a avaliação?'
            primaryButtonLabel='Deletar'
          />

          <CustomModal
            onPress={() => handleDuplicate(item)}
            title='Tem certeza que deseja duplicar a avaliação?'
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
