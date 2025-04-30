import React, { useState } from 'react';
import { Avatar, Button, Snackbar, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useUser } from '@/app/UserContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUsers } from '@/api/users/users.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { FormField } from './FormField';
import { postRelationship } from '@/api/relationships/relationships.api';

interface UserListProps {
    params?: Record<string, string>,
    navigation: any
}

const UserList = ({ params, navigation }: UserListProps) => {
    const { user, setUser } = useUser();

    const [errorVisible, setErrorVisible] = useState(false);

    const { data: users, isLoading } = useQuery({
        queryKey: ['getUsers'],
        queryFn: () => getUsers(params)
    });

    const schema = z.object({
        teacherId: z
            .object({
                birthDate: z.string(),
                createdAt: z.string(),
                deletedAt: z.string(),
                email: z.string(),
                gender: z.string(),
                id: z.string().min(1, { message: "ID é obrigatório" }),
                name: z.string(),
            })
    });


    const { control, handleSubmit, getValues } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            teacherId: {},

        },
    });

    const mutation = useMutation({
        mutationFn: async () => {
            console.log(getValues().teacherId.id!, user?.id!)
            await postRelationship(getValues().teacherId.id!, user?.id!);
        },
        onSuccess: () => {
            setUser({ ...user, onboarding_completed: true, })
        },
        onError: () => {
            setErrorVisible(true);
        }
    });

    const onSubmit = async () => {
        mutation.mutate();
    };


    return (
        <View style={{ padding: 20, gap: 20, alignItems: 'center' }} >
            <Snackbar
                visible={errorVisible}
                onDismiss={() => setErrorVisible(false)}
                action={{ label: '', icon: 'close', onPress: () => setErrorVisible(false) }}
            >
                <Text>Ocorreu um erro ao selecionar o professor. Tente novamente.</Text>
            </Snackbar>


            <Text variant='titleMedium' style={{ marginBottom: 20 }}>
                Selecione o professor responsável
            </Text>
            <Avatar.Image size={200} source={require('@/assets/images/personal-trainer.png')} />
            <FormField
                control={control}
                name="teacherId"
                label="Escolha um professor"
                type="select"
                getLabel={(option) => option.name}
                options={users}
            />
            <Button
                mode="contained"
                onPress={handleSubmit(onSubmit)}
                loading={mutation.isPending}
                disabled={mutation.isPending}
                style={{ borderRadius: 24, }}
                contentStyle={{ height: 50 }}
            >
                Salvar
            </Button>


        </View >
    );
};

export default UserList;
