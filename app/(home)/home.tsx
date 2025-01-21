import React, { useState } from "react";
import { SafeAreaView, View, } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "expo-router";
import { TextInput, Button, HelperText, Text, Snackbar, SegmentedButtons } from "react-native-paper";
import { postLogin } from "@/api/auth/auth.api";
import { useUser } from "../UserContext";
import { useTheme } from "../ThemeContext";

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

    return (
        <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            <SegmentedButtons
                value={value}
                onValueChange={setValue}
                buttons={[
                    {
                        value: 'walk',
                        label: 'Walking',
                    },
                    {
                        value: 'permission',
                        label: 'Permissão',
                    },
                ]}
            />

            <View>
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
                            {touched.password && errors.password && (
                                <HelperText type="error" >
                                    {errors.password}
                                </HelperText>
                            )}


                            <Button
                                mode="contained"
                                onPress={handleSubmit as any}
                            >
                                Salvar
                            </Button>



                        </View>
                    )}
                </Formik>

            </View >
        </View >
    );
};



export default Home;
