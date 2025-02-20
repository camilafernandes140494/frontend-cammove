import React, { useState } from 'react';
import { FlatList, View, } from 'react-native';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from './FormField';
import {
  Text, Button,
  Modal, Portal,
  Card,
  Chip
} from 'react-native-paper';
import { getExercises } from '@/api/exercise/exercise.api';
import { useQuery } from '@tanstack/react-query';
import { ExerciseWorkout } from '@/api/workout/workout.types';

interface ExerciseModalProps {
  onSave: (exercise: ExerciseWorkout) => void
}

const ExerciseModal = ({ onSave }: ExerciseModalProps) => {
  const [visibleModal, setVisibleModal] = useState(false);

  const showModal = () => setVisibleModal(true);
  const hideModal = () => setVisibleModal(false);

  const modalSchema = z.object({
    exerciseId: z.object({
      name: z.string(),
      description: z.string(),
      category: z.string(),
      muscleGroup: z.array(z.string()).optional(),
      images: z.array(z.string()).optional(),
      createdAt: z.string().optional(),
      updatedAt: z.string().optional(),
      deletedAt: z.string().optional(),
      id: z.string().optional(),
    }).nullable().refine(value => value !== null, { message: "Selecione um exercício" }),
    repetitions: z.string().min(1, "Informe a quantidade de repetições"),
    sets: z.string().min(1, "Informe o número de séries"),
    restTime: z.string().min(1, "Informe o tempo de descanso"),
    observations: z.string().optional(),
  });


  const { control, handleSubmit, watch, reset } = useForm<z.infer<typeof modalSchema>>({
    resolver: zodResolver(modalSchema),
    defaultValues: {
      exerciseId: {},
      repetitions: '',
      sets: '',
      restTime: '',
      observations: ''
    },
  });

  const selectedExerciseId = watch("exerciseId");

  const addExercise = (exercise: any) => {
    reset();
    onSave(exercise)
    hideModal();
  };
  const [params, setParams] = useState<{ name: string }>();

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['getExercises', params],
    queryFn: () => getExercises(params),
    enabled: true
  });

  return (
    <FlatList
      style={{ flex: 1, }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      data={[{}]}
      keyExtractor={() => 'FormWorkout'}
      renderItem={() => <>

        <Portal>
          <Modal visible={visibleModal} onDismiss={hideModal} contentContainerStyle={{ backgroundColor: 'white', padding: 20 }}>
            <FormField
              control={control}
              name="exerciseId"
              label="Selecione um exercício"
              type="select"
              getLabel={(option) => option.name}
              options={exercises}
            />
            {!!selectedExerciseId.id && <Card>
              <Card.Title
                title={selectedExerciseId?.name}
                subtitle={selectedExerciseId?.description}
              />
              <Card.Content >
                <Text variant="bodyMedium">{selectedExerciseId.category}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
                  {selectedExerciseId?.muscleGroup?.map((muscleGroup, index) => <Chip
                    key={index}
                  >
                    {muscleGroup}
                  </Chip>
                  )}
                </View>
              </Card.Content>
            </Card>
            }

            <FormField control={control} name="repetitions" label="Quantidade de repetições" type="text" />
            <FormField control={control} name="sets" label="Número de séries" type="text" />
            <FormField control={control} name="restTime" label="Tempo de descanso" type="text" />
            <FormField control={control} name="observations" label="Observações (opcional)" type="text" />

            <Button mode="contained" onPress={handleSubmit(addExercise)}>
              Salvar
            </Button>
          </Modal>
        </Portal>
        <Button mode="text" style={{ marginTop: 30 }} onPress={showModal}>
          Adicionar Exercício
        </Button>

      </>
      }
    />
  );
};


export default ExerciseModal;