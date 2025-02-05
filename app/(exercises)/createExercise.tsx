import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
        <View style={{ flex: 1 }}
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
                {({
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    values,
                    errors,
                    touched,
                    setFieldValue,
                }) => (
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 5,
                        }}
                    >
                        <TextInput
                            mode="flat"
                            label="Nome"
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            style={{
                                backgroundColor: theme.background,
                            }}
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
                            style={{
                                backgroundColor: theme.background,
                            }}
                            error={touched.description && Boolean(errors.description)}
                        />
                        {touched.description && errors.description && (
                            <HelperText type="error">{errors.description}</HelperText>
                        )}

                        <TextInput
                            mode="flat"
                            label="Categoria"
                            value={values.category}
                            onChangeText={handleChange('category')}
                            onBlur={handleBlur('category')}
                            style={{
                                backgroundColor: theme.background,
                            }}
                            error={touched.category && Boolean(errors.category)}
                        />
                        {touched.category && errors.category && (
                            <HelperText type="error">{errors.category}</HelperText>
                        )}
                        <Text variant="titleMedium">Grupos musculares</Text>

                        <View style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            gap: 10,
                        }}>
                            {muscleGroup.map((muscle) => (
                                <Chip
                                    key={muscle}
                                    icon={values.muscleGroup.includes(muscle) ? 'check' : undefined}
                                    mode='outlined'
                                    onPress={() => {
                                        const newMuscleGroup = [...values.muscleGroup];
                                        if (newMuscleGroup.includes(muscle)) {
                                            const index = newMuscleGroup.indexOf(muscle);
                                            newMuscleGroup.splice(index, 1); // Remove if already selected
                                        } else {
                                            newMuscleGroup.push(muscle); // Add if not selected
                                        }
                                        setFieldValue('muscleGroup', newMuscleGroup);
                                    }}
                                    selected={values.muscleGroup.includes(muscle)}
                                    style={{ marginVertical: 5 }}
                                >
                                    {muscle}
                                </Chip>
                            ))}
                        </View>
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
        </View>
    );
};


export default CreateExercise;
