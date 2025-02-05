import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    TextInput,
    Button,
    HelperText,
    Text,
    Snackbar,
    Chip,
} from 'react-native-paper';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { postExercise } from '@/api/exercise/exercise.api';
import { Exercise } from '@/api/exercise/exercise.types';

const CreateExercise = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const { setUser } = useUser();
    const [visible, setVisible] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório'),
        description: Yup.string().required('A descrição é obrigatória'),
        category: Yup.string().required('A categoria é obrigatória'),
    });

    const handleLogin = async (values: Exercise) => {
        console.log(values)
        setIsLoadingButton(true);
        try {
            await postExercise(values);
        } catch (error) {
            console.error('Erro ao criar exercício:', error);
        } finally {
            setIsLoadingButton(false);
        }
    };

    const muscleGroup = [
        "Peito",
        "Costas",
        "Ombros",
        "Bíceps",
        "Tríceps",
        "Antebraços",
        "Abdômen",
        "Glúteos",
        "Quadríceps",
        "Isquiotibiais",
        "Panturrilhas",
        "Adutores",
        "Flexores de quadril"
    ];

    const workoutCategories = [
        "Cardio",
        "Musculação",
        "Funcional",
        "Crossfit",
        "Yoga",
        "Pilates",
        "Calistenia",
        "HIIT (Treino Intervalado de Alta Intensidade)",
        "Treinamento de Força",
        "Treino de Resistência",
        "Treino de Mobilidade",
        "Treinamento de Flexibilidade",
        "Treino de Core",
        "Treinamento de Potência",
        "Treino de Agilidade",
        "Treino de Equilíbrio",
        "Treino de Alongamento",
        "Treino de Reabilitação",
        "Treino para Emagrecimento",
        "Treino para Hipertrofia",
        "Treino para Definição",
        "Treino Funcional Esportivo",
        "Treino ao Ar Livre",
        "Treino com Peso Corporal",
        "Treino de Endurance",
        "Treino de Baixo Impacto",
        "Treino para Idosos",
        "Treino para Iniciantes",
        "Treino Avançado",
        "Treino para Atletas"
    ];

    return (
        <ScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        >
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                action={{
                    label: '',
                    icon: 'close',
                    onPress: () => setVisible(false),
                }}
            >
                <Text>Erro ao cadastrar</Text>
            </Snackbar>

            <Formik
                initialValues={{
                    name: '',
                    description: '',
                    muscleGroup: [] as string[],
                    category: '',
                    images: []
                }}
                validationSchema={validationSchema}
                onSubmit={handleLogin}
            >
                {({ handleSubmit, handleChange, handleBlur, values, errors, touched, setFieldValue }) => (
                    <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
                        <TextInput
                            mode="flat"
                            label="Nome"
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            style={{ backgroundColor: theme.background }}
                            error={touched.name && Boolean(errors.name)}
                        />
                        {touched.name && errors.name && (
                            <HelperText type="error">{errors.name}</HelperText>
                        )}

                        <TextInput
                            mode="flat"
                            label="Descrição"
                            value={values.description}
                            onChangeText={handleChange('description')}
                            onBlur={handleBlur('description')}
                            style={{ backgroundColor: theme.background }}
                            error={touched.description && Boolean(errors.description)}
                        />
                        {touched.description && errors.description && (
                            <HelperText type="error">{errors.description}</HelperText>
                        )}

                        <Text variant="titleMedium" style={{ marginTop: 10 }}>Categoria</Text>

                        <FlatList
                            data={workoutCategories}
                            keyExtractor={(item) => item}
                            numColumns={3}
                            contentContainerStyle={{ padding: 16 }}
                            columnWrapperStyle={{ justifyContent: "space-between" }}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{
                                        flex: 1,
                                        backgroundColor: "#4CAF50",
                                        margin: 8,
                                        padding: 16,
                                        borderRadius: 10,
                                        alignItems: "center",
                                        shadowColor: "#000",
                                        shadowOpacity: 0.2,
                                        shadowOffset: { width: 2, height: 2 },
                                        elevation: 4,
                                    }}
                                    activeOpacity={0.7}
                                    onPress={() => console.log(item)}
                                >
                                    <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />

                        <Text variant="titleMedium" style={{ marginTop: 10 }}>Grupos musculares</Text>

                        <FlatList
                            data={muscleGroup}
                            keyExtractor={(item) => item}
                            numColumns={3}
                            contentContainerStyle={{ padding: 16 }}
                            columnWrapperStyle={{ justifyContent: "space-between" }}
                            renderItem={({ item }) => (
                                <Chip
                                    icon={values.muscleGroup.includes(item) ? 'check' : undefined}
                                    mode='outlined'
                                    onPress={() => {
                                        const newMuscleGroup = [...values.muscleGroup];
                                        if (newMuscleGroup.includes(item)) {
                                            const index = newMuscleGroup.indexOf(item);
                                            newMuscleGroup.splice(index, 1);
                                        } else {
                                            newMuscleGroup.push(item);
                                        }
                                        setFieldValue('muscleGroup', newMuscleGroup);
                                    }}
                                    selected={values.muscleGroup.includes(item)}
                                    style={{ marginVertical: 5 }}
                                >
                                    {item}
                                </Chip>
                            )}
                        />

                        <Button
                            mode="contained"
                            onPress={handleSubmit as any}
                            loading={isLoadingButton}
                            disabled={isLoadingButton}
                            style={{
                                borderRadius: 10,
                                marginVertical: 20,
                            }}
                            contentStyle={{ height: 50 }}
                        >
                            Salvar
                        </Button>
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
};


export default CreateExercise;
