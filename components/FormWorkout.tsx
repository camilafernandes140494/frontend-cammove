import React, { useEffect, useState } from 'react';
import { FlatList, View, } from 'react-native';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudent } from '@/context/StudentContext';
import { FormField } from './FormField';
import {
  Text, Button, Card, Chip
} from 'react-native-paper';
import ExerciseModal from './ExerciseModal';
import { ExerciseWorkout } from '@/api/workout/workout.types';
import { getWorkoutByStudentIdAndWorkoutId, patchWorkout, postWorkout } from '@/api/workout/workout.api';
import { useUser } from '@/context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import CustomModal from './CustomModal';

interface FormWorkoutProps {
  workoutId?: string;
};
const FormWorkout = ({ workoutId }: FormWorkoutProps) => {
  const [visible, setVisible] = useState(false);
  const { student } = useStudent();
  const { user } = useUser();
  const navigation = useNavigation();

  const { data: workoutByStudent, } = useQuery({
    queryKey: ['getWorkoutByStudentIdAndWorkoutId', workoutId, student?.id],
    queryFn: () => getWorkoutByStudentIdAndWorkoutId(workoutId || '', student?.id || ''),
    enabled: !!workoutId
  });

  const [exercisesList, setExercisesList] = useState<ExerciseWorkout[]>([]);

  useEffect(() => {
    if (workoutByStudent?.exercises) {
      setExercisesList(workoutByStudent?.exercises)
    }
  }, [workoutByStudent])

  const schema = z.object({
    type: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .optional()
      .refine(value => value !== undefined, { message: "Adicione um objetivo ao treino" }),
    customType: z.string(),
    nameWorkout: z.string(),
  });


  const { control, handleSubmit, watch, reset } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: workoutByStudent?.type ? { label: workoutByStudent?.type || '', value: workoutByStudent?.type || '' } : {},
      customType: workoutByStudent?.type || "",
      nameWorkout: workoutByStudent?.nameWorkout || ""
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

  const selectedType = watch("type");

  const mutation = useMutation({
    mutationFn: async (data: { workoutId?: string; workoutData: any }) => {
      const { workoutId, workoutData } = data;
      if (workoutId) {
        return await patchWorkout(workoutId, user?.id || '', student?.id || '', workoutData);
      } else {
        return await postWorkout(user?.id || '', student?.id || '', workoutData);
      }
    },
    onSuccess: () => {
      navigation.navigate('Workouts' as never);
    },
    onError: () => {
      setVisible(true);
    }
  });

  const onSubmit = async (data: any) => {
    const typeData = data.type ? data.type.label : data.customType;

    const workoutData = {
      type: typeData as string,
      exercises: exercisesList,
      studentId: student?.id || '',
      studentName: student?.name || '',
      nameWorkout: data.nameWorkout || 'Treino '
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
      const index = prevList.findIndex((ex) => ex.exerciseId.id === exercise.exerciseId.id);
      if (index !== -1) {
        const updatedList = [...prevList];
        updatedList[index] = exercise;
        return updatedList;
      }
      return [...prevList, exercise];
    });
  };


  return (
    <FlatList
      style={{ flex: 1, }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      data={[{}]}
      keyExtractor={() => 'FormWorkout'}
      renderItem={() => <>
        <View style={{ padding: 20, }}>
          <FormField control={control} name="nameWorkout" label="Nome do treino" type="text" />

          {selectedType.value !== "" && selectedType.value !== "Personalizado" &&
            <Text style={{ marginBottom: 16 }}>Objetivo de treino</Text>
          }

          <FormField
            control={control}
            name="type"
            label="Escolha seu objetivo de treino"
            type="select"
            getLabel={(option) => option.label}
            options={[
              { label: "Personalizado", value: "Personalizado" },
              { label: "Hipertrofia", value: "Hipertrofia" },
              { label: "Emagrecimento", value: "Emagrecimento" },
              { label: "Resistência", value: "Resistência" },
              { label: "Definição", value: "Definição" },
              { label: "Força", value: "Força" },
              { label: "Flexibilidade", value: "Flexibilidade" },
              { label: "Equilíbrio", value: "Equilíbrio" },
              { label: "Saúde geral", value: "Saúde geral" },
              { label: "Velocidade", value: "Velocidade" },
              { label: "Desempenho atlético", value: "Desempenho atlético" },
              { label: "Pré-natal", value: "Pré-natal" },
              { label: "Reabilitação", value: "Reabilitação" },
              { label: "Mobilidade", value: "Mobilidade" },
              { label: "Potência", value: "Potência" },
            ]}
          />
          {selectedType.value === "Personalizado" && (
            <FormField control={control} name="customType" label="Objetivo do Treino" type="text" />
          )}

          {exercisesList.length > 0 ? (
            exercisesList.map((exercisesListData) => (
              <Card key={exercisesListData?.exerciseId.id} style={{ marginVertical: 10 }}>
                <Card.Title
                  title={exercisesListData?.exerciseId.name}
                  subtitle={exercisesListData?.exerciseId.category}
                  right={(props) => <ExerciseModal exercise={exercisesListData} onSave={updateExerciseList} />}
                />
                <Card.Content style={{ flexDirection: "row", gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>

                  <View>
                    <Chip icon="repeat">{`${exercisesListData.repetitions} ${exercisesListData.sets && `x ${exercisesListData.sets}`}`}</Chip>
                  </View>

                  <CustomModal
                    onPress={() => removeExercise(exercisesListData?.exerciseId.id || '')}
                    title='Tem certeza que deseja deletar o exercício?'
                    primaryButtonLabel='Deletar' />
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum exercício encontrado</Text>
          )}

          <ExerciseModal onSave={(exercise) => setExercisesList((prev) => [...prev, exercise])} />
          <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={mutation.isPending} loading={mutation.isPending}>
            Enviar
          </Button>
        </View>
      </>
      }
    />
  );
};
export default FormWorkout;




