import { postWorkoutSuggestion } from '@/api/openai/gemini.api';
import type { WorkoutSuggestionResponse } from '@/api/openai/gemini.type';
import {
  getWorkoutByStudentIdAndWorkoutId,
  patchWorkout,
  postWorkout,
} from '@/api/workout/workout.api';
import type { ExerciseWorkout } from '@/api/workout/workout.types';
import { useStudent } from '@/context/StudentContext';
import { useUser } from '@/context/UserContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  ProgressBar,
  SegmentedButtons,
  Text,
} from 'react-native-paper';
import * as z from 'zod';
import CustomModal from './CustomModal';
import ExerciseModal from './ExerciseModal';
import { FormField } from './FormField';

interface FormWorkoutProps {
  workoutId?: string;
}
const FormWorkout = ({ workoutId }: FormWorkoutProps) => {
  const [visible, setVisible] = useState(false);
  const { student } = useStudent();
  const { user } = useUser();
  const navigation = useNavigation();
  const [workoutSuggestion, setWorkoutSuggestion] = useState<{
    treino: WorkoutSuggestionResponse[];
  } | null>(null);
  const [isIA, setIsIA] = useState<'manual' | 'ia'>('manual');
  const [step, setStep] = useState(1);

  const { data: workoutByStudent } = useQuery({
    queryKey: ['getWorkoutByStudentIdAndWorkoutId', workoutId, student?.id],
    queryFn: () =>
      getWorkoutByStudentIdAndWorkoutId(workoutId || '', student?.id || ''),
    enabled: !!workoutId,
  });

  const [exercisesList, setExercisesList] = useState<ExerciseWorkout[]>([]);

  console.log(workoutSuggestion?.treino);
  useEffect(() => {
    if (workoutByStudent?.exercises) {
      setExercisesList(workoutByStudent?.exercises);
    }
  }, [workoutByStudent]);

  const schema = z.object({
    type: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional()
      .refine((value) => value !== undefined, {
        message: 'Adicione um objetivo ao treino',
      }),
    customType: z.string(),
    nameWorkout: z.string(),
  });

  const { control, handleSubmit, watch, reset } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      type: workoutByStudent?.type
        ? {
            label: workoutByStudent?.type || '',
            value: workoutByStudent?.type || '',
          }
        : {},
      customType: workoutByStudent?.type || '',
      nameWorkout: workoutByStudent?.nameWorkout || '',
    },
  });

  useEffect(() => {
    if (workoutByStudent) {
      reset({
        type: workoutByStudent?.type
          ? { label: workoutByStudent.type, value: workoutByStudent.type }
          : undefined,
        customType: workoutByStudent?.type || '',
        nameWorkout: workoutByStudent?.nameWorkout || '',
      });
    }
  }, [workoutByStudent, reset]);

  const selectedType = watch('type');

  const mutation = useMutation({
    mutationFn: async (data: { workoutId?: string; workoutData: any }) => {
      const { workoutId, workoutData } = data;
      if (workoutId) {
        return await patchWorkout(
          workoutId,
          user?.id || '',
          student?.id || '',
          workoutData
        );
      }
      return await postWorkout(user?.id || '', student?.id || '', workoutData);
    },
    onSuccess: () => {
      navigation.navigate('Workouts' as never);
    },
    onError: () => {
      setVisible(true);
    },
  });

  const onSubmit = async (data: any) => {
    const typeData = data.type ? data.type.label : data.customType;

    const workoutData = {
      type: typeData as string,
      exercises: exercisesList,
      studentId: student?.id || '',
      studentName: student?.name || '',
      nameWorkout: data.nameWorkout || 'Treino ',
    };

    mutation.mutate({ workoutId, workoutData });
  };

  const removeExercise = (exerciseId: string) => {
    setExercisesList((prevList) =>
      prevList.filter((exercise) => exercise.exerciseId.id !== exerciseId)
    );
  };

  const updateExerciseList = (exercise: ExerciseWorkout) => {
    setExercisesList((prevList) => {
      const index = prevList.findIndex(
        (ex) => ex.exerciseId.id === exercise.exerciseId.id
      );
      if (index !== -1) {
        const updatedList = [...prevList];
        updatedList[index] = exercise;
        return updatedList;
      }
      return [...prevList, exercise];
    });
  };

  async function fetchWorkoutSuggestion() {
    try {
      const workoutSuggestions = await postWorkoutSuggestion({
        age: student?.gender || '25',
        gender: student?.gender || 'unissex',
        nameWorkout: 'treino de perna',
        type: 'Hipertrofia',
        level: 'iniciante',
      });
      setWorkoutSuggestion(workoutSuggestions);
    } catch (error) {
      console.error('Erro ao processar o objeto do treino:', error);
    }
  }

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      data={[{}]}
      keyboardShouldPersistTaps="handled"
      keyExtractor={() => 'FormWorkout'}
      renderItem={() => (
        <>
          <View style={{ padding: 20 }}>
            <ProgressBar progress={step / 4} />
            <View style={{ marginVertical: 20 }}>
              {step === 1 && (
                <>
                  <Text variant="titleMedium">Informe os dados do treino</Text>
                  <View style={{ marginVertical: 20 }}>
                    <Card mode="outlined">
                      <Card.Title title="Informações" />
                      <Card.Content>
                        <FormField
                          control={control}
                          label="Nome do treino"
                          name="nameWorkout"
                          type="text"
                        />

                        {selectedType.value !== '' &&
                          selectedType.value !== 'Personalizado' && (
                            <Text style={{ marginBottom: 16 }}>
                              Objetivo de treino
                            </Text>
                          )}

                        <FormField
                          control={control}
                          getLabel={(option) => option.label}
                          label="Escolha seu objetivo de treino"
                          name="type"
                          options={[
                            { label: 'Personalizado', value: 'Personalizado' },
                            { label: 'Hipertrofia', value: 'Hipertrofia' },
                            { label: 'Emagrecimento', value: 'Emagrecimento' },
                            { label: 'Resistência', value: 'Resistência' },
                            { label: 'Definição', value: 'Definição' },
                            { label: 'Força', value: 'Força' },
                            { label: 'Flexibilidade', value: 'Flexibilidade' },
                            { label: 'Equilíbrio', value: 'Equilíbrio' },
                            { label: 'Saúde geral', value: 'Saúde geral' },
                            { label: 'Velocidade', value: 'Velocidade' },
                            {
                              label: 'Desempenho atlético',
                              value: 'Desempenho atlético',
                            },
                            { label: 'Pré-natal', value: 'Pré-natal' },
                            { label: 'Reabilitação', value: 'Reabilitação' },
                            { label: 'Mobilidade', value: 'Mobilidade' },
                            { label: 'Potência', value: 'Potência' },
                          ]}
                          type="select"
                        />
                        {selectedType.value === 'Personalizado' && (
                          <FormField
                            control={control}
                            label="Objetivo do Treino"
                            name="customType"
                            type="text"
                          />
                        )}
                      </Card.Content>
                    </Card>
                  </View>
                </>
              )}

              {step === 2 && (
                <>
                  <Text variant="titleMedium">
                    Escolha como montar o treino
                  </Text>
                  <View style={{ marginVertical: 20 }}>
                    <Card mode="outlined">
                      <Card.Title title="Como deseja montar o treino?" />
                      <Card.Content>
                        <SegmentedButtons
                          buttons={[
                            {
                              value: 'manual',
                              label: 'Cadastro manual',
                              icon: 'lightbulb',
                            },
                            {
                              value: 'ia',
                              label: 'Sugestão IA',
                              icon: 'creation',
                            },
                          ]}
                          onValueChange={setIsIA}
                          value={isIA}
                        />{' '}
                        {isIA === 'ia' && (
                          <Button
                            icon={'creation'}
                            onPress={fetchWorkoutSuggestion}
                          >
                            Sugerir exercícios
                          </Button>
                        )}
                      </Card.Content>
                    </Card>
                  </View>
                </>
              )}

              {step === 3 && (
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
                                right={(props) => (
                                  <ExerciseModal
                                    exercise={exercisesListData}
                                    onSave={updateExerciseList}
                                  />
                                )}
                                subtitle={
                                  exercisesListData?.exerciseId.category
                                }
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
                                    removeExercise(
                                      exercisesListData?.exerciseId.id || ''
                                    )
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
              )}

              {step === 4 && (
                <>
                  <Text variant="titleMedium">Revisar e enviar</Text>
                  <View style={{ marginVertical: 20 }}>
                    <Card mode="outlined">
                      <Card.Content>
                        <Button
                          disabled={mutation.isPending}
                          loading={mutation.isPending}
                          mode="contained"
                          onPress={handleSubmit(onSubmit)}
                        >
                          Enviar
                        </Button>
                      </Card.Content>
                    </Card>
                  </View>
                </>
              )}
              <Button
                disabled={step === 1}
                mode="outlined"
                onPress={() => setStep((prev) => prev - 1)}
                style={{ marginTop: 16 }}
              >
                Voltar
              </Button>
              <Button
                disabled={step === 4}
                mode="contained"
                onPress={() => setStep((prev) => prev + 1)}
                style={{ marginTop: 16 }}
              >
                Próximo
              </Button>
            </View>
          </View>
        </>
      )}
      style={{ flex: 1 }}
    />
  );
};
export default FormWorkout;
