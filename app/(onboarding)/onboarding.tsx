import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useTheme } from '../ThemeContext';
import CardProfile from '@/components/CardProfile';
import { AvatarImageSource } from 'react-native-paper/lib/typescript/components/Avatar/AvatarImage';
import { getUserById, patchUser, postUser } from '@/api/users/users.api';
import { useUser } from '../UserContext';
import { useQuery } from '@tanstack/react-query';
import UserForm from '@/components/UserForm';
import { GENDER, PERMISSION } from '@/api/users/users.types';
import { useNavigation } from '@react-navigation/native';
import Skeleton from '@/components/Skeleton';

const Onboarding = () => {
    const { theme } = useTheme();
    const [profile, setProfile] = useState(0);
    const { user, setUser } = useUser();

    const {
        data: userById,
        refetch,
        isError,
        isLoading,
    } = useQuery({
        queryKey: ['getUserById', user?.id],
        queryFn: () => getUserById(user?.id as string),
        enabled: !!user?.id,
    });

    useEffect(() => {
        setUser({
            name: userById?.name,
            permission: userById?.permission,
            gender: userById?.gender,
        });
    }, [userById]);

    type CarouselItem = {
        title: string;
        description: string;
        image: AvatarImageSource;
        color: string;
        status: PERMISSION;
    };

    const carouselItems: CarouselItem[] = [
        {
            title: 'Sou um Aluno',
            description:
                'Como aluno, você pode acessar seus treinos personalizados, acompanhar seu progresso e comunicar-se diretamente com seu personal trainer para garantir que você esteja no caminho certo para alcançar seus objetivos!',
            image: require('@/assets/images/student.png'),
            color: 'blue',
            status: 'STUDENT',
        },
        {
            title: 'Sou um Personal Trainer',
            description:
                'Se você é um personal trainer, esta é a opção certa para você! Aqui, você pode criar treinos personalizados, gerenciar seus alunos e acompanhar o progresso deles com facilidade.',
            image: require('@/assets/images/personal-trainer.png'),
            color: 'beige',
            status: 'TEACHER',
        },
        // {
        //     title: "Sou um Administrador",
        //     description: "Área restrita",
        //     image: require('@/assets/images/admin.png'),
        //     color: 'purple',
        //     status: 'ADMIN'
        // },
    ];

    const handleLogin = async (values: {
        name: string;
        gender: GENDER;
        birthDate: string;
        permission: PERMISSION;
    }) => {
        try {
            if (!userById) {
                await postUser(user.id!, values);
                console.log('cadastrou');
                refetch();
            } else {
                await patchUser(user.id!, values);
                console.log('atualizou');
                refetch();
            }
        } catch (error) {
            console.error('Erro ao editar usuario', error);
        }
    };

    return (
        <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: 20,
                gap: 20,
            }}
        >
            {!user.id && isLoading ? (
                <Skeleton style={{ width: '90%', height: 500, borderRadius: 20 }} />
            ) : (
                <>
                    {!user?.permission ? (
                        <>
                            <Text variant="headlineLarge" style={{ textAlign: 'center' }}>
                                Escolha seu perfil para começar
                            </Text>
                            <Card
                                mode="contained"
                                contentStyle={{
                                    borderRadius: 20,
                                    backgroundColor:
                                        theme.colors.card[carouselItems[profile].color].background
                                            .default,
                                }}
                            >
                                <Card.Content
                                    style={{
                                        padding: 20,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <CardProfile
                                        title={carouselItems[profile].title}
                                        description={carouselItems[profile].description}
                                        image={carouselItems[profile].image}
                                        color={carouselItems[profile].color}
                                        status={carouselItems[profile].status}
                                        onStatus={(status) =>
                                            handleLogin({
                                                name: '',
                                                gender: null,
                                                birthDate: '',
                                                permission: status as PERMISSION,
                                            })
                                        }
                                    />
                                </Card.Content>
                                <Card.Actions>
                                    <IconButton
                                        icon="chevron-left"
                                        size={20}
                                        onPress={() => setProfile(profile - 1)}
                                        disabled={profile === 0}
                                    />
                                    <IconButton
                                        icon="chevron-right"
                                        size={20}
                                        mode="outlined"
                                        onPress={() => setProfile(profile + 1)}
                                        disabled={profile === carouselItems.length - 1}
                                    />
                                </Card.Actions>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Text variant="headlineMedium" style={{ textAlign: 'center' }}>
                                Me conte um pouco sobre você
                            </Text>
                            <Card mode="contained" style={{ width: '100%' }}>
                                <UserForm onSubmit={handleLogin} />
                            </Card>
                        </>
                    )}
                </>
            )}
        </ScrollView>
    );
};

export default Onboarding;
