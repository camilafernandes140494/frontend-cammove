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
    Card
} from 'react-native-paper';
import { postCreateUser } from '@/api/auth/auth.api';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { getExercises } from '@/api/exercise/exercise.api';

const Exercises = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [params, setParams] = useState();

    const { data: exercises } = useQuery({
        queryKey: ['getExercises'],
        queryFn: () => getExercises(params),
        enabled: true
    });
    const [expanded, setExpanded] = useState(false);

    const toggleAccordion = () => setExpanded(!expanded);

    const handleTeacherSelect = () => {
        setExpanded(false);
    };
    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => { }} />
                <Appbar.Content title="Exercícios" />
                <Appbar.Action icon="magnify" onPress={() => { }} />
            </Appbar.Header>
            <Button icon="plus" mode="contained" onPress={() => navigation.navigate('CreateExercise' as never)}>
                Cadastrar exercício
            </Button>
            <Searchbar
                placeholder="Pesquisar exercício"
                onChangeText={setSearchQuery}
                value={searchQuery}
            />
            <FlatList
                data={exercises}
                renderItem={({ item }) => <Card style={{ marginTop: 20, }} >
                    <Card.Title title={item.name} subtitle={item.description} />
                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                    <Card.Actions>
                        <Button>Cancel</Button>
                        <Button>Ok</Button>
                    </Card.Actions>
                </Card>}
                keyExtractor={item => item.name}
            />
        </View >

    );
};

export default Exercises;
