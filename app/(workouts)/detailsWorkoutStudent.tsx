import { getReviewById } from '@/api/reviews/reviews.api';
import { getWorkoutByStudentIdAndWorkoutId } from '@/api/workout/workout.api';
import { logTrainingDay } from '@/api/workoutsDay/workoutsDay.api';
import CongratsConfetti from '@/components/CongratsConfetti ';
import InfoField from '@/components/InfoField';
import Skeleton from '@/components/Skeleton';
import StudentCard from '@/components/StudentCard';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  type NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, View } from 'react-native';
import {
  Appbar,
  Badge,
  Button,
  Card,
  Chip,
  IconButton,
  Text,
} from 'react-native-paper';
import { useMyTeacher } from '../../context/MyTeacherContext';
import { useStudent } from '../../context/StudentContext';

export type RootStackParamList = {
  WorkoutsStudent: undefined;
  ReviewsStudent: { workoutId?: string };
  CreateWorkout: { workoutId?: string };
};

const DetailsWorkoutStudent = () => {
  const { student } = useStudent();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const route = useRoute();
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showDetails, setShowDetails] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showCongrats, setShowCongrats] = useState(false);
  const { user } = useUser();
  const { teacher } = useMyTeacher();

  const toggleShowDetails = (id: string) => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleCheckbox = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const { workoutId } = route.params as { workoutId: string | undefined };

  const { data: review } = useQuery({
    queryKey: ['getReviewById', user?.id, teacher?.teacherId, workoutId],
    queryFn: () =>
      getReviewById(teacher?.teacherId || '', workoutId || '', user?.id || ''),
    enabled: !!user?.id,
  });

  const {
    data: workoutByStudent,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['getWorkoutByStudentIdAndWorkoutId', workoutId, student?.id],
    queryFn: () =>
      getWorkoutByStudentIdAndWorkoutId(workoutId || '', student?.id || ''),
    enabled: !!workoutId,
  });

  const setAllCheckedItems = () => {
    const allTrue = workoutByStudent?.exercises.reduce(
      (acc, exercise) => {
        acc[exercise?.exerciseId?.id || ''] = true;
        return acc;
      },
      {} as Record<string, boolean>
    );
    setShowCongrats(true);

    if (allTrue) {
      setCheckedItems(allTrue);
    }
  };

  const mutation = useMutation({
    mutationFn: async () => {
      await logTrainingDay(user?.id || '');
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <>
        <Appbar.Header>
          <Appbar.BackAction
            onPress={() => navigation.navigate('WorkoutsStudent')}
          />
          <Appbar.Content title={workoutByStudent?.nameWorkout} />
        </Appbar.Header>
        <StudentCard>
          {workoutId && (
            <Text
              style={{ marginLeft: 16, color: theme.colors.outline }}
              variant="bodySmall"
            >
              ID: {workoutId}
            </Text>
          )}
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 12,
                alignItems: 'center',
                marginLeft: 16,
                marginTop: 16,
              }}
            >
              <Ionicons
                color={theme.colors.primary}
                name={'calendar'}
                size={18}
              />
              {workoutByStudent?.createdAt ? (
                <Text>
                  {format(
                    new Date(workoutByStudent.createdAt),
                    "dd 'de' MMMM 'de' yyyy",
                    {
                      locale: ptBR,
                    }
                  )}
                </Text>
              ) : null}
            </View>
            {review?.review && (
              <Button
                icon={'star'}
                mode="elevated"
                onPress={() =>
                  navigation.navigate('ReviewsStudent', { workoutId })
                }
                style={{
                  alignSelf: 'flex-start',
                  marginRight: 16,
                }}
              >
                Ver avaliação
              </Button>
            )}
          </View>
        </StudentCard>
      </>
      <FlatList
        data={workoutByStudent?.exercises}
        keyExtractor={(item) =>
          `${item.exerciseId.id}-${item.exerciseId.name}-${item.exerciseId.createdAt}`
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
        ListFooterComponent={
          <View
            style={{
              display: 'flex',
              padding: 16,
            }}
          >
            <CongratsConfetti
              onDismiss={() => {
                setShowCongrats(false), navigation.navigate('WorkoutsStudent');
              }}
              onEvaluate={() => {
                setShowCongrats(false),
                  navigation.navigate('ReviewsStudent', { workoutId });
              }}
              visible={showCongrats}
            />
            {!isLoading && (
              <Button
                disabled={mutation.isPending}
                mode="outlined"
                onPress={() => {
                  mutation.mutate(), setAllCheckedItems();
                }}
                style={{
                  marginTop: 16,
                  width: '100%',
                }}
              >
                Finalizar treino
              </Button>
            )}
          </View>
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
                <Card.Content
                  style={{
                    display: 'flex',
                    gap: 12,
                    justifyContent: 'space-between',
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <View style={{ flex: 1, marginRight: 8 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{ fontWeight: 'bold', flexShrink: 1 }}
                          variant="titleLarge"
                        >
                          {item?.exerciseId.name || ''}
                        </Text>
                        {item.observations?.trim() !== '' && (
                          <Badge
                            style={{
                              backgroundColor: theme.colors.primary,
                              marginLeft: 8,
                              top: -4,
                            }}
                          >
                            Obs
                          </Badge>
                        )}
                      </View>
                    </View>

                    <IconButton
                      icon={
                        checkedItems[item.exerciseId.id || '']
                          ? 'checkbox-outline'
                          : 'square-outline'
                      }
                      iconColor={
                        checkedItems[item.exerciseId.id || '']
                          ? theme.colors.primary
                          : '#999'
                      }
                      onPress={() => toggleCheckbox(item.exerciseId.id || '')}
                      size={24}
                    />
                  </View>

                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    {item.sets && (
                      <Chip
                        disabled
                        icon={() => (
                          <Ionicons
                            color={theme.colors.primary}
                            name={'repeat'}
                            size={18}
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
                        {item.sets}
                      </Chip>
                    )}
                    {item.repetitions && (
                      <Chip
                        disabled
                        icon={() => (
                          <Ionicons
                            color={theme.colors.primary}
                            name={'repeat'}
                            size={18}
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
                        {item.repetitions}
                      </Chip>
                    )}
                  </View>

                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons
                      color={theme.colors.primary}
                      name={'bed-outline'}
                      size={18}
                      style={{ marginRight: 4 }}
                    />
                    <Text variant="bodySmall">{`Descanso: ${item.restTime}`}</Text>
                  </View>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons
                      color={theme.colors.primary}
                      name={'grid-outline'}
                      size={18}
                      style={{ marginRight: 4 }}
                    />
                    <Text variant="bodySmall">{item.exerciseId.category}</Text>
                  </View>

                  {showDetails[item.exerciseId.id || ''] && (
                    <>
                      {item?.exerciseId?.id && (
                        <Card mode="outlined" style={{ marginTop: 16 }}>
                          <View style={{ padding: 16 }}>
                            <View
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              {item?.exerciseId?.images?.[0] && (
                                <Image
                                  source={{
                                    uri: item?.exerciseId?.images?.[0],
                                  }}
                                  style={{
                                    width: 200,
                                    height: 200,
                                    borderRadius: 10,
                                    marginBottom: 10,
                                  }}
                                />
                              )}

                              <Text variant="bodySmall">
                                {item.exerciseId.description}
                              </Text>
                            </View>

                            {Array.isArray(item.exerciseId.muscleGroup) &&
                              item.exerciseId.muscleGroup.length > 0 && (
                                <View style={{ marginTop: 16 }}>
                                  <Text
                                    style={{
                                      marginBottom: 8,
                                      fontWeight: 'bold',
                                    }}
                                    variant="bodyMedium"
                                  >
                                    Músculos trabalhados neste exercício:
                                  </Text>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      flexWrap: 'wrap',
                                      gap: 8,
                                    }}
                                  >
                                    {item.exerciseId.muscleGroup.map(
                                      (muscle, index) => (
                                        <Chip
                                          disabled
                                          key={index}
                                          style={{
                                            backgroundColor:
                                              theme.colors.tertiaryContainer,
                                          }}
                                          textStyle={{
                                            color: theme.colors.tertiary,
                                          }}
                                        >
                                          {muscle}
                                        </Chip>
                                      )
                                    )}
                                  </View>
                                </View>
                              )}
                          </View>
                        </Card>
                      )}

                      <InfoField
                        description={
                          item.observations
                            ? item.observations
                            : 'Nenhuma observação'
                        }
                        style={{ marginTop: 12 }}
                        title="Observações"
                        // propsTitle={{
                        //   style: { color: theme.colors.onPrimary }
                        // }}
                        // propsDescription={{
                        //   style: { color: theme.colors.onPrimary }
                        // }}
                      />
                    </>
                  )}

                  <Button
                    icon={
                      showDetails[item.exerciseId.id || '']
                        ? 'chevron-up'
                        : 'chevron-down'
                    }
                    mode="text"
                    onPress={() => toggleShowDetails(item.exerciseId.id || '')}
                    style={{
                      alignSelf: 'flex-start',
                    }}
                  >
                    {showDetails[item.exerciseId.id || '']
                      ? 'Ocultar detalhes'
                      : 'Mostrar detalhes'}
                  </Button>
                </Card.Content>
              </Card>
            )}
          </>
        )}
      />
    </View>
  );
};

export default DetailsWorkoutStudent;
