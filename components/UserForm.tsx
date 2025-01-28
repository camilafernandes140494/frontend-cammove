import React, { useRef, useState } from 'react';
import { Button, Card, Chip, HelperText, List, PaperProvider, RadioButton, SegmentedButtons, Snackbar, Text, TextInput } from 'react-native-paper';
import { Formik, FormikProvider, useFormik } from 'formik';
import * as Yup from "yup";
import { Modal, View } from 'react-native';
import { useTheme } from '@/app/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUser } from '@/app/UserContext';
import { PERMISSION } from '@/api/users/users.types';

interface UserFormProps {
    color?: string;
    onSubmit: (values: { name: string; gender: null; birthDate: string; permission: PERMISSION }) => void;

}

const UserForm = ({ onSubmit }: UserFormProps) => {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const { user } = useUser();

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Obrigatório"),
        birthDate: Yup.string().required("Obrigatório"),
        gender: Yup.string().required("Obrigatório"),
    });

    const formik = useFormik({
        initialValues: {
            name: "", birthDate: "", gender: null, permission: user.permission
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: onSubmit,
        validateOnChange: false,
    });

    const { handleSubmit, setFieldValue, isSubmitting, touched, values, errors, handleChange, handleBlur } = formik;

    const handlePress = () => setExpanded(!expanded);

    const handleGenderSelect = (gender: any) => {
        setFieldValue('gender', gender)
        setExpanded(false);
    };

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false);
        setFieldValue('birthDate', selectedDate)
    };
    console.log(values)

    return (

        <View style={{ padding: 20 }}>
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
            <FormikProvider value={formik}>
                <Card style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>
                    <TextInput
                        mode="flat"
                        label="Qual é o seu nome?"
                        value={values.name}
                        onChangeText={handleChange("name")}
                        onBlur={handleBlur("name")}
                        // style={{ backgroundColor: theme.background, }}
                        error={touched.name && Boolean(errors.name)}
                    />
                    {touched.name && errors.name && (
                        <HelperText type="error">
                            {errors.name}
                        </HelperText>
                    )}

                    <Text variant='titleMedium' style={{ marginTop: 20 }}>Selecione sua data de nascimento</Text>

                    {showDatePicker && (
                        <DateTimePicker
                            value={values.birthDate ? new Date(values.birthDate) : new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}

                    <Button mode='outlined' onPress={() => setShowDatePicker(true)} style={{ marginTop: 20 }}
                    >
                        {values.birthDate ? new Date(values.birthDate).toLocaleDateString("pt-BR") : "Selecionar Data de Nascimento"}
                    </Button>

                    {touched.birthDate && errors.birthDate && (
                        <HelperText type="error">
                            {errors.birthDate}
                        </HelperText>
                    )}
                    <Text variant='titleMedium' style={{ marginTop: 20 }}>Escolha o gênero com o qual se identifica</Text>


                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 20 }}>
                        {
                            [{ label: 'Masculino', value: 'MALE' },
                            { label: 'Feminino', value: 'FEMALE' },
                            { label: 'Outro', value: 'OTHER' },
                            { label: 'Prefiro não me identificar', value: 'PREFER_NOT_TO_SAY' }].map((option, index) => (
                                <Chip
                                    key={index}
                                    selected={values.gender === option.value}
                                    onPress={() => setFieldValue('gender', option.value)}
                                >
                                    {option.label}
                                </Chip>
                            ))}
                    </View>
                    {touched.gender && errors.gender && (
                        <HelperText type="error">
                            {errors.gender}
                        </HelperText>
                    )}


                    <Button
                        mode="contained"
                        onPress={handleSubmit as any}
                        style={{
                            borderRadius: 10,
                            marginVertical: 20,
                            marginTop: 20
                        }}
                        contentStyle={{ height: 50 }}
                    >
                        Salvar
                    </Button>

                </Card>
            </FormikProvider>
        </View >
    );
};

export default UserForm;
