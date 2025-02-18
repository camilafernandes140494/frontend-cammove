import React, { useState } from 'react';
import { Button, List, Snackbar, Text } from 'react-native-paper';
import { View } from 'react-native';
import { useTheme } from '@/app/ThemeContext';
import { useUser } from '@/app/UserContext';
import { Users } from '@/api/users/users.types';
import { useQuery } from '@tanstack/react-query';
import { getUsers } from '@/api/users/users.api';
import { postRelationship } from '@/api/relationships/relationships.api';

interface UserListProps {
    params?: Record<string, string>,
    navigation: any
}

const UserList = ({ params, navigation }: UserListProps) => {
    const { theme } = useTheme();
    const { user } = useUser();
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    const [expanded, setExpanded] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Users | null>(null);
    const [errorVisible, setErrorVisible] = useState(false);

    const { data: users } = useQuery({
        queryKey: ['getUsers'],
        queryFn: () => getUsers(params),
        enabled: true
    });

    const toggleAccordion = () => setExpanded(!expanded);

    const handleTeacherSelect = (teacher: Users) => {
        setExpanded(false);
        setSelectedTeacher(teacher);
    };

    const handleSave = async () => {
        setIsLoadingButton(true)
        if (!selectedTeacher) {
            setErrorVisible(true);
            return;
        }
        try {
            await postRelationship(selectedTeacher?.id!, user?.id!);
            navigation.navigate('Home' as never);
        } catch (error) {
            console.error("Erro ao escolher professor", error);
            setErrorVisible(true);
        } finally {
            setIsLoadingButton(false)
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Snackbar
                visible={errorVisible}
                onDismiss={() => setErrorVisible(false)}
                action={{ label: '', icon: 'close', onPress: () => setErrorVisible(false) }}
            >
                <Text>Ocorreu um erro ao selecionar o professor. Tente novamente.</Text>
            </Snackbar>

            <Text variant='titleMedium' style={{ marginBottom: 20 }}>
                Selecione o professor responsável
            </Text>

            <List.Accordion
                title={selectedTeacher?.name || "Escolha um professor"}
                expanded={expanded}
                onPress={toggleAccordion}
            >
                {users?.map((user) => (
                    <List.Item
                        key={user.id}
                        style={{ backgroundColor: theme.colors.onPrimary }}
                        title={user.name}
                        onPress={() => handleTeacherSelect(user)}
                    />
                ))}
            </List.Accordion>

            <Button
                mode="contained"
                onPress={handleSave}
                loading={isLoadingButton}
                disabled={isLoadingButton}
                style={{ borderRadius: 10, marginVertical: 20 }}
                contentStyle={{ height: 50 }}
            >
                Salvar
            </Button>
        </View>
    );
};

export default UserList;
