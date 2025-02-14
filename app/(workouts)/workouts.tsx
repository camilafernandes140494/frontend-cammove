import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, View } from 'react-native';
import {
  Button,
  Text,
  Appbar,
  Card,
  IconButton,
  Chip,
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getWorkoutsSummary } from '@/api/workout/workout.api';
import { checkDateStatus, DateStatus, formatDate, getNextMonth } from '@/common/common';
import CustomChip from '@/components/CustomChip';
import FilterInput from '@/components/FilterInput'; // Importar o filtro com debounce
import { getWorkoutsSummaryResponse } from '@/api/workout/workout.types';

const Workouts = ({ navigation }: any) => {
  const [params, setParams] = useState<{ name: string }>();
  const [workoutsSummaryFilter, setWorkoutsSummaryFilter] = useState<getWorkoutsSummaryResponse[]>();
  const [dateStatus, setDateStatus] = useState<DateStatus>('INVALID_DATE');

  const { data: workoutsSummary, isLoading } = useQuery({
    queryKey: ['getRelationship', params],
    queryFn: () => getWorkoutsSummary('TgTfDirVTOQR5ZOxgFgr', params),
    enabled: true,
  });

  useEffect(() => {
    if (!workoutsSummary) return;

    let filteredData = workoutsSummary;

    // Filtragem por nome
    if (params?.name) {
      filteredData = filteredData.filter((workout) =>
        workout.studentName.toLowerCase().includes(params.name.toLowerCase())
      );
    }

    // Filtragem por status
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
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Treinos" />
      </Appbar.Header>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ padding: 16 }}>
          {/* Chips de Filtros */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 10 }}>
            <CustomChip color="primary" label="Expirado" icon="alert-circle-outline" onSelect={(selected) => setDateStatus(selected ? 'PAST' : 'INVALID_DATE')} />
            <CustomChip color="error" label="Prestes a Expirar" icon="clock-alert-outline" onSelect={(selected) => setDateStatus(selected ? 'UPCOMING' : 'INVALID_DATE')} />
            <CustomChip color="tertiary" label="Em dia" icon="check-circle-outline" onSelect={(selected) => setDateStatus(selected ? 'FUTURE' : 'INVALID_DATE')} />
          </View>

          <FilterInput placeholder="Pesquisar aluno(a)" onChange={(value) => setParams({ name: value })} />

          <Button icon="plus" mode="contained" style={{ marginTop: 20 }} onPress={() => navigation.navigate('CreateWorkout', { workoutId: undefined })}>
            Cadastrar treino
          </Button>

          {workoutsSummaryFilter?.length === 0 && (
            <Text variant="titleSmall" style={{ marginTop: 16, textAlign: 'center' }}>
              Nenhum dado encontrado
            </Text>
          )}

          {isLoading ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" color="#6200ea" /> :
            <FlatList
              data={workoutsSummaryFilter}
              renderItem={({ item }) => (
                <Card style={{ marginTop: 20, marginHorizontal: 10, borderRadius: 12, elevation: 5 }}>
                  <Card.Title
                    title={item.studentName}
                    subtitle={`Criado em: ${formatDate(item.createdAt)}`}
                    right={(props) => <IconButton {...props} icon="chevron-right" size={24} onPress={() => navigation.navigate('CreateExercise', { exerciseId: item.workoutId })} />}
                    titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                    subtitleStyle={{ fontSize: 12, color: 'gray' }}
                  />
                  <Card.Content style={{ paddingVertical: 16 }}>
                    <Text variant="bodyMedium" style={{ fontSize: 14, marginBottom: 8 }}>
                      Próxima atualização
                    </Text>
                    <Text variant="bodySmall" style={{ fontSize: 16, color: 'blue', fontWeight: '500', marginBottom: 20 }}>
                      {getNextMonth(item.createdAt)}
                    </Text>
                    <Chip>{item.workoutType}</Chip>
                  </Card.Content>
                </Card>
              )}
              keyExtractor={(item) => `${item.studentName}-${item.id}`}
              scrollEnabled={false} // Desativa o scroll da FlatList pois o ScrollView já cuida disso
            />
          }
        </View>
      </ScrollView>
    </View>
  );
};

export default Workouts;
