import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import {
  Text,
  Snackbar, Appbar, Card,
  Avatar,
  SegmentedButtons
} from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { calculateAge, getGender, getInitials } from '@/common/common';
import { useTheme } from '../ThemeContext';
import { useStudent } from '../context/StudentContext';

const DetailsWorkout = (navigation: any) => {
  const [visible, setVisible] = useState(false);
  const route = useRoute();
  const { workoutId } = route.params as { workoutId: string | undefined };
  const { theme } = useTheme();
  const { student } = useStudent();
  const [value, setValue] = useState('');

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


  const onSubmit = (data: any) => console.log("Formulário enviado", data);

  return (
    <FlatList
      style={{ flex: 1, }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      ListHeaderComponent={
        <>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.navigate('Workouts')} />
            <Appbar.Content title="Detakhe do treino" />
          </Appbar.Header>
          <View style={{ backgroundColor: theme.colors.secondaryContainer }}>
            <Card.Title
              title={`${student?.name} ${calculateAge(student?.birthDate || '')} anos`}
              subtitle={`Gênero: ${getGender(student?.gender || '')}`}
              left={(props) => <Avatar.Text {...props} label={getInitials(student?.name || '')} />}
            />
          </View>
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            buttons={[
              {
                value: 'workouts',
                label: 'Treinos',
              },
              {
                value: 'train',
                label: 'Detalhe do treino',
              },
              { value: 'drive', label: 'Driving' },
            ]}
          />
          <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            action={{
              label: '',
              icon: 'close',
              onPress: () => setVisible(false),
            }}
          >
            <Text>Erro ao cadastrar</Text>
          </Snackbar>
        </>
      }
      data={[{}]}
      keyExtractor={() => 'header'}
      renderItem={() => <>


      </>
      }
    />
  );
};

export default DetailsWorkout;
