import React, { useState } from 'react';
import { Avatar, Button, Card, Snackbar, Text } from 'react-native-paper';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { useTheme } from '@/app/ThemeContext';
import { useUser } from '@/app/UserContext';
import { useQuery } from '@tanstack/react-query';
import { getRelationship, postRelationship } from '@/api/relationships/relationships.api';
import { getInitials } from '@/common/common';
import { Student } from '@/api/relationships/relationships.types';

interface UserListProps {
    teacherId: string
    navigation: any
    onSelect: (student: Student) => void
}

const SelectStudent = ({ teacherId, navigation, onSelect }: UserListProps) => {
    const { theme } = useTheme();
    const { user } = useUser();
    const [isLoadingButton, setIsLoadingButton] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [errorVisible, setErrorVisible] = useState(false);

    const { data: students } = useQuery({
        queryKey: ['getRelationship', teacherId],
        queryFn: () => getRelationship(teacherId),
        enabled: !!teacherId
    });

    const handleSave = async () => {
        if (!selectedStudent) {
            setErrorVisible(true);
            return;
        }
        setIsLoadingButton(true);
        try {
            await postRelationship(selectedStudent, user?.id!);
            navigation.navigate('Home' as never);
        } catch (error) {
            console.error("Erro ao selecionar estudante", error);
            setErrorVisible(true);
        } finally {
            setIsLoadingButton(false);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            <Snackbar
                visible={errorVisible}
                onDismiss={() => setErrorVisible(false)}
                action={{ label: '', icon: 'close', onPress: () => setErrorVisible(false) }}
            >
                <Text>Ocorreu um erro ao selecionar o estudante. Tente novamente.</Text>
            </Snackbar>

            <Text variant='titleMedium' style={{ marginBottom: 20 }}>
                Selecione um estudante
            </Text>

            <FlatList
                data={students?.students}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {
                        onSelect(item);
                        setSelectedStudent(item.studentId);
                    }}>
                        <Card
                            mode='outlined'
                            style={{
                                marginTop: 15,
                                margin: 10,
                                backgroundColor: selectedStudent === item.studentId ? theme.colors.primaryContainer : 'white',
                                borderRadius: 16,
                                borderColor: selectedStudent === item.studentId ? theme.colors.primary : undefined,
                            }}
                        >
                            <Card.Title
                                title={item.studentName}
                                left={(props) => <Avatar.Text {...props} label={getInitials(item.studentName)} />}

                            />
                        </Card>
                    </TouchableOpacity>
                )}
                keyExtractor={item => `${item.studentId}`}
            />

           
        </View>
    );
};

export default SelectStudent;
