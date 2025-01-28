import React, { useState } from "react";
import { View, } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { TextInput, Button, HelperText, Text, Snackbar } from "react-native-paper";
import { postLogin } from "@/api/auth/auth.api";
import { useUser } from "../UserContext";
import { useTheme } from "../ThemeContext";

const Login = () => {
    const router = useRouter();
    const { setUser } = useUser();
    const { theme } = useTheme();

    const [showPassword, setShowPassword] = useState(false);
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
            router.push('/onboarding')
        } catch (error) {
            setVisible(true);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    flex: 1,
                    backgroundColor: theme.colors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingBottom: 5,
                }}
            >
                <Text variant="displayMedium"
                    style={{ color: theme.colors.background }}
                >
                    CAMMOVE
                </Text>
            </View>

            <View
                style={{
                    flex: 2,
                    marginTop: -50,
                    backgroundColor: theme.colors.background,
                    borderTopEndRadius: 40,
                    borderTopStartRadius: 40,
                    padding: 20,
                    paddingTop: 50,
                }}
            >
                <Snackbar
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    action={{
                        label: "",
                        icon: 'close',
                        onPress: () => setVisible(false),
                    }}>
                    Erro ao logar
                </Snackbar>
                <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        errors,
                        touched,
                    }) => (
                        <View style={{
                            display: 'flex', flexDirection: 'column', gap: 5
                        }}>
                            < TextInput
                                mode="flat"
                                label="E-mail"
                                value={values.email}
                                onChangeText={handleChange("email")}
                                onBlur={handleBlur("email")}
                                style={{
                                    backgroundColor: theme.background,
                                }}
                                error={touched.email && Boolean(errors.email)}
                            />
                            {touched.email && errors.email && (
                                <HelperText type="error" >
                                    {errors.email}
                                </HelperText>
                            )}
                            <TextInput
                                mode="flat"
                                label="Senha"
                                value={values.password}
                                onChangeText={handleChange("password")}
                                onBlur={handleBlur("password")}
                                secureTextEntry={!showPassword}
                                right={
                                    <TextInput.Icon
                                        icon={showPassword ? "eye-off" : "eye"}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                }
                                style={{
                                    backgroundColor: theme.background,
                                }}
                                error={touched.password && Boolean(errors.password)}
                            />
                            {touched.password && errors.password && (
                                <HelperText type="error" >
                                    {errors.password}
                                </HelperText>
                            )}

                            <Button style={{
                                alignSelf: "flex-end",
                                marginBottom: 20,
                            }} mode="text" onPress={() => console.log('Pressed')}>
                                Esqueceu a senha?
                            </Button>
                            <Button
                                mode="contained"
                                onPress={handleSubmit as any}
                                style={{
                                    borderRadius: 10,
                                    marginVertical: 20,
                                }}
                                contentStyle={{ height: 50 }}
                            >
                                ENTRAR
                            </Button>


                            <Text style={{ textAlign: "center", }}>
                                Não tem uma conta?{" "}
                                <Text
                                    style={{ fontWeight: "bold" }}
                                    onPress={() => router.push("/createUser")}
                                >
                                    Cadastre-se
                                </Text>
                            </Text>
                        </View>
                    )}
                </Formik>

            </View >
        </View >
    );
};

export default Login;
