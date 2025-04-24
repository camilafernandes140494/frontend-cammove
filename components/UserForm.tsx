import React, { useState } from 'react';
import { Button, Card, Snackbar, Text, TextInput } from 'react-native-paper';
import { View } from 'react-native';
import { useUser } from '@/app/UserContext';
import { GENDER, PostUser } from '@/api/users/users.types';
import UserList from './UserList';
import { useNavigation } from '@react-navigation/native';
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { FormField } from './FormField';

interface UserFormProps {
    color?: string;
    onSubmit: (values: Partial<PostUser>) => void;

}

const UserForm = ({ onSubmit }: UserFormProps) => {
    const [visible, setVisible] = useState(false);
    const [showListTeacher, setShowListTeacher] = useState(false);
    const navigation = useNavigation();

    const { user, setUser } = useUser();

    const schema = z.object({
        name: z.string().nonempty("Obrigatório"),
        birthDate: z.string().nonempty("Obrigatório"),
        gender: z.string().nonempty("Obrigatório"),
        phone: z.string().nonempty("Obrigatório"),
    });

    const { control, handleSubmit, } = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: '',
            birthDate: '',
            gender: 'PREFER_NOT_TO_SAY',
            phone: ''
        },
    });

    const handleFormSubmit = (values: z.infer<typeof schema>) => {
        onSubmit({ ...values, gender: values.gender as GENDER });
        setUser(values);
        setShowListTeacher(true);
    };


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
                <Text>Não foi possível cadastrar</Text>
            </Snackbar>

            {!showListTeacher &&
                <Card style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 20 }}>

                    <FormField
                        control={control}
                        mode="flat"
                        left={<TextInput.Icon icon="account-outline" />}
                        name="name"
                        label="Qual é o seu nome?"
                        type="text"
                    />

                    <FormField
                        control={control}
                        mode="flat"
                        left={<TextInput.Icon icon="calendar" />}
                        name="birthDate"
                        type='birthDate'
                        label="Data de nascimento"
                        maxLength={10}
                        keyboardType="numeric"
                    />

                    <Text variant='titleMedium' >Escolha o gênero com o qual se identifica</Text>
                    <FormField
                        control={control}
                        name="gender"
                        label="Gênero"
                        type="chip"
                        options={[
                            { label: 'Masculino', value: 'MALE' },
                            { label: 'Feminino', value: 'FEMALE' },
                            { label: 'Outro', value: 'OTHER' },
                            { label: 'Prefiro não me identificar', value: 'PREFER_NOT_TO_SAY' },
                        ]}
                    />
                    <FormField
                        control={control}
                        mode="flat"
                        left={<TextInput.Icon icon="phone" />}
                        name="phone"
                        label="Qual é o seu celular?"
                        type="text"
                    />
                    <Button mode="contained" onPress={handleSubmit(handleFormSubmit)}>
                        Salvar
                    </Button>

                </Card>
            }

            {showListTeacher && user?.permission === 'STUDENT' &&
                <UserList params={{ permission: 'TEACHER' }} navigation={navigation} />}
        </View >
    );
};

export default UserForm;
