import React, { useState } from 'react';
import { ActivityIndicator, FlatList, View, } from 'react-native';
import {
  Button,
  Text,
  Appbar,
  Searchbar,
  Card,
  IconButton,
  Avatar
} from 'react-native-paper';

import { useQuery } from '@tanstack/react-query';
import { getExercises } from '@/api/exercise/exercise.api';
import UserList from '@/components/UserList';
import { getRelationship } from '@/api/relationships/relationships.api';
import { useUser } from '../UserContext';


const Workouts = ({ navigation }: any) => {
  const { user } = useUser();

  const [params, setParams] = useState<{ name: string }>();

  const { data: students, isLoading } = useQuery({
    queryKey: ['getRelationship', params],
    queryFn: () => getRelationship(user.id!, params),
    enabled: true
  });


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
          style={{ marginTop: 20, }}
          onIconPress={() => setParams(undefined)}
        />
        <UserList params={{ permission: 'TEACHER' }} />
        <Button
          icon="plus"
          mode="contained"
          style={{ marginTop: 20, }}
          onPress={() => navigation.navigate('CreateExercise', { exerciseId: undefined })}>
          Cadastrar exercício
        </Button>
        {isLoading && <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" color="#6200ea" />}
        {students?.students?.length === 0 && <Text variant="titleSmall" style={{ marginTop: 16, textAlign: 'center' }}>Nenhum dado encontrado</Text>
        }
        <FlatList
          data={students?.students}
          renderItem={({ item }) => <Card style={{ marginTop: 20, }} >
            <Card.Title
              title={item.studentName}
              subtitle={item.studentId}
              left={(props) => <Avatar.Icon {...props} icon="dumbbell" />}
              right={(props) => <IconButton {...props} icon="arrow-right"
                onPress={() => navigation.navigate('CreateExercise', { exerciseId: item.studentId })
                } />
              }
            />
          </Card>}
          keyExtractor={item => `${item.studentName}-${item.studentId}`}
        />
      </View>
    </View >

  );
};

export default Workouts;
