import React, { useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import {
  Text,
  Snackbar, Appbar,
  Card, IconButton,
  Button,
  Chip
} from 'react-native-paper';
import { useStudent } from '../context/StudentContext';
import { duplicateWorkout } from '@/api/workout/workout.api';
import { useQuery } from '@tanstack/react-query';
import StudentCard from '@/components/StudentCard';
import Skeleton from '@/components/Skeleton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';
import CustomModal from '@/components/CustomModal';
import { deleteAssessmentsByStudentId, getAssessmentsByStudentId } from '@/api/assessments/assessments.api';
import { useTheme } from '../ThemeContext';
import { format } from 'date-fns';

export type RootStackParamList = {
  Assessments: undefined;
  CreateAssessments: { assessmentsId?: string, studentId?: string };
};

type DetailsAssessmentsProps = {
  route: {
    params?: {
      studentId?: string;
    };
  };
};

const DetailsAssessments = ({ route }: DetailsAssessmentsProps) => {
  const [visible, setVisible] = useState(false);
  const { student, refetchStudent } = useStudent();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const { theme } = useTheme();

  const { user } = useUser();
  const { studentId } = route.params || {};


  const activeStudentId = useMemo(() => {
    return studentId ?? student?.id ?? '';
  }, [studentId, student?.id]);

  useEffect(() => {
    if (!!studentId) {
      refetchStudent(activeStudentId)

    }
  }, [activeStudentId])


  const { data: assessmentsStudent, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['getAssessmentsByStudentId', student?.id],
    queryFn: () => getAssessmentsByStudentId(student?.id || ''),
    enabled: !!student?.id
  });


  const handleDelete = async (assessmentsId: string) => {
    try {
      await deleteAssessmentsByStudentId(assessmentsId, student?.id || '', user?.id || '');
      refetch()
    } catch (error) {
      console.error('Erro ao criar exercício:', error);
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
    <>
      <>
        <Appbar.Header mode='small'>
          <Appbar.BackAction onPress={() => navigation.navigate('Assessments')} />
          <Appbar.Content title="Avaliação" />
          <Button icon="plus" mode="contained" onPress={() => navigation.navigate('CreateAssessments', { studentId: activeStudentId })}>
            Nova Avaliação
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
      </>
      <FlatList
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        data={assessmentsStudent}
        keyExtractor={(item) => String(item.id)}
        refreshing={isLoading || isFetching}
        onRefresh={refetch}
        renderItem={({ item }) => <>{isLoading ? <Skeleton style={{ width: '90%', height: 50, borderRadius: 20 }} /> : <Card style={{ marginHorizontal: 20, marginVertical: 10 }}
        >
          <Card.Title
            title="Avaliação"
            subtitle={`ID ${item.id}`}
            titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
            subtitleStyle={{ fontSize: 12, color: 'gray' }}
            right={(props) => <IconButton {...props} icon="arrow-right" onPress={() => { navigation.navigate('CreateAssessments', { assessmentsId: item.id, studentId: activeStudentId }) }} />}
          />
          <Card.Content style={{
            display: 'flex', justifyContent: 'space-between', flexDirection: "row", alignItems: 'center'
          }} >

            <Chip

              icon='calendar'>
              {format(item?.createdAt, "dd/MM/yyyy")}
            </Chip>

            <CustomModal
              onPress={() => handleDelete(item.id)}
              title='Tem certeza que deseja deletar a avaliação?'
              primaryButtonLabel='Deletar'
            />
          </Card.Content>

        </Card>
        }
        </>
        }
      />
    </>
  );
};

export default DetailsAssessments;
