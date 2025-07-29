import type { ExerciseWorkout } from '@/api/workout/workout.types';
import InfoField from '@/components/InfoField';
import { useWatch } from 'react-hook-form';
import { View } from 'react-native';
import { Button, Card } from 'react-native-paper';

interface StepReviewAndSubmitProps {
  onSubmit?: () => void;
  disabled: boolean;
  loading: boolean;
  control?: any;
  removeExercise: (exerciseId: string) => void;
  exercisesList: ExerciseWorkout[];
  setExercisesList: React.Dispatch<React.SetStateAction<ExerciseWorkout[]>>;
  updateExerciseList: (exercise: ExerciseWorkout) => void;
}

const StepReviewAndSubmit = ({
  onSubmit,
  disabled,
  control,
  removeExercise,
  exercisesList,
  updateExerciseList,
  loading,
}: StepReviewAndSubmitProps) => {
  const allValues = useWatch({ control });

  return (
    <View style={{ marginVertical: 20, gap: 24 }}>
      <Card mode="outlined">
        <Card.Title title="Dados do treino" />
        <Card.Content>
          <InfoField
            description={allValues.nameWorkout || ''}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            title="Nome do treino"
          />

          <InfoField
            description={allValues.level || ''}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            title="Intesidade"
          />
          <InfoField
            description={allValues.type.value || allValues.customType || ''}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            title="Objetivo"
          />
          <InfoField
            description={allValues.muscleGroup.join(', ') || ''}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
            title="Grupo muscular"
          />
        </Card.Content>
      </Card>
      <Card mode="outlined">
        <Card.Content>
          <Button
            disabled={disabled}
            loading={loading}
            mode="contained"
            onPress={onSubmit}
          >
            Enviar
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};
export default StepReviewAndSubmit;
