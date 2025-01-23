import React, { useRef, useState } from "react";
import { FlatList, SafeAreaView, TouchableOpacity, View, } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { TextInput, Button, HelperText, Text, Snackbar, SegmentedButtons, Card } from "react-native-paper";
import { postLogin } from "@/api/auth/auth.api";
import { useUser } from "../UserContext";
import { useTheme } from "../ThemeContext";
import CarouselWithDots from "@/components/CarouselWithDots";
import CardProfile from "@/components/CardProfile";

const Home = () => {
    const router = useRouter();
    const { setUser } = useUser();
    const { theme } = useTheme();
    const [value, setValue] = React.useState('');

    const [visible, setVisible] = useState(false);

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Por favor, insira um email válido")
            .required("O email é obrigatório"),
        password: Yup.string()
            .min(6, "A senha deve ter pelo menos 6 caracteres")
            .required("A senha é obrigatória"),
    });

    const handleLogin = async (values: { email: string; password: string }) => {
        try {
            const userCredential = await postLogin(values);
            setUser({ id: userCredential.user_id, email: '', name: "" })
            router.push('/home')
        } catch (error) {
            setVisible(true);
        }
    };


    const [currentIndex, setCurrentIndex] = useState(0);

    const carouselItems = [
        {
            title: "Sou um Personal Trainer",
            description: "Se você é um personal trainer, esta é a opção certa para você! Aqui, você pode criar treinos personalizados, gerenciar seus alunos e acompanhar o progresso deles com facilidade."
        },
        {
            title: "Sou um Aluno",
            description: "Como aluno, você pode acessar seus treinos personalizados, acompanhar seu progresso e comunicar-se diretamente com seu personal trainer para garantir que você esteja no caminho certo para alcançar seus objetivos!"
            ,
        },

    ];

    return (
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 20, gap: 20 }}>
            <Text variant="headlineLarge" style={{ textAlign: 'center' }}>Escolha seu perfil para começar</Text>

            <Card mode="outlined">
                <View style={{ padding: 20 }}>
                    <CardProfile title="Sou um Personal Trainer" description="Se você é um personal trainer, esta é a opção certa para você! Aqui, você pode criar treinos personalizados, gerenciar seus alunos e acompanhar o progresso deles com facilidade." />
                </View>
            </Card>
        </View >
    );
};



export default Home;
