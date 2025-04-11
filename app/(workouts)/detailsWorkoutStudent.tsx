import React, { useState } from 'react';
import { ActivityIndicator, FlatList, View, Image } from 'react-native';
import {
  Text, Appbar,
  Button,
  Card, Chip,
  Badge,
  IconButton
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
import InfoField from '@/components/InfoField';

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
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>({});

  const toggleShowDetails = (id: string) => {
    setShowDetails(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleCheckbox = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const { workoutId } = route.params as { workoutId: string | undefined };

  const { data: workoutByStudent, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getWorkoutByStudentIdAndWorkoutId', workoutId, student?.id],
    queryFn: () => getWorkoutByStudentIdAndWorkoutId(workoutId || '', student?.id || ''),
    enabled: !!workoutId
  });

  const setAllCheckedItems = () => {
    const allTrue = workoutByStudent?.exercises.reduce((acc, exercise) => {
      acc[exercise?.exerciseId?.id || ''] = true;
      return acc;
    }, {} as Record<string, boolean>);

    if (allTrue) {
      setCheckedItems(allTrue);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <>
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
        </StudentCard>
      </>
      <FlatList
        data={workoutByStudent?.exercises}
        keyExtractor={(item) => `${item.exerciseId.id}`}
        refreshing={isLoading || isFetching}
        onRefresh={refetch}
        renderItem={({ item }) => <>
          {
            isLoading ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" /> :
              <Card style={{ marginHorizontal: 16, borderRadius: 12, elevation: 5, marginTop: 16 }}>

                <Card.Content style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>

                  <View style={{ display: 'flex', flexDirection: 'row', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 5, }}>

                      <Text variant='titleLarge' style={{ fontWeight: 'bold' }}>
                        {item?.exerciseId.name || ''}
                      </Text>
                      {item.observations && item.observations.trim() !== '' && (
                        <Badge
                          style={{
                            backgroundColor: theme.colors.primary,
                            position: 'relative',
                            top: -12,
                          }}
                        >
                          Obs
                        </Badge>
                      )}

                    </View>
                    <IconButton
                      icon={checkedItems[item.exerciseId.id || ''] ? "checkbox-outline" : 'square-outline'}
                      iconColor={checkedItems[item.exerciseId.id || ''] ? theme.colors.primary : '#999'}
                      size={24}
                      onPress={() => toggleCheckbox(item.exerciseId.id || '')}
                    />
                  </View>
                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    {item.sets && <Chip disabled icon={() => (
                      <Ionicons
                        name={'repeat'}
                        size={18}
                        color={theme.colors.primary}
                      />

                    )}
                      style={{
                        backgroundColor: theme.colors.primaryContainer,
                        alignSelf: 'flex-start',
                      }}
                      textStyle={{
                        color: theme.colors.primary,
                      }}>{item.sets}
                    </Chip>
                    }
                    {item.repetitions && <Chip disabled icon={() => (
                      <Ionicons
                        name={'repeat'}
                        size={18}
                        color={theme.colors.primary}
                      />

                    )}
                      style={{
                        backgroundColor: theme.colors.primaryContainer,
                        alignSelf: 'flex-start',
                      }}
                      textStyle={{
                        color: theme.colors.primary,
                      }}>{item.repetitions}
                    </Chip>}

                  </View>


                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name={'bed-outline'}
                      size={18}
                      color={theme.colors.primary}
                      style={{ marginRight: 4 }}
                    />
                    <Text variant='bodySmall' >{`Descanso: ${item.restTime}`}</Text>
                  </View>

                  <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                      name={'grid-outline'}
                      size={18}
                      color={theme.colors.primary}
                      style={{ marginRight: 4 }}
                    />
                    <Text variant='bodySmall' >{item.exerciseId.category}</Text>
                  </View>

                  {showDetails[item.exerciseId.id || ''] && (
                    <>
                      <Card mode='outlined' style={{ marginTop: 16 }}>
                        <View style={{ padding: 16 }}>
                          <View style={{ display: 'flex', alignItems: 'center' }}>
                            {item?.exerciseId?.images?.[0] && <Image
                              source={{ uri: item?.exerciseId?.images?.[0] }}
                              style={{
                                width: 200,
                                height: 200,
                                borderRadius: 10,
                                marginBottom: 10,
                              }}
                            />}

                            <Text variant='bodySmall'>{item.exerciseId.description}</Text>
                          </View>

                          {Array.isArray(item.exerciseId.muscleGroup) && item.exerciseId.muscleGroup.length > 0 && (
                            <View style={{ marginTop: 16 }}>
                              <Text variant="bodyMedium" style={{ marginBottom: 8, fontWeight: 'bold' }}>
                                Músculos trabalhados neste exercício:
                              </Text>
                              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                {item.exerciseId.muscleGroup.map((muscle, index) => (
                                  <Chip
                                    key={index}
                                    disabled
                                    style={{
                                      backgroundColor: theme.colors.tertiaryContainer,
                                    }}
                                    textStyle={{
                                      color: theme.colors.tertiary,
                                    }}
                                  >
                                    {muscle}
                                  </Chip>
                                ))}
                              </View>
                            </View>
                          )}

                        </View>
                      </Card>
                      <InfoField
                        title="Observações"
                        description={item.observations ? item.observations : "Nenhuma observação"}
                        style={{ marginTop: 12 }}
                      /></>
                  )}

                  <Button
                    mode='text'
                    onPress={() => toggleShowDetails(item.exerciseId.id || '')}
                    style={{
                      alignSelf: 'flex-start',
                    }}
                    icon={showDetails[item.exerciseId.id || ''] ? 'chevron-up' : 'chevron-down'}
                  >
                    {showDetails[item.exerciseId.id || ''] ? "Ocultar detalhes" : "Mostrar detalhes"}
                  </Button>
                </Card.Content>

              </Card>
          }
        </>
        }
        ListFooterComponent={
          <View
            style={{
              display: 'flex',
              padding: 16
            }}>
            <Button
              mode='outlined'
              onPress={() => setAllCheckedItems()}
              style={{
                marginTop: 16,
                width: "100%"
              }}
            >
              Finalizar treino
            </Button>
          </View>}
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