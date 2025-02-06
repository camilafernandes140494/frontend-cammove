import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
    TextInput,
    Button,
    HelperText,
    Text,
    Snackbar,
    Chip,
    List,
} from 'react-native-paper';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getExerciseById, postExercise } from '@/api/exercise/exercise.api';
import { Exercise } from '@/api/exercise/exercise.types';
import { useQuery } from '@tanstack/react-query';

const CreateExercise = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const route = useRoute();
    const { exerciseId } = route.params as { exerciseId: string | undefined };

    const { data: exerciseById } = useQuery({
        queryKey: ['getExerciseById', exerciseId],
        queryFn: () => getExerciseById(exerciseId || ''),
        enabled: !!exerciseId
    });

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('O nome é obrigatório'),
        description: Yup.string().required('A descrição é obrigatória'),
        category: Yup.string().required('A categoria é obrigatória'),
    });

    const handleLogin = async (values: Exercise) => {
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
        "Flexores de quadril",
        "Pernas"
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
                    name: exerciseById?.name || '',
                    description: exerciseById?.description || '',
                    muscleGroup: exerciseById?.muscleGroup || [] as string[],
                    category: exerciseById?.category || '',
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
                            multiline
                            numberOfLines={10}
                            textAlignVertical="top"
                            style={{ backgroundColor: theme.background }}
                            error={touched.description && Boolean(errors.description)}
                        />
                        {touched.description && errors.description && (
                            <HelperText type="error">{errors.description}</HelperText>
                        )}

                        {values.category && <Text variant="titleMedium" style={{ marginTop: 10, marginBottom: 10 }}>Categoria</Text>
                        }

                        <List.Accordion
                            title={values?.category || "Escolha uma categoria"}
                            expanded={expanded}
                            onPress={() => setExpanded(!expanded)}
                        >
                            {workoutCategories?.map((workout, index) => (
                                <List.Item
                                    key={index}
                                    style={{ backgroundColor: theme.colors.onPrimary }}
                                    title={workout}
                                    onPress={() => {
                                        setExpanded(false);
                                        setFieldValue('category', workout);
                                    }} />
                            ))}
                        </List.Accordion>

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
