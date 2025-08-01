import { getReviewById } from '@/api/reviews/reviews.api';
import CardReview from '@/components/CardReview';
import CustomModal from '@/components/CustomModal';
import FilterInput from '@/components/FilterInput';
import FormWorkout from '@/components/FormWorkout/FormWorkout';
import SelectStudent from '@/components/SelectStudent';
import Skeleton from '@/components/Skeleton';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { WorkoutFormProvider } from '@/context/WorkoutFormContext';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import { useStudent } from '../../context/StudentContext';

type CreateWorkoutProps = {
  route: {
    params?: {
      workoutId?: string;
      studentId?: string;
    };
  };
};

const CreateWorkout = ({ route }: CreateWorkoutProps) => {
  const navigation = useNavigation();
  const { user } = useUser();
  const { refetchStudent, isLoading, student } = useStudent();
  const [params, setParams] = useState('');
  const { workoutId, studentId } = route.params || {};
  const [newStudent, setNewStudent] = useState(!studentId);
  const { theme } = useTheme();

  useFocusEffect(
    useCallback(() => {
      studentId ? refetchStudent(studentId) : refetchStudent('');
    }, [studentId])
  );

  const { data: review } = useQuery({
    queryKey: ['getReviewById', user?.id, workoutId],
    queryFn: () =>
      getReviewById(user?.id || '', workoutId || '', studentId || ''),
    enabled: !!user?.id && !!workoutId && !!studentId,
  });

  return (
    <>
      <Appbar.Header mode="small">
        <Appbar.BackAction
          onPress={() => navigation.navigate('Workouts' as never)}
        />
        <Appbar.Content title="Cadastrar treino" />

        {review?.review && (
          <CustomModal
            cancelButtonLabel={'Fechar'}
            onPress={() => {}}
            showPrimaryButton={false}
            title="Avaliação do treino"
            trigger={
              <Button icon={'star'} mode="elevated">
                Ver avaliação
              </Button>
            }
          >
            <CardReview
              navigation={navigation}
              reviewData={review!}
              showButtonWorkout={false}
            />
          </CustomModal>
        )}
      </Appbar.Header>

      <FlatList
        data={[{}]}
        keyExtractor={() => 'header'}
        nestedScrollEnabled
        renderItem={() => (
          <>
            {newStudent ? (
              <View style={{ margin: 20 }}>
                <Text variant="titleMedium">Escolha um aluno(a)</Text>
                <FilterInput
                  onChange={setParams}
                  placeholder="Pesquisar aluno(a)"
                />
                <SelectStudent
                  filterName={params}
                  onSelect={(student) => refetchStudent(student.studentId)}
                  teacherId={user?.id || ''}
                />
                <Button
                  disabled={student?.permission !== 'STUDENT'}
                  mode="contained"
                  onPress={() => setNewStudent(false)}
                >
                  Continuar
                </Button>
              </View>
            ) : (
              <>
                {isLoading ? (
                  <View
                    style={{ alignItems: 'center', gap: 16, marginTop: 16 }}
                  >
                    <Skeleton
                      style={{ width: '90%', height: 50, borderRadius: 20 }}
                    />
                    <Skeleton
                      style={{ width: '90%', height: 50, borderRadius: 20 }}
                    />
                    <Skeleton
                      style={{ width: '90%', height: 150, borderRadius: 20 }}
                    />
                    <Skeleton
                      style={{ width: '90%', height: 50, borderRadius: 20 }}
                    />
                  </View>
                ) : (
                  <WorkoutFormProvider>
                    <FormWorkout workoutId={workoutId} />
                  </WorkoutFormProvider>
                )}
              </>
            )}
          </>
        )}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      />
    </>
  );
};

export default CreateWorkout;
