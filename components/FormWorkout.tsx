import React, { useState } from 'react';
import { FlatList, View, } from 'react-native';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudent } from '@/app/context/StudentContext';
import { FormField } from './FormField';
import {
  Text, Button, Card,
  IconButton,
  Portal,
  Modal,
  Chip,
  Snackbar
} from 'react-native-paper';
import ExerciseModal from './ExerciseModal';
import { ExerciseWorkout } from '@/api/workout/workout.types';
import { postWorkout } from '@/api/workout/workout.api';
import { useUser } from '@/app/UserContext';
import { useNavigation } from '@react-navigation/native';

const FormWorkout = () => {
  const [visible, setVisible] = useState(false);
  const { student } = useStudent();
  const { user } = useUser();
  const navigation = useNavigation();

  const [exercisesList, setExercisesList] = useState<ExerciseWorkout[]>([]);

  // const { data: exerciseById, isLoading } = useQuery({
  //     queryKey: ['getExerciseById', exerciseId],
  //     queryFn: () => getExerciseById(exerciseId || ''),
  //     enabled: !!exerciseId
  // });

  const schema = z.object({
    type: z.object({
      label: z.string(),
      value: z.string(),
    }).nullable().refine(value => value !== null, { message: "Adicione um objetivo ao treino" }),
    customType: z.string(),
  });

  const { control, handleSubmit, watch, } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: {},
      customType: ""
    },
  });

  const selectedType = watch("type");

  const onSubmit = async (data: any) => {
    const typeData = data.type ? data.type.label : data.customType
    const workoutData = {
      type: typeData as string,
      exercises: exercisesList,
      studentId: student?.id || '',
      studentName: student?.name || ''
    }
    try {
      await postWorkout(user.id || '', student?.id || '', workoutData);
      navigation.navigate('Workouts' as never);

    } catch (error) {
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: '',
          icon: 'close',
          onPress: () => setVisible(false),
        }}
      >
        <Text>Erro ao cadastrar treino</Text>
      </Snackbar>
    }
  }

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
        <View style={{ padding: 20 }}>
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

                  <DeleteExerciseModal onPress={() => removeExercise(exercisesListData?.exerciseId.id || '')} />
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>Nenhum exercício encontrado</Text>
          )}

          <ExerciseModal onSave={(exercise) => setExercisesList((prev) => [...prev, exercise])} />
          <Button mode="contained" onPress={handleSubmit(onSubmit)}>
            Enviar
          </Button>
        </View>
      </>
      }
    />
  );
};
export default FormWorkout;


interface DeleteExerciseModalProps {
  onPress: () => void
}

export const DeleteExerciseModal = ({ onPress }: DeleteExerciseModalProps) => {
  const [visibleModal, setVisibleModal] = useState(false);

  return (
    <>
      <Portal>
        <Modal visible={visibleModal} onDismiss={() => setVisibleModal(false)} contentContainerStyle={{ backgroundColor: 'white', padding: 20, gap: 16 }}>
          <Text variant="bodyMedium">Tem certeza que deseja deletar o exercício?</Text>

          <Button mode="contained-tonal" onPress={() => setVisibleModal(false)}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={onPress}>
            Deletar
          </Button>
        </Modal>

      </Portal>
      <IconButton
        icon="delete"
        size={20}
        onPress={() => setVisibleModal(true)}
      />

    </>
  );
};


