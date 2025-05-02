import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Snackbar, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useUser } from '@/app/UserContext';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getUsers } from '@/api/users/users.api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from "zod";
import { postRelationship } from '@/api/relationships/relationships.api';
import { Users } from '@/api/users/users.types';
import { useTheme } from '@/app/ThemeContext';
import { getInitials } from '@/common/common';

interface UserListProps {
    params?: Record<string, string>,
    navigation: any
}

const UserList = ({ params, navigation }: UserListProps) => {
    const { user, setUser } = useUser();
    const { theme } = useTheme();
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


    const { handleSubmit, getValues, setValue } = useForm<z.infer<typeof schema>>({
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
    const [expanded, setExpanded] = useState(false);


    const [selectedOption, setSelectedOption] = useState<Users>()

    useEffect(() => {
        setValue('teacherId', {
            birthDate: selectedOption?.birthDate || '',
            createdAt: selectedOption?.createdAt || '',
            deletedAt: selectedOption?.deletedAt || '',
            email: selectedOption?.email || '',
            gender: selectedOption?.gender || '',
            id: selectedOption?.id || '',
            name: selectedOption?.name || '',
        })
    }, [selectedOption])

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



            <List.Section style={{
                width: '100%',
                borderWidth: 1,
                borderRadius: 10,
                borderColor: theme.colors.primary || '#ccc',
                overflow: 'hidden',
            }}>
                <List.Accordion
                    title={selectedOption?.name || "Escolha um professor"}
                    expanded={expanded}
                    onPress={() => setExpanded(!expanded)}
                    titleStyle={{ fontSize: 16, color: theme.colors.primary }}
                >
                    {users?.map((opt) => (
                        <List.Item
                            key={opt.id}
                            title={opt.name}
                            left={() => (opt.image ? <Avatar.Image size={30} source={{ uri: opt.image }} style={{
                                marginLeft: 16
                            }} /> : <Avatar.Text size={30} label={getInitials(opt?.name || '')}
                                style={{
                                    marginLeft: 16
                                }}
                            />)}
                            onPress={() => {
                                setSelectedOption(opt);
                                setExpanded(false);
                            }}
                        />
                    ))}
                </List.Accordion>
            </List.Section>

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
