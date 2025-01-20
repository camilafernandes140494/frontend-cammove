import React from "react";
import { View, Text, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslationContext } from "../TranslationContext";
import Button from "@/components/Button";
import { useTheme } from "../ThemeContext";
import FormikTextInput from "@/components/FormikTextInput";
import { postLogin } from "@/api/auth/auth.api";
import { useRouter } from "expo-router";
import { useUser } from "../UserContext";

const Login = () => {
    const { theme } = useTheme();
    const { t } = useTranslationContext();
    const router = useRouter();
    const { setUser } = useUser();

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
            console.error("Erro ao logar:", error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <View
                style={{
                    position: "absolute",
                    width: 300,
                    height: 300,
                    backgroundColor: theme.secondary,
                    borderRadius: 150,
                    top: -80,
                    left: -80,
                }}
            />
            <View
                style={{
                    position: "absolute",
                    width: 200,
                    height: 200,
                    backgroundColor: theme.secondary,
                    borderRadius: 100,
                    bottom: -30,
                    right: -30,
                }}
            />
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                }}
            >
                <Text
                    style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 20,
                        color: theme.textPrimary,
                    }}
                >
                    {t("welcome")}
                </Text>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({ handleSubmit }) => (
                        <View style={{ width: "100%" }}>

                            <FormikTextInput name="email" placeholder={"E-mail"} />
                            <FormikTextInput
                                name="password"
                                placeholder={"Senha"}
                                secureTextEntry
                            />
                            <Button
                                variant="primary"
                                title={t("enter")}
                                onPress={handleSubmit as any}
                            />
                        </View>
                    )}
                </Formik>
                <Button
                    title="Não tem uma conta? Cadastre-se"
                    onPress={() => router.push('/createUser')}
                />
            </View>
        </View>
    );
};

export default Login;
