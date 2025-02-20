import React, { useState } from 'react';
import { FlatList, View, } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudent } from '@/app/context/StudentContext';
import { FormField } from './FormField';
import {
  Text, Button, Card,
  IconButton
} from 'react-native-paper';
import ExerciseModal from './ExerciseModal';
import { ExerciseWorkout } from '@/api/workout/workout.types';

const FormWorkout = () => {
  const [visible, setVisible] = useState(false);
  const route = useRoute();
  const { student } = useStudent();
  const [exercisesList, setExercisesList] = useState<ExerciseWorkout[]>([]);

  // const { data: exerciseById, isLoading } = useQuery({
  //     queryKey: ['getExerciseById', exerciseId],
  //     queryFn: () => getExerciseById(exerciseId || ''),
  //     enabled: !!exerciseId
  // });

  const schema = z.object({
    type: z.string(),
    role: z.enum(["admin", "user"], { required_error: "Selecione um papel" }),
  });

  const { control, handleSubmit, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "",
      role: "user" as "admin" | "user",
    },
  });

  const selectedType = watch("type");

  const onSubmit = (data: any) => { console.log("Formulário enviado", data) }

  const [params, setParams] = useState<{ name: string }>();

  return (
    <FlatList
      style={{ flex: 1, }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      data={[{}]}
      keyExtractor={() => 'FormWorkout'}
      renderItem={() => <>
        <View style={{ padding: 20 }}>
          {selectedType !== "" &&
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
          {selectedType === "personalizado" && (
            <FormField control={control} name="customType" label="Objetivo do Treino" type="text" />
          )}

          {
            exercisesList.map((exercisesListData) =>
              <Card >

                <Card.Title
                  title={exercisesListData?.exerciseId.name}
                  subtitle={exercisesListData?.exerciseId.category}
                  right={(props) => <IconButton {...props} icon="chevron-right" onPress={() => { }} />}

                />
                <Card.Actions>
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => console.log('Pressed')}
                  />
                  <IconButton
                    icon="content-duplicate"
                    size={20}
                    onPress={() => console.log('Pressed')}
                  />
                </Card.Actions>
              </Card>
            )
          }
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