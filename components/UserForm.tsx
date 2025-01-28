import React, { useRef, useState } from 'react';
import { Button, HelperText, List, PaperProvider, RadioButton, SegmentedButtons, Snackbar, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from "yup";
import { Modal, View } from 'react-native';
import { useTheme } from '@/app/ThemeContext';
import DateTimePicker from '@react-native-community/datetimepicker'; // Importe o DateTimePicker

interface UserFormProps {
    color?: string;
}

const UserForm = ({ color = 'purple' }: UserFormProps) => {
    const { theme } = useTheme();
    const [visible, setVisible] = useState(false);

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
    const [expanded, setExpanded] = useState(false);
    const [selectedGender, setSelectedGender] = useState('');

    const handlePress = () => setExpanded(!expanded);

    const handleGenderSelect = (gender: any) => {
        setSelectedGender(gender);
        setExpanded(false);
    };

    const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || dateOfBirth;
        setShowDatePicker(false);
        setDateOfBirth(currentDate);
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
                        {showDatePicker && (
                            <DateTimePicker
                                value={dateOfBirth || new Date()}
                                mode="date"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}
                        <List.Accordion
                            title={selectedGender || "Escolha um gênero"}
                            expanded={expanded}
                            onPress={handlePress}

                        >
                            <List.Item title="Masculino" onPress={() => handleGenderSelect('Masculino')} />
                            <List.Item title="Feminino" onPress={() => handleGenderSelect('Feminino')} />
                            <List.Item title="Outro" onPress={() => handleGenderSelect('Outro')} />
                            <List.Item title="Prefiro não me identificar" onPress={() => handleGenderSelect('Prefiro não me identificar')} />
                        </List.Accordion>

                        <Button onPress={() => setShowDatePicker(true)}>
                            {dateOfBirth ? dateOfBirth.toLocaleDateString() : "Selecionar Data de Nascimento"}
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
                            Salvar
                        </Button>

                    </View>
                )}
            </Formik>
        </View>
    );
};

export default UserForm;
