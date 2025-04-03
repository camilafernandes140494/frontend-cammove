import React, { useState } from 'react';
import { ScrollView, View, } from 'react-native';
import { Appbar, Avatar, Button, Card, Divider, IconButton, Snackbar, Text } from 'react-native-paper';
import { useUser } from '../UserContext';
import { getInitials } from '@/common/common';
import CustomModal from '@/components/CustomModal';
import { FormField } from '@/components/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import * as z from "zod";
import { patchUser } from '@/api/users/users.api';
import { useTheme } from '../ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import SelectStudent from '@/components/SelectStudent';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useStudent } from '../context/StudentContext';

export type RootHomeStackParamList = {
    home: undefined;
    StudentProfile: { studentProfileId?: string };
    RegisterUserByTeacher: undefined
};

const Home = () => {
    const { user, setUser } = useUser();
    const [visible, setVisible] = useState(false);
    const { theme, toggleTheme, isDarkMode } = useTheme();
    const [rating, setRating] = useState(0);
    const [showStudent, setShowStudent] = useState(false);
    const navigation = useNavigation<NavigationProp<RootHomeStackParamList>>();
    const { refetchStudent } = useStudent();

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

    type IoniconName = keyof typeof Ionicons.glyphMap;

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header mode='small'>
                <Appbar.Content title="CamMove" />
                <Appbar.Action icon="bell-outline" onPress={() => { }} />
            </Appbar.Header>
            <View style={{ display: 'flex', backgroundColor: theme.colors.secondaryContainer, flexDirection: 'row', alignItems: "center", padding: 16 }}>
                <Avatar.Text label={getInitials(user?.name || '')} />

                <View style={{ display: 'flex', marginHorizontal: 16 }}>
                    <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: '85%', gap: 16 }}>
                        <Text variant="headlineMedium" >
                            Olá, {user?.name}
                        </Text>
                        <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"}
                            size={24} onPress={toggleTheme} color={theme.colors.onBackground} />
                    </View>



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

            {showStudent ? <>
                <View style={{ display: 'flex', backgroundColor: theme.colors.secondaryContainer, flexDirection: 'row', alignItems: "center" }}>
                    <Appbar.BackAction onPress={() => setShowStudent(false)} />
                    <Appbar.Content title="Alunos" />
                </View>

                <SelectStudent
                    teacherId={user?.id!}
                    onSelect={(student) => { refetchStudent(student.studentId), navigation.navigate('StudentProfile', { studentProfileId: student.studentId }) }}
                />
            </> :

                <ScrollView
                    style={{ flex: 1, }}
                    contentContainerStyle={{
                        display: 'flex',
                        flexDirection: 'column',
                        // alignItems: 'center',
                        padding: 24,
                        gap: 24
                    }}
                >

                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                        }}
                    >
                        {[
                            {
                                label: 'Total de alunos', value: 10, icon: 'people-outline', backgroundColor: theme.colors.primary, color: theme.colors.onPrimary,
                            },
                            {
                                label: 'Alunos ativos', value: 50, icon: 'person-outline',
                                backgroundColor: theme.colors.card.feedback.background, color: theme.colors.card.feedback.text.primary,
                            },
                            { label: 'Alunos inativos', value: 30, icon: 'warning-outline', backgroundColor: theme.colors.error, color: theme.colors.onError, },

                        ].map((item, index) => (
                            <View
                                key={index}
                                style={{
                                    backgroundColor: item.backgroundColor,
                                    borderRadius: 16,
                                    width: '32%', // Agora são 3 colunas
                                    marginBottom: 10,
                                    padding: 12,
                                    alignItems: 'center', // Centraliza os textos e ícones
                                }}
                            >
                                <Ionicons name={item.icon as IoniconName} size={24} color={item.color} />
                                <Text
                                    variant="headlineSmall"
                                    style={{ color: item.color, textAlign: 'center' }}
                                >
                                    {item.value}
                                </Text>
                                <Text
                                    variant="bodyLarge"
                                    style={{ color: item.color, textAlign: 'center' }}
                                >
                                    {item.label}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Card >
                        <Card.Title
                            title="Gerenciar Alunos"
                        />
                        <Card.Cover style={{ height: 300 }} source={require('@/assets/images/student.png')} />
                        <Card.Actions>
                            <Button onPress={() => setShowStudent(true)}>Ver</Button>
                            <Button onPress={() => navigation.navigate('RegisterUserByTeacher')}>Adicionar</Button>
                        </Card.Actions>
                    </Card>

                    <View style={{ backgroundColor: theme.colors.card.feedback.background, borderRadius: 16 }}>
                        <Card.Title
                            title="Feedbacks dos treinos"
                            subtitle="Resultado dos últimos 7 dias"
                            titleStyle={{ color: theme.colors.card.feedback.text.primary }}
                            subtitleStyle={{ color: theme.colors.card.feedback.text.secondary }}
                            right={() => <Button textColor={theme.colors.card.feedback.button} onPress={() => { }} >Ver mais</Button>}
                        />
                        <Divider bold={true} style={{ marginVertical: 8, marginHorizontal: 16, backgroundColor: theme.colors.card.feedback.button }} />
                        <View style={{ display: 'flex', alignItems: 'center', margin: 16 }}>
                            <Text variant="displayMedium" style={{ color: theme.colors.card.feedback.text.primary }}>4.5</Text>

                            <View style={{ flexDirection: "row", justifyContent: "center" }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <IconButton
                                        key={star}
                                        icon={star <= rating ? "star" : "star-outline"}
                                        iconColor={theme.colors.card.feedback.text.primary}
                                        size={24}
                                        onPress={() => setRating(star)}
                                    />
                                ))}
                            </View>
                            <Text variant="bodySmall" style={{ color: theme.colors.card.feedback.text.primary }}>Nível de satisfação</Text>
                        </View>



                    </View>


                </ScrollView>
            }
        </View>

    );
};

export default Home;
