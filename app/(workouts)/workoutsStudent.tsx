import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Chip, IconButton, Text
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import { getWorkoutsByStudentId } from '@/api/workout/workout.api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Skeleton from '@/components/Skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const WorkoutsStudent = ({ navigation }: any) => {
  const { user } = useUser();
  const { theme } = useTheme();

  const { data: workoutsStudent, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getWorkoutsByStudentId', user?.id],
    queryFn: () => getWorkoutsByStudentId(user?.id || ''),
    enabled: !!user?.id
  });


  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header >
        <Appbar.BackAction onPress={() => navigation.navigate('AssessmentsStudent')} />
        <Appbar.Content title="Meus treinos" />
      </Appbar.Header>
      <FlatList
        data={workoutsStudent}
        keyExtractor={(item) => `${item}`}
        refreshing={isLoading || isFetching}
        onRefresh={refetch}
        renderItem={({ item }) => <>
          {
            isLoading ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" /> : <Card style={{ marginHorizontal: 16, borderRadius: 12, elevation: 5, marginTop: 16 }}>
              <Card.Title
                title={item.nameWorkout || 'Treino'}
                subtitle={item.type}
                titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                subtitleStyle={{ fontSize: 12, color: 'gray' }}
                right={(props) => <IconButton {...props} icon="chevron-right" onPress={() => { navigation.navigate('DetailsWorkoutStudent', { workoutId: item.id }) }} />}
              />
              <Card.Content style={{ display: 'flex', gap: 16, justifyContent: 'space-between' }}>

                <Chip disabled icon={() => (
                  <Ionicons
                    name={'calendar'}
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
                  }}>{format(new Date(item.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</Chip>

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

    </View>
  );
};

export default WorkoutsStudent;
