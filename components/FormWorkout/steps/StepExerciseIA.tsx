/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import { getExercises } from '@/api/exercise/exercise.api';
import type { Exercise } from '@/api/exercise/exercise.types';
import { postWorkoutSuggestion } from '@/api/openai/gemini.api';
import type { ExerciseWorkout } from '@/api/workout/workout.types';
import { calculateAge } from '@/common/common';
import CustomModal from '@/components/CustomModal';
import ExerciseModal from '@/components/ExerciseModal';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';
import { useWorkoutForm } from '@/context/WorkoutFormContext';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Divider,
  Icon,
  IconButton,
  Text,
} from 'react-native-paper';

interface StepExerciseIAProps {
  removeExercise: (exerciseId: string) => void;
  exercisesList: ExerciseWorkout[];
  setExercisesList: React.Dispatch<React.SetStateAction<ExerciseWorkout[]>>;
  updateExerciseList: (exercise: ExerciseWorkout) => void;
}

const StepExerciseIA = ({
  removeExercise,
  setExercisesList,
  exercisesList,
  updateExerciseList,
}: StepExerciseIAProps) => {
  const { student } = useStudent();

  const { setWorkoutSuggestion, workoutSuggestion } = useWorkoutForm();
  const { theme } = useTheme();

  const { data: exercises } = useQuery({
    queryKey: ['getExercises'],
    queryFn: () => getExercises({}),
    enabled: true,
  });

  function searchByName(name: string): Exercise[] | undefined {
    const termo = name.replace(/\s*\(.*?\)\s*/g, '').toLowerCase();
    console.log(termo, 'termo');
    console.log(
      exercises?.filter((item) => item.name.toLowerCase().includes(termo))
    );
    return exercises?.filter((item) => item.name.toLowerCase().includes(termo));
  }

  const mutation = useMutation({
    mutationFn: async () => {
      return await postWorkoutSuggestion({
        age: String(calculateAge(student?.birthDate || '')),
        gender: student?.gender || 'unissex',
        nameWorkout: 'treino de perna',
        type: 'Hipertrofia',
        level: 'iniciante',
      });
    },
    onSuccess: (data) => {
      setWorkoutSuggestion(data);
    },
    onError: (error) => {
      console.error('Erro ao processar o objeto do treino:', error);
    },
  });

  useEffect(() => {
    if (workoutSuggestion?.treino?.exercises) {
      const exercisesTemp: ExerciseWorkout[] =
        workoutSuggestion.treino.exercises.map((exercise) => ({
          observations: '',
          repetitions: exercise.repetitions,
          sets: exercise.sets,
          restTime: `${exercise.restTime} segundos`,
          exerciseId: {
            name: exercise.name,
            description: '',
          },
        }));
      setExercisesList(exercisesTemp);
    }
  }, [workoutSuggestion, setExercisesList]);

  const renderExerciseItem = useCallback(
    ({ item }: { item: ExerciseWorkout }) => {
      const isLinked = Boolean(
        item.exerciseId?.id && item.exerciseId.id.trim() !== ''
      );

      return (
        <Card style={{ marginVertical: 10 }}>
          <Card.Content style={{ gap: 8 }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
            >
              <Text variant="titleMedium">{item.exerciseId.name}</Text>
              <IconButton
                icon="sync"
                onPress={() => {
                  const match = searchByName(item.exerciseId.name)[0];
                  if (match) {
                    updateExerciseList({
                      ...item,
                      exerciseId: match,
                    });
                  }
                }}
                size={20}
              />
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                color={theme.colors.primary}
                name={'bed-outline'}
                size={18}
                style={{ marginRight: 4 }}
              />
              <Text variant="bodySmall">{`Descanso: ${item.restTime}`}</Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
              }}
            >
              {item.sets && (
                <Chip
                  disabled
                  icon={() => (
                    <Ionicons
                      color={theme.colors.primary}
                      name={'repeat'}
                      size={18}
                    />
                  )}
                  style={{
                    backgroundColor: theme.colors.primaryContainer,
                    alignSelf: 'flex-start',
                  }}
                  textStyle={{
                    color: theme.colors.primary,
                  }}
                >
                  {item.sets}
                </Chip>
              )}
              {item.repetitions && (
                <Chip
                  disabled
                  icon={() => (
                    <Ionicons
                      color={theme.colors.primary}
                      name={'repeat'}
                      size={18}
                    />
                  )}
                  style={{
                    backgroundColor: theme.colors.primaryContainer,
                    alignSelf: 'flex-start',
                  }}
                  textStyle={{
                    color: theme.colors.primary,
                  }}
                >
                  {item.repetitions}
                </Chip>
              )}
            </View>
            <CustomModal
              cancelButtonLabel="Entendi"
              onPress={() => console.log('Vinculado')}
              showPrimaryButton={false}
              title={'Exercício Vinculado'}
              trigger={
                <Chip
                  icon={() => (
                    <Ionicons
                      color={
                        isLinked
                          ? ''
                          : theme.colors.card.negativeFeedback.text.primary
                      }
                      name={
                        isLinked
                          ? 'checkmark-circle-outline'
                          : 'alert-circle-outline'
                      }
                      size={18}
                    />
                  )}
                  style={{
                    // backgroundColor: isLinked
                    //   ? theme.colors.card.positiveFeedback.chipBackground
                    //   : theme.colors.card.negativeFeedback.background,
                    borderColor: isLinked
                      ? '#4CAF50'
                      : theme.colors.card.negativeFeedback.background,
                    borderWidth: 1,
                  }}
                  textStyle={{
                    color: isLinked ? '#2E7D32' : theme.colors.card,
                  }}
                >
                  {isLinked ? 'Vinculado' : 'Não vinculado'}
                </Chip>
              }
            >
              <View
                style={{
                  borderRadius: 50,
                  padding: 12,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon
                  color={
                    isLinked
                      ? '#4CAF50'
                      : theme.colors.card.negativeFeedback.text.primary
                  }
                  size={48}
                  source={isLinked ? 'database-check' : 'database-alert'}
                />
              </View>

              <Text style={{ textAlign: 'center' }} variant="bodySmall">
                {isLinked
                  ? 'Este exercício já está cadastrado na nossa base. O seu aluno poderá visualizar fotos, vídeos e os grupos musculares relacionados para entender melhor a execução.'
                  : 'Este exercício não está cadastrado na nossa base. Ao vinculá-lo, seu aluno poderá visualizar fotos, vídeos e grupos musculares para entender melhor a execução.'}
              </Text>
            </CustomModal>
          </Card.Content>

          <Card.Actions>
            <CustomModal
              onPress={() => removeExercise(item?.exerciseId.name || '')}
              primaryButtonLabel="Deletar"
              title="Tem certeza que deseja deletar o exercício?"
            />
            <ExerciseModal exercise={item} onSave={updateExerciseList} />
          </Card.Actions>
        </Card>
      );
    },
    [updateExerciseList, updateExerciseList, removeExercise, theme]
  );

  return (
    <View style={{ marginVertical: 20 }}>
      <Card mode="outlined">
        <Card.Content>
          <Button
            disabled={mutation.isPending}
            icon={'creation'}
            loading={mutation.isPending}
            onPress={() => mutation.mutate()}
          >
            Gerar sugestão
          </Button>
          <Divider
            style={{
              width: '100%',
              backgroundColor: theme.colors.outlineVariant,
              height: 1,
              marginVertical: 10,
            }}
          />

          <FlatList
            data={exercisesList}
            initialNumToRender={10}
            keyExtractor={(item) => item.exerciseId.name}
            renderItem={renderExerciseItem}
          />
        </Card.Content>
      </Card>
    </View>
  );
};
export default StepExerciseIA;
