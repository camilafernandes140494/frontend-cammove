import React, { useEffect, useState } from 'react';
import { View, FlatList, ScrollView } from 'react-native';
import {
    Button, Text,
    Snackbar, Appbar,
    ActivityIndicator
} from 'react-native-paper';
import { useTheme } from '@/context/ThemeContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getExerciseById, patchExercise, postExercise } from '@/api/exercise/exercise.api';
import { Exercise } from '@/api/exercise/exercise.types';
import { useMutation, useQuery } from '@tanstack/react-query';
import ImageUpload from '@/components/ImageUpload ';
import { FormField } from '@/components/FormField';

import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageWithActions } from '@/components/ImageWithActions';

const CreateExercise = () => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [visible, setVisible] = useState(false);
    const route = useRoute();
    const { exerciseId } = route.params as { exerciseId: string | undefined };

    const { data: exerciseById, isLoading, refetch } = useQuery({
        queryKey: ['getExerciseById', exerciseId],
        queryFn: () => getExerciseById(exerciseId || ''),
        enabled: !!exerciseId
    });


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


    const schema = z.object({
        name: z.string().nonempty('O nome é obrigatório'),
        description: z.string().nonempty('A descrição é obrigatória'),
        categoryData: z
            .object({
                label: z.string(),
                value: z.string(),
            })
            .refine(value => value !== undefined, { message: "Obrigatório" }),
        images: z.array(z.string()),
        muscleGroup: z.array(z.string()),
    });


    const { control, handleSubmit, reset, setValue } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: exerciseById?.name || '',
            description: exerciseById?.description || "",
            categoryData: {},
            images: exerciseById?.images || [],
            muscleGroup: exerciseById?.muscleGroup || [],
        },
    });

    useEffect(() => {
        if (exerciseById) {
            reset({ ...exerciseById, categoryData: { label: exerciseById.category, value: exerciseById.category } });
        }
    }, [exerciseById, reset]);


    const mutation = useMutation({
        mutationFn: async (values: Exercise) => {
            if (!exerciseId) {
                await postExercise(values);
            } else {
                await patchExercise(exerciseId, values);
            }
        },
        onSuccess: () => {
            navigation.navigate('Exercises' as never)
        },
        onError: () => {
            setVisible(true);
        }
    });

    const onSubmit = async (data: any) => {
        mutation.mutate({ ...data, images: [...(exerciseById?.images || []), ...(data.images || [])], category: data.categoryData.value });
    };

    const muscleGroupChip = muscleGroup?.map(item => ({
        label: item,
        value: item,
    }));

    const workoutCategoriesSelect = workoutCategories?.map(item => ({
        label: item,
        value: item,
    }));

    return (
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
            <FlatList
                style={{ flex: 1, backgroundColor: theme.colors.background }}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                data={[{}]}
                keyExtractor={() => exerciseById?.id || 'header'}  // Usar id ou um identificador único
                renderItem={() => <>
                    {isLoading ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" /> :
                        <View style={{ padding: 20, }}>
                            <ImageUpload onSelect={(url) => setValue('images', url)} storageFolder='exercises' />
                            {(exerciseById?.images?.length || 0) > 0 && (
                                <ScrollView
                                    horizontal
                                    style={{ marginTop: 20 }}
                                    contentContainerStyle={{ alignItems: 'center' }}
                                >
                                    {exerciseById?.images?.map((uri, index) => (
                                        <ImageWithActions
                                            key={index}
                                            uri={uri}
                                            onDelete={async () => {
                                                const updated = exerciseById?.images?.filter((uriImage) => uriImage !== uri);
                                                await patchExercise(exerciseId!, { ...exerciseById, images: updated });
                                                setValue('images', updated || []);
                                                refetch()
                                            }}
                                        />

                                    ))}
                                </ScrollView>
                            )}
                            <FormField control={control} name="name" label="Nome" type="text" />
                            <FormField control={control} name="description" label="Descrição" type="text"
                                multiline
                                numberOfLines={10}
                                textAlignVertical="top" />
                            <FormField
                                control={control}
                                name="categoryData"
                                label="Categoria"
                                type="select"
                                getLabel={(option) => option.label}
                                options={workoutCategoriesSelect}
                            />
                            <FormField
                                control={control}
                                name="muscleGroup"
                                type="chip-multi"
                                options={muscleGroupChip}
                            />
                            <Button
                                mode="contained"
                                onPress={handleSubmit(onSubmit)}
                                loading={mutation.isPending}
                                disabled={mutation.isPending}
                                style={{
                                    borderRadius: 24,
                                    marginVertical: 20,
                                }}
                            >
                                Salvar
                            </Button>
                        </View>
                    }
                </>
                }
            />
        </>

    );
};

export default CreateExercise;
