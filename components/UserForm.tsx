import React, { useState } from 'react';
import { Button, HelperText, Snackbar, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from "yup";
import DatePicker from 'react-native-date-picker';
import { View } from 'react-native';
import { useTheme } from '@/app/ThemeContext';

interface UserFormProps {
    color?: string;
}

const UserForm = ({ color = 'purple' }: UserFormProps) => {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);
    const [gender, setGender] = useState("");
    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Obrigatório"),
        birthDate: Yup.string().required("Obrigatório"),
    });

    const handleLogin = async (values: { name: string; birthDate: string, gender: string }) => {
        try {
            console.log('Dados do formulário', values);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View>
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                action={{
                    label: "",
                    icon: 'close',
                    onPress: () => setVisible(false),
                }}>
                Não foi possivel cadastrar
            </Snackbar>
            <Formik
                initialValues={{ name: "", birthDate: "", gender: "" }}
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
                    setFieldValue,
                }) => (
                    <View style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <TextInput
                            mode="flat"
                            label="Nome"
                            value={values.name}
                            onChangeText={handleChange("name")}
                            onBlur={handleBlur("name")}
                            style={{ backgroundColor: theme.background }}
                            error={touched.name && Boolean(errors.name)}
                        />
                        {touched.name && errors.name && (
                            <HelperText type="error">
                                {errors.name}
                            </HelperText>
                        )}
                        <TextInput
                            mode="flat"
                            label="Data de nascimento"
                            value={values.birthDate}
                            onChangeText={handleChange("birthDate")}
                            onBlur={handleBlur("birthDate")}
                            style={{ backgroundColor: theme.background }}
                            error={touched.birthDate && Boolean(errors.birthDate)}
                        />
                        {touched.birthDate && errors.birthDate && (
                            <HelperText type="error">
                                {errors.birthDate}
                            </HelperText>
                        )}
                        <Button onPress={() => setOpen(true)}>Selecionar Data de Nascimento</Button>

                        {/* Abertura do DatePicker com a nova API */}
                        <DatePicker
                            modal
                            open={open}
                            date={date}
                            onConfirm={(selectedDate) => {
                                setOpen(false);
                                setDate(selectedDate);
                                setFieldValue("birthDate", selectedDate.toLocaleDateString());
                            }}
                            onCancel={() => setOpen(false)}
                        />

                        <Button
                            mode="contained"
                            onPress={handleSubmit as any}
                            style={{
                                borderRadius: 10,
                                marginVertical: 20,
                            }}
                            contentStyle={{ height: 50 }}
                        >
                            Salvar
                        </Button>

                    </View>
                )}
            </Formik>
        </View>
    );
};

export default UserForm;
