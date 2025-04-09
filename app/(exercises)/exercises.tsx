import React, { useState } from 'react';
import { ActivityIndicator, FlatList, View, } from 'react-native';
import {
    Button,
    Text,
    Appbar,
    Searchbar,
    Card, Avatar
} from 'react-native-paper';

import { useQuery } from '@tanstack/react-query';
import { deleteExercise, getExercises } from '@/api/exercise/exercise.api';
import CustomModal from '@/components/CustomModal';
import { useTheme } from '../ThemeContext';

const Exercises = ({ navigation }: any) => {
    const { theme } = useTheme();

    const [params, setParams] = useState<{ name: string }>();

    const { data: exercises, isLoading, refetch } = useQuery({
        queryKey: ['getExercises', params],
        queryFn: () => getExercises(params),
        enabled: true
    });

    const handleDelete = async (workoutId: string) => {
        try {
            await deleteExercise(workoutId);
            refetch()
        } catch (error) {
            console.error('Erro ao criar exercício:', error);
        }
    };


    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header mode='small'>
                <Appbar.Content title="Exercícios" />
                <Button
                    icon="plus"
                    mode="contained"
                    onPress={() => navigation.navigate('CreateExercise', { exerciseId: undefined })}>
                    Novo exercício
                </Button>
            </Appbar.Header>


            <FlatList
                data={exercises}
                ListHeaderComponent={<View style={{ padding: 16 }}>
                    <Searchbar
                        placeholder="Pesquisar exercício"
                        onChangeText={(a) => setParams({ name: a })}
                        value={params?.name || ''}
                        onIconPress={() => setParams(undefined)}
                    />

                    {isLoading && <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" />}
                    {exercises?.length === 0 && <Text variant="titleSmall" style={{ marginTop: 16, textAlign: 'center' }}>Nenhum dado encontrado</Text>
                    }
                </View>
                }
                renderItem={({ item }) => <Card mode='elevated' style={{ marginTop: 20, marginHorizontal: 16 }} >
                    <Card.Title
                        title={item.name}
                        subtitle={item.muscleGroup?.join(", ")}
                        left={(props) => <Avatar.Icon {...props} icon="dumbbell" />}

                    />
                    <Card.Actions>
                        <CustomModal
                            onPress={() => handleDelete(item?.id || '')}
                            title='Tem certeza que deseja deletar o exercício?'
                            primaryButtonLabel='Deletar' />
                        <Button
                            mode='contained-tonal'
                            onPress={() => navigation.navigate('CreateExercise', { exerciseId: item.id })}
                        > Detalhes</Button>

                    </Card.Actions>
                </Card>}
                keyExtractor={item => `${item.name}-${item.id}`}
            />
        </View>

    );
};

export default Exercises;
