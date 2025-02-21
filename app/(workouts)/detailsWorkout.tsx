import React, { useState } from 'react';
import { FlatList } from 'react-native';
import {
  Text,
  Snackbar, Appbar,
  Card, IconButton,
  Button
} from 'react-native-paper';
import { useStudent } from '../context/StudentContext';
import { getWorkoutsByStudentId } from '@/api/workout/workout.api';
import { useQuery } from '@tanstack/react-query';
import StudentCard from '@/components/StudentCard';
import Skeleton from '@/components/Skeleton';
import { NavigationProp, useNavigation } from '@react-navigation/native';

export type RootStackParamList = {
  Workouts: undefined;
  CreateWorkout: { workoutId?: string };
};

const DetailsWorkout = () => {
  const [visible, setVisible] = useState(false);
  const { student } = useStudent();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const { data: workoutsStudent, isLoading } = useQuery({
    queryKey: ['getWorkoutsByStudentId', student?.id],
    queryFn: () => getWorkoutsByStudentId(student?.id || ''),
    enabled: !!student?.id
  });

  return (
    <FlatList
      style={{ flex: 1, }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      ListHeaderComponent={
        <>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.navigate('Workouts')} />
            <Appbar.Content title="Treinos" />
          </Appbar.Header>
          <StudentCard
            children={
              <Button
                icon="plus"
                mode='text'
                onPress={() => navigation.navigate('CreateWorkout', { workoutId: student?.id })}
              >Novo treino
              </Button>
            }
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
      data={workoutsStudent}
      keyExtractor={(item) => String(item)}
      renderItem={({ item }) => <>{isLoading ? <Skeleton style={{ width: '90%', height: 50, borderRadius: 20 }} /> : <Card style={{ marginHorizontal: 20, marginVertical: 10 }}
      >
        <Card.Title
          title="Treino"
          subtitle={`ID ${item}`}
          right={(props) => <IconButton {...props} icon="arrow-right" onPress={() => { navigation.navigate('CreateWorkout', { workoutId: item }) }} />}
        />
      </Card>
      }
      </>
      }
    />
  );
};

export default DetailsWorkout;
