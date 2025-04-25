import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import {
  Button,
  Text,
  Appbar,
  Card,
  IconButton,
  Chip,
  SegmentedButtons,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getWorkoutsSummary } from '@/api/workout/workout.api';
import { checkDateStatus, DateStatus, getNextMonth } from '@/common/common';
import CustomChip from '@/components/CustomChip';
import FilterInput from '@/components/FilterInput';
import { getWorkoutsSummaryResponse } from '@/api/workout/workout.types';
import SelectStudent from '@/components/SelectStudent';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import { format } from 'date-fns';

const Workouts = ({ navigation }: any) => {
  const [params, setParams] = useState<{ name: string }>();
  const [workoutsSummaryFilter, setWorkoutsSummaryFilter] = useState<getWorkoutsSummaryResponse[]>();
  const [dateStatus, setDateStatus] = useState<DateStatus>('INVALID_DATE');
  const [value, setValue] = useState('workouts');
  const { user } = useUser();
  const { theme } = useTheme();

  const { data: workoutsSummary, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getRelationship', params],
    queryFn: () => getWorkoutsSummary(user?.id!, params),
    enabled: !!user?.id,
  });


  useEffect(() => {
    if (!workoutsSummary) return;
    let filteredData = workoutsSummary;

    if (params?.name) {
      filteredData = filteredData.filter((workout) =>
        workout.studentName.toLowerCase().includes(params.name.toLowerCase())
      );
    }

    switch (dateStatus) {
      case 'PAST':
        filteredData = filteredData.filter((workout) => checkDateStatus(workout.expireAt) === 'PAST');
        break;
      case 'UPCOMING':
        filteredData = filteredData.filter((workout) => checkDateStatus(workout.expireAt) === 'UPCOMING');
        break;
      case 'FUTURE':
        filteredData = filteredData.filter((workout) => checkDateStatus(workout.expireAt) === 'FUTURE');
        break;
    }

    setWorkoutsSummaryFilter(filteredData);
  }, [workoutsSummary, params, dateStatus]);


  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header mode='small'>
        <Appbar.Content title="Treinos" />
        <Button icon="plus" mode="contained" onPress={() => navigation.navigate('CreateWorkout', { workoutId: undefined })}>
          Novo treino
        </Button>
      </Appbar.Header>

      <FlatList
        data={value === 'students' ? [] : workoutsSummaryFilter}
        keyExtractor={(item) => `${item.studentName}-${item.id}`}
        keyboardShouldPersistTaps="handled"
        refreshing={isLoading || isFetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                { value: 'workouts', label: 'Treinos', icon: 'dumbbell' },
                { value: 'students', label: 'Alunos', icon: 'account-group' },
              ]}
            />

            {value === 'workouts' && <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 10 }}>
              <CustomChip color="primary" label="Expirado" icon="alert-circle-outline" onSelect={(selected) => setDateStatus(selected ? 'PAST' : 'INVALID_DATE')} />
              <CustomChip color="error" label="Prestes a Expirar" icon="clock-alert-outline" onSelect={(selected) => setDateStatus(selected ? 'UPCOMING' : 'INVALID_DATE')} />
              <CustomChip color="tertiary" label="Em dia" icon="check-circle-outline" onSelect={(selected) => setDateStatus(selected ? 'FUTURE' : 'INVALID_DATE')} />
            </View>}

            <FilterInput placeholder="Pesquisar aluno(a)" onChange={(value) => setParams({ name: value })} />

            {workoutsSummaryFilter?.length === 0 && value === 'workouts' && (
              <Text variant="titleSmall" style={{ marginTop: 16, textAlign: 'center' }}>
                Nenhum dado encontrado
              </Text>
            )}

            {value === 'students' && (
              <SelectStudent
                teacherId={user?.id!}
                onSelect={(student) => { navigation.navigate('DetailsWorkout', { studentId: student.studentId }) }}
                filterName={params?.name}
              />
            )}
          </View>
        }
        renderItem={({ item }) => <>
          {
            isLoading && value === 'workouts' ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" /> : value === 'workouts' && <Card style={{ marginHorizontal: 16, borderRadius: 12, elevation: 5, marginBottom: 16 }}>
              <Card.Title
                title={item?.studentName || ''}
                subtitle={`Criado em: ${format(item?.createdAt, "dd/MM/yyyy")}`}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="chevron-right"
                    size={24}
                    onPress={() => {
                      navigation.navigate('CreateWorkout', { workoutId: item?.workoutId || '', studentId: item?.studentId || '' });
                    }}
                  />
                )}
                titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                subtitleStyle={{ fontSize: 12, color: 'gray' }}
              />
              <Card.Content style={{ paddingVertical: 16 }}>
                <Text variant="bodyMedium" style={{ fontSize: 14, marginBottom: 8 }}>
                  Próxima atualização
                </Text>
                <Text variant="bodySmall" style={{ fontSize: 16, color: theme.colors.primary, fontWeight: '500', marginBottom: 20 }}>
                  {getNextMonth(item?.createdAt || '')}
                </Text>
                <Chip>{item?.workoutType || ''}</Chip>
              </Card.Content>
            </Card>
          }
        </>
        }

      />
    </View>
  );
};

export default Workouts;
