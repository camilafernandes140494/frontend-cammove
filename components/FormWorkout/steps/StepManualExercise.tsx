import type { ExerciseWorkout } from '@/api/workout/workout.types';
import CustomModal from '@/components/CustomModal';
import ExerciseModal from '@/components/ExerciseModal';
import { View } from 'react-native';
import { Card, Chip, Text } from 'react-native-paper';

interface StepManualExerciseeProps {
  removeExercise: (exerciseId: string) => void;
  exercisesList: ExerciseWorkout[];
  setExercisesList: React.Dispatch<React.SetStateAction<ExerciseWorkout[]>>;
  updateExerciseList: (exercise: ExerciseWorkout) => void;
}

const StepManualExercise = ({
  removeExercise,
  setExercisesList,
  exercisesList,
  updateExerciseList,
}: StepManualExerciseeProps) => {
  return (
    <>
      <Text variant="titleMedium">Selecione os exercícios</Text>
      <View style={{ marginVertical: 20 }}>
        <Card mode="outlined">
          <Card.Content>
            {exercisesList.length > 0 ? (
              exercisesList.map((exercisesListData) => (
                <Card
                  key={exercisesListData?.exerciseId.id}
                  style={{ marginVertical: 10 }}
                >
                  <Card.Title
                    right={() => (
                      <ExerciseModal
                        exercise={exercisesListData}
                        onSave={updateExerciseList}
                      />
                    )}
                    subtitle={exercisesListData?.exerciseId.category}
                    title={exercisesListData?.exerciseId.name}
                  />
                  <Card.Content
                    style={{
                      flexDirection: 'row',
                      gap: 16,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View>
                      <Chip icon="repeat">{`${exercisesListData.repetitions} ${exercisesListData.sets && `x ${exercisesListData.sets}`}`}</Chip>
                    </View>

                    <CustomModal
                      onPress={() =>
                        removeExercise(exercisesListData?.exerciseId.id || '')
                      }
                      primaryButtonLabel="Deletar"
                      title="Tem certeza que deseja deletar o exercício?"
                    />
                  </Card.Content>
                </Card>
              ))
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                Nenhum exercício encontrado
              </Text>
            )}

            <ExerciseModal
              onSave={(exercise) =>
                setExercisesList((prev) => [...prev, exercise])
              }
            />
          </Card.Content>
        </Card>
      </View>
    </>
  );
};
export default StepManualExercise;
