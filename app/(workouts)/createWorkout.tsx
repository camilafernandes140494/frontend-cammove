import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import {
    Text,
    Snackbar, Appbar, Button,
    Card,
    Avatar
} from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import SelectStudent from '@/components/SelectStudent';
import { Student } from '@/api/relationships/relationships.types';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from '@/components/FormField';
import { getGender, getInitials } from '@/common/common';
import { useTheme } from '../ThemeContext';
import { useUser } from '../UserContext';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '@/api/users/users.api';

const CreateWorkout = (navigation: any) => {
    const [visible, setVisible] = useState(false);
    const route = useRoute();
    const { workoutId } = route.params as { workoutId: string | undefined };
    const [student, setStudent] = useState<Student>();
    const [showButtonContinue, setShowButtonContinue] = useState(true);
    const { theme } = useTheme();
    const { user } = useUser();

    useEffect(() => {
        if (workoutId) {
            setStudent({ studentId: workoutId, studentName: 'Camila' }),
                setShowButtonContinue(false)
        }
    }, [workoutId])


    // const { data: exerciseById, isLoading } = useQuery({
    //     queryKey: ['getExerciseById', exerciseId],
    //     queryFn: () => getExerciseById(exerciseId || ''),
    //     enabled: !!exerciseId
    // });

    const {
        data: userWorkout,
        refetch,
        isError,
        isLoading,
    } = useQuery({
        queryKey: ['getUserWorkout', workoutId],
        queryFn: () => getUserById(workoutId as string),
        enabled: !!workoutId,
    });

    const schema = z.object({
        type: z.string(),
        role: z.enum(["admin", "user"], { required_error: "Selecione um papel" }),
    });

    const { control, handleSubmit, watch } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            type: "",
            role: "user" as "admin" | "user",
        },
    });

    const selectedType = watch("type");


    const onSubmit = (data: any) => console.log("Formulário enviado", data);

    return (
        <FlatList
            style={{ flex: 1, }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            ListHeaderComponent={
                <>
                    <Appbar.Header>
                        <Appbar.BackAction onPress={() => navigation.navigate('Workouts')} />
                        <Appbar.Content title="Cadastrar treino" />
                    </Appbar.Header>
                    <View style={{ backgroundColor: theme.colors.secondaryContainer }}>
                        <Card.Title
                            title={userWorkout?.name}
                            subtitle={`Gênero: ${getGender(userWorkout?.gender || '')}`}
                            left={(props) => <Avatar.Text {...props} label={getInitials(userWorkout?.name || '')} />}
                        />
                    </View>
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
            keyExtractor={() => 'header'}
            renderItem={() => <>

                {showButtonContinue ? <>
                    <SelectStudent
                        teacherId={'TgTfDirVTOQR5ZOxgFgr'}
                        navigation={navigation}
                        onSelect={(student) => setStudent(student)} />
                    <Button
                        mode="contained"
                        onPress={() => setShowButtonContinue(false)}
                        style={{ margin: 20 }}
                    >
                        Continuar
                    </Button>
                </>
                    :
                    <View style={{ padding: 20 }}>
                        {selectedType === '' || selectedType !== "Personalizado" &&
                            <Text>Objetivo de treino</Text>
                        }
                        <FormField
                            control={control}
                            name="type"
                            label="Escolha seu objetivo de treino"
                            type="select"
                            options={[
                                { label: "Personalizado", value: "Personalizado" },
                                { label: "Hipertrofia", value: "Hipertrofia" },
                                { label: "Emagrecimento", value: "Emagrecimento" },
                                { label: "Resistência", value: "Resistência" },
                                { label: "Definição", value: "Definição" },
                                { label: "Força", value: "Força" },
                                { label: "Flexibilidade", value: "Flexibilidade" },
                                { label: "Equilíbrio", value: "Equilíbrio" },
                                { label: "Saúde geral", value: "Saúde geral" },
                                { label: "Velocidade", value: "Velocidade" },
                                { label: "Desempenho atlético", value: "Desempenho atlético" },
                                { label: "Pré-natal", value: "Pré-natal" },
                                { label: "Reabilitação", value: "Reabilitação" },
                                { label: "Mobilidade", value: "Mobilidade" },
                                { label: "Potência", value: "Potência" },
                            ]}
                        />
                        {selectedType === "personalizado" && (
                            <FormField control={control} name="customType" label="Objetivo do Treino" type="text" />
                        )}

                        <FormField
                            control={control}
                            name="radioField"
                            label="Escolha uma opção"
                            type="radio"
                            options={[
                                { label: "Hipertrofia (Aumento de massa muscular)", value: "Hipertrofia (Aumento de massa muscular)" },
                                { label: "Opção 2", value: "2" },
                                { label: "Opção 3", value: "3" },
                            ]}
                        />

                        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
                            Enviar
                        </Button>
                    </View>}
            </>
            }
        />
    );
};

export default CreateWorkout;
