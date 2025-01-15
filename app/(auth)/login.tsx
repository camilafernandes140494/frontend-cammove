import React from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslationContext } from "../TranslationContext";
import Button from "@/components/Button";
import { useTheme } from "../ThemeContext";
import FormikTextInput from "@/components/FormikTextInput";

const Login = () => {
    const { theme, toggleTheme } = useTheme();

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email("Por favor, insira um email válido")
            .required("O email é obrigatório"),
        password: Yup.string()
            .min(6, "A senha deve ter pelo menos 6 caracteres")
            .required("A senha é obrigatória"),
    });

    const handleLogin = (values: { email: string; password: string }) => {
        Alert.alert("Login", `Email: ${values.email}\nSenha: ${values.password}`);
    };

    const { t } = useTranslationContext();

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
            <View
                style={{
                    position: "absolute",
                    width: 300,
                    height: 300,
                    backgroundColor: theme.secondary,
                    borderRadius: 150, // Circular
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
                    borderRadius: 100, // Circular
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
                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20, color: theme.textPrimary }}>
                    {t("welcome")}
                </Text>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({
                        handleSubmit
                    }) => (
                        <View style={{ width: "100%" }}>
                            <FormikTextInput name="email" placeholder={"E-mail"} />
                            <FormikTextInput name="password" placeholder={"Senha"} />

                            <Button
                                variant="primary"
                                title={t("enter")}
                                onPress={handleSubmit}
                            />
                        </View>
                    )}
                </Formik>
            </View>
        </View>
    );
};

export default Login;
