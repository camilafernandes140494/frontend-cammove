import { getWorkoutsByStudentId } from '@/api/workout/workout.api';
import Skeleton from '@/components/Skeleton';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import {
  Appbar,
  Button,
  Card,
  Chip,
  IconButton,
  Text,
} from 'react-native-paper';

const WorkoutsStudent = ({ navigation }: any) => {
  const { user } = useUser();
  const { theme } = useTheme();

  const {
    data: workoutsStudent,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['getWorkoutsByStudentId', user?.id],
    queryFn: () => getWorkoutsByStudentId(user?.id || ''),
    enabled: !!user?.id,
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header mode="small">
        <Appbar.Content title="Meus treinos" />
      </Appbar.Header>
      <FlatList
        data={workoutsStudent}
        keyExtractor={(item) =>
          `${item.id}-${item.nameWorkout}-${item.createdAt}`
        }
        ListEmptyComponent={
          isLoading ? (
            <View>
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
            </View>
          ) : (
            <View style={{ alignItems: 'center', padding: 40 }}>
              <MaterialCommunityIcons
                color="#999"
                name="playlist-remove"
                size={48}
              />
              <Text style={{ fontSize: 16, marginVertical: 12, color: '#555' }}>
                Nenhum treino encontrado.
              </Text>
              <Button onPress={() => refetch()}>Tentar novamente</Button>
            </View>
          )
        }
        onRefresh={refetch}
        refreshing={isLoading || isFetching}
        renderItem={({ item }) => (
          <>
            {isLoading ? (
              <ActivityIndicator
                animating={true}
                size="large"
                style={{ marginTop: 16 }}
              />
            ) : (
              <Card
                style={{
                  marginHorizontal: 16,
                  borderRadius: 12,
                  elevation: 5,
                  marginTop: 16,
                }}
              >
                <Card.Title
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon="chevron-right"
                      onPress={() => {
                        navigation.navigate('DetailsWorkoutStudent', {
                          workoutId: item.id,
                        });
                      }}
                    />
                  )}
                  subtitle={item.type}
                  subtitleStyle={{ fontSize: 12, color: 'gray' }}
                  title={item.nameWorkout || 'Treino'}
                  titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                />
                <Card.Content
                  style={{
                    display: 'flex',
                    gap: 16,
                    justifyContent: 'space-between',
                  }}
                >
                  <Chip
                    disabled
                    icon={() => (
                      <Ionicons
                        color={theme.colors.primary}
                        name={'calendar'}
                        size={18}
                        style={{ marginRight: 4 }}
                      />
                    )}
                    style={{
                      backgroundColor: theme.colors.primaryContainer,
                      alignSelf: 'flex-start',
                    }}
                    textStyle={{
                      color: theme.colors.primary,
                    }}
                  >
                    {format(
                      new Date(item.createdAt),
                      "dd 'de' MMMM 'de' yyyy",
                      { locale: ptBR }
                    )}
                  </Chip>
                </Card.Content>
              </Card>
            )}
          </>
        )}
      />
    </View>
  );
};

export default WorkoutsStudent;
