/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import { getExercises } from '@/api/exercise/exercise.api';
import type { Exercise } from '@/api/exercise/exercise.types';
import { postWorkoutSuggestion } from '@/api/openai/gemini.api';
import type { ExerciseWorkout } from '@/api/workout/workout.types';
import { calculateAge } from '@/common/common';
import CustomModal from '@/components/CustomModal';
import ExerciseModal from '@/components/ExerciseModal';
import { FormField } from '@/components/FormField';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';
import { useWorkoutForm } from '@/context/WorkoutFormContext';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useWatch } from 'react-hook-form';
import { FlatList, View } from 'react-native';
import { Button, Card, Chip, Icon, IconButton, Text } from 'react-native-paper';

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

  const { setWorkoutSuggestion, workoutSuggestion } = useWorkoutForm();
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

  useEffect(() => {
    setWorkoutSuggestion(exercisesList);
  }, [exercisesList, setWorkoutSuggestion]);

  const mutation = useMutation({
    mutationFn: async () => {
      return await postWorkoutSuggestion({
        age: String(calculateAge(student?.birthDate || '')),
        gender: student?.gender || 'unissex',
        nameWorkout: allValues.nameWorkou || '',
        type: allValues.type.value || allValues.customType || '',
        level: allValues.level,
        muscleGroup: allValues.muscleGroup || [],
        amountExercises: allValues.amountExercises || 4,
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
            id: '',
            image: '',
            category: '',
            muscleGroup: [],
            video: '',
            createdAt: '',
            updatedAt: '',
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
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{ flexShrink: 1, flexWrap: 'wrap' }}
                variant="titleMedium"
              >
                {item.exerciseId.name}
              </Text>
              {!isLinked && (
                <CustomModal
                  onOpen={() => {
                    const matchName = searchByName(item.exerciseId.name)?.[0];
                    setMatch(matchName || null);
                  }}
                  onPress={() => {
                    if (match) {
                      removeExercise(item.exerciseId.name || '');
                      updateExerciseList({
                        ...item,
                        exerciseId: match,
                      });
                    }
                  }}
                  primaryButtonLabel={
                    match
                      ? 'Substituir Exercício'
                      : 'Nenhum Exercício Encontrado'
                  }
                  showPrimaryButton={Boolean(match)}
                  title="Alternar Exercício"
                  trigger={<IconButton icon="sync" size={20} />}
                >
                  <Card mode="outlined">
                    <Card.Content
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 16,
                        paddingVertical: 20,
                      }}
                    >
                      {/* Título Explicativo */}
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          textAlign: 'center',
                        }}
                      >
                        Substituir Exercício Gerado pela IA
                      </Text>

                      {/* Exercício atual */}
                      <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ fontSize: 14, color: '#666' }}>
                          Exercício Atual:
                        </Text>
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: theme.colors.primary,
                          }}
                        >
                          {item.exerciseId.name}
                        </Text>
                      </View>

                      {/* Ícone animado entre eles */}
                      <Icon
                        color={theme.colors.primary}
                        size={48}
                        source={'sync'}
                      />

                      {/* Match encontrado */}
                      {match ? (
                        <View style={{ alignItems: 'center' }}>
                          <Text style={{ fontSize: 14, color: '#666' }}>
                            Será substituído por:
                          </Text>
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: '600',
                              color: theme.colors.primary,
                            }}
                          >
                            {match.name}
                          </Text>
                        </View>
                      ) : (
                        <Text
                          style={{
                            color: '#999',
                            textAlign: 'center',
                            marginTop: 8,
                          }}
                        >
                          Nenhum exercício parecido foi encontrado na base.
                        </Text>
                      )}

                      {/* Dica para o usuário */}
                      <Text
                        style={{
                          fontSize: 12,
                          color: '#777',
                          marginTop: 12,
                          textAlign: 'center',
                        }}
                      >
                        Essa ação irá substituir o exercício gerado
                        automaticamente por um equivalente da base de dados.
                      </Text>
                    </Card.Content>
                  </Card>
                </CustomModal>
              )}
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

            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 24,
              }}
            >
              <CustomModal
                cancelButtonLabel="Entendi"
                onPress={() => console.log('Vinculado')}
                showPrimaryButton={false}
                title={isLinked ? 'Vinculado' : 'Não vinculado'}
                trigger={
                  <Chip
                    icon={() => (
                      <Ionicons
                        color={isLinked ? '#2E7D32' : '#D32F2F'}
                        name={isLinked ? 'checkmark-circle' : 'alert-circle'}
                        size={18}
                      />
                    )}
                    style={{
                      backgroundColor: isLinked ? '#E8F5E9' : '#FFEBEE',
                    }}
                    textStyle={{
                      color: isLinked ? '#2E7D32' : '#D32F2F',
                      fontWeight: '600',
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
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <CustomModal
                  onPress={() => removeExercise(item?.exerciseId.name || '')}
                  primaryButtonLabel="Deletar"
                  title="Tem certeza que deseja deletar o exercício?"
                />
                <ExerciseModal
                  exercise={item}
                  onSave={(exerciseData) => {
                    removeExercise(item.exerciseId.name || '');
                    updateExerciseList(exerciseData);
                  }}
                  triggerWithIcon={true}
                />
              </View>
            </View>
          </Card.Content>
        </Card>
      );
    },
    [updateExerciseList, updateExerciseList, removeExercise, theme, match]
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
              keyExtractor={(item) => item.exerciseId.name}
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
