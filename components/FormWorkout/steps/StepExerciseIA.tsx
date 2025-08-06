/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import { getExercises } from '@/api/exercise/exercise.api';
import type { Exercise } from '@/api/exercise/exercise.types';
import { postWorkoutSuggestion } from '@/api/openai/gemini.api';
import type { ExerciseWorkout } from '@/api/workout/workout.types';
import { calculateAge } from '@/common/common';
import { ExerciseCard } from '@/components/ExerciseCard';
import ExerciseModal from '@/components/ExerciseModal';
import { FormField } from '@/components/FormField';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { FlatList, View } from 'react-native';
import { Button, Card } from 'react-native-paper';

interface StepExerciseIAProps {
  control?: any;
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
  control,
}: StepExerciseIAProps) => {
  const { student } = useStudent();

  const [match, setMatch] = useState<Exercise | null>(null);
  const { theme } = useTheme();
  const allValues = useWatch({ control });

  const { data: exercises } = useQuery({
    queryKey: ['getExercises'],
    queryFn: () => getExercises({}),
    enabled: true,
  });

  function searchByName(name: string): Exercise[] | undefined {
    const termo = name.replace(/\s*\(.*?\)\s*/g, '').toLowerCase();
    return exercises?.filter((item) => item.name.toLowerCase().includes(termo));
  }

  const mutation = useMutation({
    mutationFn: async () => {
      return await postWorkoutSuggestion({
        age: String(calculateAge(student?.birthDate || '')),
        gender: student?.gender || 'unissex',
        nameWorkout: allValues.nameWorkout || '',
        type: allValues.type.value || allValues.customType || '',
        level: allValues.level,
        muscleGroup: allValues.muscleGroup || [],
        amountExercises: allValues.amountExercises || 4,
      });
    },
    onSuccess: (data) => {
      const exercisesMapped: ExerciseWorkout[] = data.treino.exercises.map(
        (exercise) => ({
          observations: '',
          repetitions: exercise.repetitions,
          sets: exercise.sets,
          restTime: `${exercise.restTime} segundos`,
          exerciseId: {
            name: exercise.name,
            description: '',
            id: '',
            category: exercise.category[0],
            muscleGroup: exercise.category,
            images: [],
            createdAt: '',
            updatedAt: '',
          },
        })
      );

      setExercisesList(exercisesMapped);
    },

    onError: (error) => {
      console.error('Erro ao processar o objeto do treino:', error);
    },
  });

  const renderExerciseItem = useCallback(
    ({ item }: { item: ExerciseWorkout }) => {
      const isLinked = Boolean(
        item.exerciseId?.id && item.exerciseId.id.trim() !== ''
      );

      return (
        <ExerciseCard
          isLinked={isLinked}
          item={item}
          match={match}
          removeExercise={removeExercise}
          searchByName={searchByName}
          setMatch={setMatch}
          updateExerciseList={updateExerciseList}
        />
      );
    },
    [exercisesList, theme, match]
  );

  return (
    <View style={{ marginVertical: 20, gap: 24 }}>
      <Card mode="outlined">
        <Card.Content>
          <FormField
            control={control}
            keyboardType="numeric"
            label="Quantidade de exercícios"
            name="amountExercises"
          />
          <Button
            disabled={mutation.isPending}
            icon={'creation'}
            loading={mutation.isPending}
            onPress={() => mutation.mutate()}
          >
            Gerar sugestão com IA
          </Button>
        </Card.Content>
      </Card>
      {exercisesList && exercisesList.length !== 0 && (
        <Card mode="outlined">
          <Card.Content>
            <FlatList
              data={exercisesList}
              initialNumToRender={10}
              keyExtractor={(item) =>
                `temp-${item.exerciseId.id}-${item.exerciseId.name}-${item.exerciseId.createdAt}-`
              }
              renderItem={renderExerciseItem}
            />
            <ExerciseModal
              onSave={(exercise) =>
                setExercisesList((prev) => [...prev, exercise])
              }
            />
          </Card.Content>
        </Card>
      )}
    </View>
  );
};
export default StepExerciseIA;
