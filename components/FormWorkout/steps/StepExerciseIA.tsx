/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import { postWorkoutSuggestion } from '@/api/openai/gemini.api';
import type { ExerciseWorkout } from '@/api/workout/workout.types';
import ExerciseModal from '@/components/ExerciseModal';
import InfoField from '@/components/InfoField';
import { useStudent } from '@/context/StudentContext';
import { useWorkoutForm } from '@/context/WorkoutFormContext';
import { useMutation } from '@tanstack/react-query';
import { FlatList, View } from 'react-native';
import { Button, Card, Divider, Text } from 'react-native-paper';

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

  const mutation = useMutation({
    mutationFn: async () => {
      return await postWorkoutSuggestion({
        age: student?.birthDate || '25', // Corrigido: era student?.gender
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

  console.log(workoutSuggestion?.treino);
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
          <Divider style={{ marginVertical: 10 }} />
          <Text>Sugestão automática por IA</Text>

          <FlatList
            data={workoutSuggestion?.treino?.exercises}
            initialNumToRender={10}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <Card style={{ marginVertical: 10 }}>
                <Card.Content>
                  <Text>{item.name}</Text>

                  <InfoField
                    description={`${item.restTime} segundos`}
                    title="Tempo de descanso"
                  />
                  <InfoField description={item.sets} title="Número de séries" />
                  <InfoField
                    description={item.repetitions}
                    title="Quantidade de repetições"
                  />
                  <ExerciseModal
                    exercise={{
                      exerciseId: {
                        name: item.name,
                        description: '',
                      },
                      repetitions: item.repetitions,
                      sets: item.sets,
                      restTime: `${item.restTime} segundos`,
                      observations: '',
                    }}
                    onSave={updateExerciseList}
                  />
                  <Button>Vinculado</Button>
                </Card.Content>
              </Card>
            )}
          />
        </Card.Content>
      </Card>
    </View>
  );
};
export default StepExerciseIA;
