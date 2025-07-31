import type { ExerciseWorkout } from '@/api/workout/workout.types';
import { ExerciseCard } from '@/components/ExerciseCard';
import InfoField from '@/components/InfoField';
import { useTheme } from '@/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCallback } from 'react';
import { useWatch } from 'react-hook-form';
import { FlatList, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface StepReviewAndSubmitProps {
  control?: any;
  removeExercise: (exerciseId: string) => void;
  exercisesList: ExerciseWorkout[];
  setExercisesList: React.Dispatch<React.SetStateAction<ExerciseWorkout[]>>;
  updateExerciseList: (exercise: ExerciseWorkout) => void;
}

const StepReviewAndSubmit = ({
  control,
  removeExercise,
  exercisesList,
  updateExerciseList,
}: StepReviewAndSubmitProps) => {
  const allValues = useWatch({ control });
  const { theme } = useTheme();

  const renderExerciseItem = useCallback(
    ({ item }: { item: ExerciseWorkout }) => {
      const isLinked = Boolean(
        item.exerciseId?.id && item.exerciseId.id.trim() !== ''
      );

      return (
        <ExerciseCard
          isLinked={isLinked}
          item={item}
          removeExercise={removeExercise}
          updateExerciseList={updateExerciseList}
        />
      );
    },
    [exercisesList, theme]
  );

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
            description={
              Array.isArray(allValues.muscleGroup)
                ? allValues.muscleGroup.join(', ')
                : ''
            }
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
          <FlatList
            data={exercisesList}
            initialNumToRender={10}
            keyExtractor={(item) => item.exerciseId.name}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', padding: 40 }}>
                <MaterialCommunityIcons
                  color="#999"
                  name="playlist-remove"
                  size={48}
                />
                <Text
                  style={{ fontSize: 16, marginVertical: 12, color: '#555' }}
                >
                  Nenhuma exercício encontrado.
                </Text>
              </View>
            }
            renderItem={renderExerciseItem}
          />
        </Card.Content>
      </Card>
    </View>
  );
};
export default StepReviewAndSubmit;
