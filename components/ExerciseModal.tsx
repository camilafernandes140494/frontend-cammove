import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from './FormField';
import {
  Text, Button,
  Modal, Portal,
  Card,
  Chip,
} from 'react-native-paper';
import { getExercises } from '@/api/exercise/exercise.api';
import { useQuery } from '@tanstack/react-query';
import { ExerciseWorkout } from '@/api/workout/workout.types';
import { useTheme } from '@/context/ThemeContext';

interface ExerciseModalProps {
  onSave: (exercise: ExerciseWorkout) => void,
  exercise?: ExerciseWorkout,
}

const ExerciseModal = ({ onSave, exercise }: ExerciseModalProps) => {
  const [visibleModal, setVisibleModal] = useState(false);
  const { theme } = useTheme();

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
    sets: z.string().optional(),
    restTime: z.string().min(1, "Informe o tempo de descanso"),
    observations: z.string().optional(),
  });


  const { control, handleSubmit, watch, reset } = useForm<z.infer<typeof modalSchema>>({
    resolver: zodResolver(modalSchema),
    defaultValues: {
      exerciseId: exercise?.exerciseId || {},
      repetitions: exercise?.repetitions || '',
      sets: exercise?.sets || '',
      restTime: exercise?.restTime || '30 segundos',
      observations: exercise?.observations || ''
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
    <>
      <Portal>
        <Modal visible={visibleModal} onDismiss={hideModal} contentContainerStyle={{ backgroundColor: theme.colors.background, padding: 20, marginHorizontal: 16 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              <FormField
                control={control}
                name="exerciseId"
                label="Selecione um exercício"
                type="select"
                getLabel={(option) => option.name}
                options={exercises}
              />
              {!!selectedExerciseId.id && <Card style={{ margin: 20 }}>
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
              <Button mode="outlined" theme={{ colors: { outline: theme.colors.primary } }} onPress={hideModal} style={{ marginBottom: 16 }} >
                Cancelar
              </Button>
              <Button mode="contained" onPress={handleSubmit(addExercise)}>
                Salvar
              </Button>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>

      </Portal >

      <Button icon={exercise ? undefined : "plus"} mode="text" style={{ marginVertical: 16 }} onPress={showModal}>
        {exercise ? "Editar" : "Adicionar Exercício"}
      </Button>
    </>
  );
};


export default ExerciseModal;