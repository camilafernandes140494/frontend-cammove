import React, { useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Appbar, Avatar, Button, Card, Dialog, Divider, IconButton, Portal, Snackbar, Text } from 'react-native-paper';
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
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { getRelationship } from '@/api/relationships/relationships.api';
import { useQuery } from '@tanstack/react-query';
import { Calendar } from 'react-native-calendars';
import { getScheduleDates } from '@/api/schedules/schedules.api';
import { getReviewsByTeacher } from '@/api/reviews/reviews.api';
import Skeleton from '@/components/Skeleton';

export type RootHomeStackParamList = {
    home: undefined;
    UserList: undefined;
    StudentProfile: { studentProfileId?: string };
    RegisterUserByTeacher: undefined
    Reviews: undefined
};

const Home = () => {
    const { user, setUser } = useUser();
    const [visible, setVisible] = useState(false);
    const { theme, toggleTheme, isDarkMode } = useTheme();
    const [rating, setRating] = useState(0);
    const [visibleConfig, setVisibleConfig] = useState(false);

    const navigation = useNavigation<NavigationProp<RootHomeStackParamList>>();
    type IoniconName = keyof typeof Ionicons.glyphMap;


    const modalSchema = z.object({
        name: z.string().min(1, "Obrigatório"),
    });

    const { control, handleSubmit } = useForm<z.infer<typeof modalSchema>>({
        resolver: zodResolver(modalSchema),
        defaultValues: {
            name: user?.name || '',
        },
    });

    const { data: students, refetch: studentsRefetch } = useQuery({
        queryKey: ['getRelationship', user?.id],
        queryFn: () => getRelationship(user?.id!,),
        enabled: !!user?.id
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


    const { data: scheduleDates, isLoading, isFetching, refetch } = useQuery({
        queryKey: ['getScheduleDates'],
        queryFn: () => getScheduleDates(user?.id!),
        enabled: !!user?.id,
    });

    const markedDates = scheduleDates?.dates.reduce((acc, date) => {
        acc[date] = {
            marked: true,
            dotColor: theme.colors.card.purple.border.default,
            selected: true,
            selectedColor: theme.colors.card.purple.border.default
        };
        return acc;
    }, {} as Record<string, any>);


    const { data: reviewsByTeacher, refetch: reviewsByTeacherRefetch, isLoading: reviewsByTeacherIsLoading, isFetching: reviewsByTeacherIsFetching } = useQuery({
        queryKey: ['reviewsByTeacherWithLimit', user?.id],
        queryFn: () => getReviewsByTeacher(user?.id || '', { limit: '7' }),
        enabled: !!user?.id,
    });

    const firstSevenReviews = reviewsByTeacher?.slice(0, 7) || [];

    const averageNote = firstSevenReviews.length > 0
        ? firstSevenReviews.reduce((sum, review) => sum + Number(review.reviewNote), 0) / firstSevenReviews.length
        : 0;

    const maxNoteFromApi = 5; // Atualize aqui se o reviewNote agora vai até 5
    const starsToDisplay = 5;

    const normalizedNote = (averageNote / maxNoteFromApi) * starsToDisplay;

    function getStarType(index: number) {
        if (index <= normalizedNote) {
            return "star";
        } else {
            return "star-outline";
        }
    }

    console.log(reviewsByTeacher)
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <Appbar.Header mode='small'>
                <Appbar.Content title="CamMove" />
                <Appbar.Action icon="bell-outline" onPress={() => { }} />
                <Appbar.Action icon="menu" onPress={() => setVisibleConfig(!visibleConfig)} />
                <Portal>
                    <Dialog visible={visibleConfig} onDismiss={() => setVisibleConfig(false)}>
                        <Dialog.Title style={{ textAlign: 'center' }}>Configurações</Dialog.Title>
                        <Dialog.Content style={{ alignItems: 'flex-start', gap: 16 }}>

                            <Button mode="text" icon={isDarkMode ? 'moon-waning-crescent' : 'weather-sunny'} onPress={toggleTheme}>
                                {isDarkMode ? 'Usar tema claro' : 'Usar tema escuro'}
                            </Button>
                            <Divider style={{ width: '100%', backgroundColor: theme.colors.outlineVariant, height: 1 }} />
                            <CustomModal
                                onPress={handleSubmit(onSubmit)}
                                title="Editar perfil"
                                trigger={
                                    <Button mode="text" icon="cog-outline">
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

                            <Divider style={{ width: '100%', backgroundColor: theme.colors.outlineVariant, height: 1 }} />

                            <CustomModal
                                onPress={() =>
                                    setUser({
                                        id: null,
                                        name: null,
                                        gender: null,
                                        permission: null,
                                        token: null,
                                        status: null
                                    })
                                }
                                title="Tem certeza de que deseja sair? Você precisará fazer login novamente para acessar sua conta."
                                primaryButtonLabel="Sair"
                                trigger={
                                    <Button mode="text" icon="logout">
                                        Sair
                                    </Button>
                                }
                            />
                        </Dialog.Content>
                    </Dialog>
                </Portal>



            </Appbar.Header>
            <View style={{ display: 'flex', backgroundColor: theme.colors.secondaryContainer, flexDirection: 'row', alignItems: "center", padding: 16, gap: 16 }}>
                <Avatar.Text label={getInitials(user?.name || '')} />
                <Text variant="headlineMedium" >
                    Olá, {user?.name}
                </Text>
            </View>


            <ScrollView
                style={{ flex: 1, }}
                contentContainerStyle={{
                    display: 'flex',
                    flexDirection: 'column',
                    // alignItems: 'center',
                    padding: 24,
                    gap: 24
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading || isFetching}
                        onRefresh={() => { refetch(), reviewsByTeacherRefetch(), studentsRefetch() }}
                    />
                }
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
                            label: 'Total de alunos', value: students?.students.length, icon: 'people-outline', backgroundColor: theme.colors.primary, color: theme.colors.onPrimary,
                        },
                        {
                            label: 'Alunos ativos', value: students?.students.filter(student => student.studentStatus === "ACTIVE").length, icon: 'person-outline',
                            backgroundColor: theme.colors.card.feedback.background, color: theme.colors.card.feedback.text.primary,
                        },
                        { label: 'Alunos inativos', value: students?.students.filter(student => student.studentStatus === "INACTIVE").length, icon: 'warning-outline', backgroundColor: theme.colors.error, color: theme.colors.onError, },

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
                <View
                    style={{
                        backgroundColor: '#fff',
                        borderRadius: 12,
                        padding: 10,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                    }}
                >
                    <Calendar
                        markedDates={markedDates}
                        monthFormat={'MMMM yyyy'}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ width: 12, height: 12, backgroundColor: theme.colors.card.purple.border.default, borderRadius: 6, marginRight: 6 }} />
                        <Text style={{ color: theme.colors.card.purple.text.primary }}>Agendamentos</Text>
                    </View>
                </View>
                <Card >
                    <Card.Content>
                        <Text variant='titleMedium'>Gerenciar Alunos</Text>
                    </Card.Content>
                    <Card.Cover style={{ height: 300, backgroundColor: 'transparent' }} source={require('@/assets/images/student.png')} />
                    <Card.Actions>
                        <Button onPress={() => navigation.navigate('UserList')}>Ver</Button>
                        <Button onPress={() => navigation.navigate('RegisterUserByTeacher')}>Adicionar</Button>
                    </Card.Actions>
                </Card>


                {reviewsByTeacherIsLoading || reviewsByTeacherIsFetching ? <Skeleton style={{ height: 200, borderRadius: 16 }} /> : <View style={{ backgroundColor: theme.colors.card.feedback.background, borderRadius: 16 }}>
                    <Card.Title
                        title="Feedbacks dos treinos"
                        subtitle="Resultado dos últimos 7 dias"
                        titleStyle={{ color: theme.colors.card.feedback.text.primary }}
                        subtitleStyle={{ color: theme.colors.card.feedback.text.secondary }}
                        right={() => <Button textColor={theme.colors.card.feedback.button} onPress={() => navigation.navigate('Reviews')} >Ver mais</Button>}
                    />
                    <Divider bold={true} style={{ marginVertical: 8, marginHorizontal: 16, backgroundColor: theme.colors.card.feedback.button }} />
                    <View style={{ display: 'flex', alignItems: 'center', margin: 16 }}>
                        <Text variant="displayMedium" style={{ color: theme.colors.card.feedback.text.primary }}>{normalizedNote.toFixed(1)}</Text>

                        <View style={{ flexDirection: "row", justifyContent: "center" }}>
                            {[1, 2, 3, 4, 5].map((star, index) => (
                                <IconButton
                                    key={star}
                                    icon={getStarType(star)}
                                    iconColor={theme.colors.card.feedback.text.primary}
                                    size={24}
                                />
                            ))}
                        </View>
                        <Text variant="bodySmall" style={{ color: theme.colors.card.feedback.text.primary }}>Nível de satisfação</Text>
                    </View>

                </View>}



            </ScrollView>

        </View >

    );
};

export default Home;
