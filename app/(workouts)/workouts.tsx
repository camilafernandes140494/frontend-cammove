import React, { useState } from 'react';
import { ActivityIndicator, FlatList, View, } from 'react-native';
import {
  Button,
  Text,
  Appbar,
  Searchbar,
  Card,
  IconButton,
  Avatar,
  Chip
} from 'react-native-paper';

import { useQuery } from '@tanstack/react-query';
import { useUser } from '../UserContext';
import { getWorkoutsSummary } from '@/api/workout/workout.api';
import { format } from 'date-fns';


const Workouts = ({ navigation }: any) => {
  const { user } = useUser();
  const today = format(new Date(), 'dd/MM/yyyy'); 

  const [params, setParams] = useState<{ name: string }>();

  const { data: workoutsSummary, isLoading, refetch } = useQuery({
    queryKey: ['getRelationship', params],
    queryFn: () => getWorkoutsSummary("TgTfDirVTOQR5ZOxgFgr", params),
    enabled: true
  });


  console.log(workoutsSummary, user.id)
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  function getNextMonth(dateString: string): string {
    const date = new Date(dateString);
      date.setMonth(date.getMonth() + 1);
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  return (
    <View style={{ flex: 1, }}>
      <Appbar.Header>
        <Appbar.Content title="Treinos" />
      </Appbar.Header>
      <View style={{ padding: 16 }}>

        <Searchbar
          placeholder="Pesquisar aluno(a)"
          onChangeText={(a) => setParams({ name: a })}
          value={params?.name || ''}
          onIconPress={() => setParams(undefined)}
        />
        <Button
          icon="plus"
          mode="contained"
          style={{ marginTop: 20, }}
          onPress={() => refetch()}>
          Atualizar
        </Button>
        <Button
          icon="plus"
          mode="contained"
          style={{ marginTop: 20, }}
          onPress={() => navigation.navigate('CreateExercise', { exerciseId: undefined })}>
          Cadastrar exercício
        </Button>
        {isLoading && <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" color="#6200ea" />}
        {workoutsSummary?.length === 0 && <Text variant="titleSmall" style={{ marginTop: 16, textAlign: 'center' }}>Nenhum dado encontrado</Text>
        }

<FlatList
  data={workoutsSummary}
  renderItem={({ item }) => (
    <Card
      style={{
        marginTop: 20,
        marginHorizontal: 10,
        borderRadius: 12,
        elevation: 5, // Adds shadow
      }}
    >
      <Card.Title
        title={item.studentName}
        subtitle={`Criado em: ${formatDate(item.createdAt)}`}
        right={(props) => (
          <IconButton
            {...props}
            icon="chevron-right"
            size={24}
            onPress={() =>
              navigation.navigate('CreateExercise', { exerciseId: item.workoutId })
            }
          />
        )}
        titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
        subtitleStyle={{ fontSize: 12, color: 'gray' }}
      />
      <Card.Content style={{ paddingVertical: 16 }}>
        <Text variant="bodyMedium" style={{ fontSize: 14, marginBottom: 8 }}>
          Próxima atualização prevista
        </Text>
        <Text
          variant="bodySmall"
          style={{
            fontSize: 16,
            color:'blue',
            fontWeight: '500',
            marginBottom: 20,
          }}
        >
          {getNextMonth(item.createdAt)}
        </Text>
        <Chip>
          {item.workoutType} 
        </Chip>
      </Card.Content>
    </Card>
  )}
  keyExtractor={(item) => `${item.studentName}-${item.id}`}
/>
      </View>
    </View >

  );
};

export default Workouts;
