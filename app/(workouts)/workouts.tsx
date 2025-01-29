import React, { useEffect, useState } from "react";
import { ScrollView, } from "react-native";
import { Text, Card, IconButton } from "react-native-paper";
import { useTheme } from "../ThemeContext";
import CardProfile from "@/components/CardProfile";
import { AvatarImageSource } from "react-native-paper/lib/typescript/components/Avatar/AvatarImage";
import { getUserById, patchUser, postUser } from "@/api/users/users.api";
import { useUser } from "../UserContext";
import { useQuery } from "@tanstack/react-query";
import UserForm from "@/components/UserForm";
import { GENDER, PERMISSION } from "@/api/users/users.types";
import { useNavigation } from "@react-navigation/native";
import Skeleton from "@/components/Skeleton";

const Workouts = () => {
    const { theme } = useTheme();
    const [profile, setProfile] = useState(0);
    const { user, setUser } = useUser();
    const navigation = useNavigation();


    type CarouselItem = {
        title: string;
        description: string;
        image: AvatarImageSource;
        color: string;
        status: PERMISSION
    };

    const carouselItems: CarouselItem[] = [
        {
            title: "Sou um Aluno",
            description: "Como aluno, você pode acessar seus treinos personalizados, acompanhar seu progresso e comunicar-se diretamente com seu personal trainer para garantir que você esteja no caminho certo para alcançar seus objetivos!",
            image: require('@/assets/images/student.png'),
            color: 'blue',
            status: 'STUDENT'
        },
        {
            title: "Sou um Personal Trainer",
            description: "Se você é um personal trainer, esta é a opção certa para você! Aqui, você pode criar treinos personalizados, gerenciar seus alunos e acompanhar o progresso deles com facilidade.",
            image: require('@/assets/images/personal-trainer.png'),
            color: 'beige',
            status: 'TEACHER'
        },
        // {
        //     title: "Sou um Administrador",
        //     description: "Área restrita",
        //     image: require('@/assets/images/admin.png'),
        //     color: 'purple',
        //     status: 'ADMIN'
        // },
    ];




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
            <CardProfile
                title={carouselItems[profile].title}
                description={carouselItems[profile].description}
                image={carouselItems[profile].image}
                color={carouselItems[profile].color}
                status={carouselItems[profile].status}
                onStatus={(status) => console.log({ name: '', gender: null, birthDate: '', permission: status as PERMISSION })}
            />

        </ScrollView>
    );
};

export default Workouts;
