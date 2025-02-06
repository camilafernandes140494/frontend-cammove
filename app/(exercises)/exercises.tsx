import React, { useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, View, } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    TextInput,
    Button,
    HelperText,
    Text,
    Snackbar,
    Appbar,
    Searchbar,
    List,
    Card,
    IconButton,
    Avatar
} from 'react-native-paper';

import { useTheme } from '../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getExercises } from '@/api/exercise/exercise.api';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../_layout';

const Exercises = () => {
    const { theme } = useTheme();

    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'CreateExercise'>>();
    const [params, setParams] = useState<{ name: string }>();

    const { data: exercises } = useQuery({
        queryKey: ['getExercises', params],
        queryFn: () => getExercises(params),
        enabled: true
    });


    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Content title="Exercícios" />
            </Appbar.Header>

            <Searchbar
                placeholder="Pesquisar exercício"
                onChangeText={(a) => setParams({ name: a })}
                value={params?.name || ''}
                style={{ marginTop: 20, }}
                onIconPress={() => setParams(undefined)}
            />
            <Button
                icon="plus"
                mode="contained"
                style={{ marginTop: 20, }}
                onPress={() => navigation.navigate('CreateExercise', { exerciseId: undefined })}>
                Cadastrar exercício
            </Button>
            <FlatList
                data={exercises}
                renderItem={({ item }) => <Card style={{ marginTop: 20, }} >
                    <Card.Title
                        title={item.name}
                        subtitle={item.muscleGroup?.join(", ")}
                        left={(props) => <Avatar.Icon {...props} icon="dumbbell" />}
                        right={(props) => <IconButton {...props} icon="arrow-right"
                            onPress={() => navigation.navigate('CreateExercise', { exerciseId: item.id })
                            } />
                        }
                    />
                </Card>}
                keyExtractor={item => item.name}
            />
        </View >

    );
};

export default Exercises;
