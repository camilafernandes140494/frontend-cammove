import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Text, Card, IconButton } from 'react-native-paper';
import { useTheme } from '../ThemeContext';
import CardProfile from '@/components/CardProfile';
import { AvatarImageSource } from 'react-native-paper/lib/typescript/components/Avatar/AvatarImage';
import { patchUser } from '@/api/users/users.api';
import { useUser } from '../UserContext';
import UserForm from '@/components/UserForm';
import { PERMISSION, PostUser } from '@/api/users/users.types';
import Skeleton from '@/components/Skeleton';
import { postEmail } from '@/api/email/email.api';
import { useRoute } from '@react-navigation/native';

const Onboarding = () => {
    const { theme } = useTheme();
    const [profile, setProfile] = useState(0);
    const { user, setUser } = useUser();
    const route = useRoute();
    const { email } = route.params as { email: string | undefined };

    //
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
    ];

    const handleLogin = async (values: Partial<PostUser>) => {
        try {
            await patchUser(user?.id!, values);
            await postEmail({
                body: `Olá ${values.name}, <br><br>
                
                        Seja bem-vindo(a) à CamMove! 🎉<br><br>
                
                        Seu cadastro foi realizado com sucesso e agora você faz parte da nossa comunidade dedicada ao seu bem-estar e evolução. <br><br>
                
                        Fique à vontade para explorar todos os recursos disponíveis e, caso tenha alguma dúvida ou precise de ajuda, estamos à disposição.<br><br>
                
                        Vamos juntos alcançar seus objetivos! 💪<br><br>
                
                        Atenciosamente,<br>
                        Equipe CamMove 🚀`,

                subject: 'Bem-vindo(a) à CamMove – Cadastro Realizado com Sucesso!',
                to: [email || ""]
            });
            setUser({
                ...user,
                ...values
            })

        }
        catch (error) {
            console.error('Erro ao editar usuario', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <ScrollView
                contentContainerStyle={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 20,
                    gap: 20,
                    backgroundColor: theme.colors.background
                }}
            >
                {!user?.id ? (
                    <Skeleton style={{ width: '90%', height: 100, borderRadius: 20 }} />
                ) : (
                    <View style={{ marginTop: 50, }}>
                        {!user?.permission ? (
                            <>
                                <Text variant="headlineLarge" style={{ textAlign: 'center' }}>
                                    Escolha seu perfil para começar
                                </Text>
                                <Card
                                    mode="contained"
                                    contentStyle={{
                                        borderRadius: 10,
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
                                            theme={{
                                                colors: {
                                                    outline: theme.colors.card[carouselItems[profile].color].text
                                                        .primary
                                                }
                                            }}
                                            iconColor={theme.colors.card[carouselItems[profile].color].text
                                                .primary}
                                        />
                                        <IconButton
                                            icon="chevron-right"
                                            size={20}
                                            mode="outlined"
                                            theme={{
                                                colors: {
                                                    outline: theme.colors.card[carouselItems[profile].color].text
                                                        .primary
                                                }
                                            }}
                                            iconColor={theme.colors.card[carouselItems[profile].color].text
                                                .primary}
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
                                <View style={{ width: '100%' }}>
                                    <UserForm onSubmit={handleLogin} />
                                </View>
                            </>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default Onboarding;
