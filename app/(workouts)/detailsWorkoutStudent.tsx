import React, { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import {
  Text, Appbar,
  Button,
  Card, Chip
} from 'react-native-paper';
import { useStudent } from '../context/StudentContext';
import { getWorkoutByStudentIdAndWorkoutId } from '@/api/workout/workout.api';
import { useQuery } from '@tanstack/react-query';
import StudentCard from '@/components/StudentCard';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Skeleton from '@/components/Skeleton';

export type RootStackParamList = {
  WorkoutsStudent: undefined;
  CreateWorkout: { workoutId?: string };
};

const DetailsWorkoutStudent = () => {
  const [visible, setVisible] = useState(false);
  const { student } = useStudent();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const route = useRoute();

  const { workoutId } = route.params as { workoutId: string | undefined };


  const { data: workoutByStudent, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getWorkoutByStudentIdAndWorkoutId', workoutId, student?.id],
    queryFn: () => getWorkoutByStudentIdAndWorkoutId(workoutId || '', student?.id || ''),
    enabled: !!workoutId
  });

  console.log(workoutByStudent?.exercises, workoutId)
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={workoutByStudent?.exercises}
        keyExtractor={(item) => `${item}`}
        refreshing={isLoading || isFetching}
        onRefresh={refetch}
        ListHeaderComponent={<>
          <Appbar.Header>
            <Appbar.BackAction onPress={() => navigation.navigate('WorkoutsStudent')} />
            <Appbar.Content title={workoutByStudent?.nameWorkout} />

          </Appbar.Header>
          <StudentCard>

            {workoutId && <Text variant="bodySmall" style={{ marginLeft: 16, color: theme.colors.outline }}>ID: {workoutId}</Text>}
            <View style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center', marginLeft: 16, marginTop: 16 }}>
              <Ionicons
                name={'calendar'}
                size={18}
                color={theme.colors.primary}
              />
              {workoutByStudent?.createdAt ? (
                <Text>
                  {format(new Date(workoutByStudent.createdAt), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </Text>
              ) : null}
            </View>

          </StudentCard> </>}
        renderItem={({ item }) => <>
          {
            isLoading ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" /> : <Card style={{ marginHorizontal: 16, borderRadius: 12, elevation: 5, marginTop: 16 }}>
              <Card.Title
                title={item?.exerciseId.name || ''}
                subtitle={`${item?.repetitions || ''} `}
                titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                subtitleStyle={{ fontSize: 12, color: 'gray' }}
              // right={(props) => <IconButton {...props} icon="chevron-right" onPress={() => { navigation.navigate('WorkoutsStudent', { workoutId: item.id }) }} />}
              />
              <Card.Content style={{ display: 'flex', gap: 16, justifyContent: 'space-between' }}>

                <Chip disabled icon={() => (
                  <Ionicons
                    name={'grid-outline'}
                    size={18}
                    color={theme.colors.primary}
                    style={{ marginRight: 4 }}
                  />

                )}
                  style={{
                    backgroundColor: theme.colors.primaryContainer,
                    alignSelf: 'flex-start',
                  }}
                  textStyle={{
                    color: theme.colors.primary,
                  }}>{item.exerciseId.category}</Chip>

              </Card.Content>

            </Card>
          }
        </>
        }
        ListEmptyComponent={
          isLoading ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  style={{
                    width: '90%',
                    height: 60,
                    borderRadius: 4,
                    marginVertical: 8,
                    alignSelf: 'center',
                  }}
                />
              ))}
            </>
          ) : <View style={{ alignItems: 'center', padding: 40 }}>
            <MaterialCommunityIcons name="playlist-remove" size={48} color="#999" />
            <Text style={{ fontSize: 16, marginVertical: 12, color: '#555' }}>
              Nenhum treino encontrado.
            </Text>
            <Button onPress={() => refetch()} >Tentar novamente</Button>
          </View>
        }
      />
    </View >
  );
};

export default DetailsWorkoutStudent;
