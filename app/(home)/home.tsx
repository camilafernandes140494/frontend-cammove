import React, { useState } from 'react';
import { ScrollView, View, } from 'react-native';
import { Appbar, Avatar, Button, Snackbar, Text } from 'react-native-paper';
import { useUser } from '../UserContext';
import { getInitials } from '@/common/common';
import CustomModal from '@/components/CustomModal';
import { FormField } from '@/components/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import * as z from "zod";
import { patchUser } from '@/api/users/users.api';
import { useTheme } from '../ThemeContext';

const Home = () => {
    const { user, setUser } = useUser();
    const [visible, setVisible] = useState(false);
    const { theme } = useTheme();

    const modalSchema = z.object({
        name: z.string().min(1, "Obrigatório"),
    });

    const { control, handleSubmit } = useForm<z.infer<typeof modalSchema>>({
        resolver: zodResolver(modalSchema),
        defaultValues: {
            name: user?.name || '',
        },
    });


    const onSubmit = async (data: any) => {
        try {
            await patchUser(user?.id || '', data);
            setUser({ name: data.name })
        } catch (error) {
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                action={{
                    label: '',
                    icon: 'close',
                    onPress: () => setVisible(false),
                }}
            >
                <Text>Erro ao atualizar usuário</Text>
            </Snackbar>
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <Appbar.Header mode='small'>
                <Appbar.Content title="CamMove" />
                <Appbar.Action icon="bell-outline" onPress={() => { }} />
            </Appbar.Header>
            <View style={{ display: 'flex', backgroundColor: theme.colors.secondaryContainer, flexDirection: 'row', alignItems: "center", padding: 16 }}>
                <Avatar.Text label={getInitials(user?.name || '')} />

                <View style={{ display: 'flex', marginHorizontal: 16 }}>
                    <Text variant="headlineMedium" >
                        Olá, {user?.name}
                    </Text>

                    <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>

                        <CustomModal
                            onPress={handleSubmit(onSubmit)}
                            title="Editar perfil"
                            trigger={
                                <Button mode="text" icon="cog-outline" >
                                    Editar perfil
                                </Button>
                            }
                        >
                            <FormField
                                control={control}
                                mode="flat"
                                name="name"
                                label="Nome"
                                type="text"
                            />
                        </CustomModal>

                        <CustomModal
                            onPress={() => setUser({
                                id: null,
                                name: null,
                                gender: null,
                                permission: null,
                                token: null
                            })}
                            title="Tem certeza de que deseja sair? Você precisará fazer login novamente para acessar sua conta."
                            primaryButtonLabel="Sair"
                            trigger={
                                <Button mode="text" icon="logout" >
                                    Sair
                                </Button>
                            }
                        />
                    </View>
                </View>
            </View>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    display: 'flex',
                    flexDirection: 'column',
                    // alignItems: 'center',
                    padding: 24,
                }}
            >
                <Text variant="titleMedium">Acompanhe suas métricas</Text>
                <Text variant="titleMedium">Alunos ativos</Text>
                <Text variant="titleMedium">Feedbacks</Text>

                {/* <Skeleton style={{ width: '90%', height: 500, borderRadius: 10 }} /> */}
            </ScrollView>
        </View>

    );
};

export default Home;
