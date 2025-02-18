import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    TextInput,
    Button,
    HelperText,
    Text,
    Snackbar,
    Chip,
    List,
    Appbar,
    ActivityIndicator,
} from 'react-native-paper';
import { useTheme } from '../ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getExerciseById, patchExercise, postExercise } from '@/api/exercise/exercise.api';
import { Exercise } from '@/api/exercise/exercise.types';
import { useQuery } from '@tanstack/react-query';
import ImageUpload from '@/components/ImageUpload ';

const CreateExercise = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const route = useRoute();
    const { exerciseId } = route.params as { exerciseId: string | undefined };

    const { data: exerciseById, isLoading } = useQuery({
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
            if (!exerciseId) {
                await postExercise(values);
            } else {
                console.log(values, 'values')
                await patchExercise(exerciseId, values);
            }
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
        "Trapézio",
        "Lombares",
        "Serrátil anterior",
        "Reto abdominal",
        "Oblíquos",
        "Erectores da espinha",
        "Flexores de tornozelo"
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
        <FlatList
            style={{ flex: 1, }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            ListHeaderComponent={
                <>
                    <Appbar.Header>
                        <Appbar.BackAction onPress={() => navigation.goBack()} />
                        <Appbar.Content title="Cadastrar exercício" />
                    </Appbar.Header>
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
                </>
            }
            data={[{}]}
            keyExtractor={() => exerciseById?.id || 'header'}  // Usar id ou um identificador único
            renderItem={() => <>{
                isLoading ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" color="#6200ea" /> : <Formik
                    initialValues={{
                        name: exerciseById?.name || '',
                        description: exerciseById?.description || '',
                        muscleGroup: exerciseById?.muscleGroup || [] as string[],
                        category: exerciseById?.category || '',
                        images: exerciseById?.images || []
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({ handleSubmit, handleChange, handleBlur, values, errors, touched, setFieldValue }) => (
                        <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
                            <ImageUpload onSelect={(url) => setFieldValue('images', [url])} />
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

                            {values.category && <Text variant="titleMedium" style={{ marginTop: 10, marginBottom: 16 }}>Categoria</Text>}

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

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 10, gap: 10 }}>
                                {muscleGroup.map((item, index) => <Chip
                                    key={index}
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
                                </Chip>)}

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
            }
            </>
            }
        />
    );
};

export default CreateExercise;
