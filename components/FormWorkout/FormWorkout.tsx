/** biome-ignore-all lint/suspicious/noConsole: <explanation> 1213*/

import {
  getWorkoutByStudentIdAndWorkoutId,
  patchWorkout,
  postWorkout,
} from '@/api/workout/workout.api';
import type { ExerciseWorkout } from '@/api/workout/workout.types';
import { useStudent } from '@/context/StudentContext';
import { useUser } from '@/context/UserContext';
import { useWorkoutForm } from '@/context/WorkoutFormContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList, View } from 'react-native';
import { Button, Icon, ProgressBar, Text } from 'react-native-paper';
import * as z from 'zod';
import StepChooseType from './steps/StepChooseType';
import StepExerciseIA from './steps/StepExerciseIA';
import StepManualExercise from './steps/StepManualExercise';
import StepReviewAndSubmit from './steps/StepReviewAndSubmit';
import StepTrainingData from './steps/StepTrainingData';

interface FormWorkoutProps {
  workoutId?: string;
}
const FormWorkout = ({ workoutId }: FormWorkoutProps) => {
  const [visible, setVisible] = useState(false);
  const { student } = useStudent();
  const { user } = useUser();
  const navigation = useNavigation();

  const { step, nextStep, prevStep, goToStep, isGeneratedByIA } =
    useWorkoutForm();

  const { data: workoutByStudent } = useQuery({
    queryKey: ['getWorkoutByStudentIdAndWorkoutId', workoutId, student?.id],
    queryFn: () =>
      getWorkoutByStudentIdAndWorkoutId(workoutId || '', student?.id || ''),
    enabled: !!workoutId,
  });

  const [exercisesList, setExercisesList] = useState<ExerciseWorkout[]>([]);

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

  const nameWorkout = watch('nameWorkout');
  const type = watch('type');
  const customType = watch('customType');

  const isStepValid = () => {
    if (step === 1) {
      console.log(nameWorkout, type, customType);

      if (type?.value === 'Personalizado') {
        return nameWorkout?.trim() !== '' && customType?.trim() !== '';
      }

      return (
        nameWorkout?.trim() !== '' &&
        type?.value !== undefined &&
        type?.value.trim() !== ''
      );
    }

    return true;
  };

  const stepItems = [
    { label: 'Informe os dados do treino', icon: 'clipboard-text' },
    { label: 'Escolha como montar o treino', icon: 'tune' },
    { label: 'Selecionar os exercícios', icon: 'dumbbell' },
    { label: 'Validar exercícios', icon: 'dumbbell' },
    { label: 'Revisar e enviar', icon: 'check-circle-outline' },
  ];

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      data={[{}]}
      keyboardShouldPersistTaps="handled"
      keyExtractor={() => 'FormWorkout'}
      renderItem={() => (
        <>
          <View style={{ padding: 20 }}>
            <ProgressBar progress={step / 5} />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginVertical: 8,
              }}
            >
              <Icon size={20} source={stepItems[step - 1].icon ?? ''} />
              <Text variant="titleMedium">
                {stepItems[step - 1].label ?? ''}
              </Text>
            </View>
            <View style={{ marginVertical: 20 }}>
              {step === 1 && (
                <StepTrainingData
                  control={control}
                  selectedType={selectedType.value}
                />
              )}

              {step === 2 && <StepChooseType />}

              {step === 3 && (
                <StepManualExercise
                  exercisesList={exercisesList}
                  removeExercise={removeExercise}
                  setExercisesList={setExercisesList}
                  updateExerciseList={updateExerciseList}
                />
              )}
              {step === 4 && (
                <StepExerciseIA
                  exercisesList={exercisesList}
                  removeExercise={removeExercise}
                  setExercisesList={setExercisesList}
                  updateExerciseList={updateExerciseList}
                />
              )}
              {step === 5 && (
                <StepReviewAndSubmit
                  disabled={mutation.isPending}
                  loading={mutation.isPending}
                  onSubmit={handleSubmit(onSubmit)}
                />
              )}
              <Button
                disabled={step === 1}
                mode="outlined"
                onPress={() => {
                  if (step === 4 && isGeneratedByIA) {
                    goToStep(2);
                  } else {
                    prevStep();
                  }
                }}
                style={{ marginTop: 16 }}
              >
                Voltar
              </Button>
              <Button
                disabled={step === 5 || !isStepValid()}
                mode="contained"
                onPress={() => {
                  if (step === 2 && isGeneratedByIA) {
                    goToStep(4);
                  } else {
                    nextStep();
                  }
                }}
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
