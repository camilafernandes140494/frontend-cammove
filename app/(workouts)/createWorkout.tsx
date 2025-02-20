import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import {
    Text, Appbar, Button,
    Card,
    Avatar
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import SelectStudent from '@/components/SelectStudent';
import { useStudent } from '../context/StudentContext';
import FilterInput from '@/components/FilterInput';
import { useUser } from '../UserContext';
import { calculateAge, getGender, getInitials } from '@/common/common';
import { useTheme } from '../ThemeContext';
import FormWorkout from '@/components/FormWorkout';

const CreateWorkout = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = useUser();
    const { student, refetchStudent } = useStudent();
    const [params, setParams] = useState('');
    const { workoutId } = route.params as { workoutId: string | undefined };
    const [newStudent, setNewStudent] = useState(!workoutId);
    const { theme } = useTheme();

    return (
        <FlatList
            style={{ flex: 1, }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            ListHeaderComponent={
                <>
                    <Appbar.Header>
                        <Appbar.BackAction onPress={() => navigation.navigate('Workouts' as never)} />
                        <Appbar.Content title="Cadastrar treino" />
                    </Appbar.Header>
                    {!newStudent && <View style={{ backgroundColor: theme.colors.secondaryContainer, paddingVertical: 16 }}>
                        <Card.Title
                            title={`${student?.name} ${calculateAge(student?.birthDate || '')} anos`}
                            subtitle={`Gênero: ${getGender(student?.gender || '')}`}
                            left={(props) => <Avatar.Text {...props} label={getInitials(student?.name || '')} />}
                        />
                    </View>}
                </>
            }
            data={[{}]}
            keyExtractor={() => 'header'}
            renderItem={() =>
                <>
                    {newStudent ? <View style={{ margin: 20 }}>
                        <Text variant="titleMedium">Escolha um aluno(a)</Text>

                        <FilterInput placeholder="Pesquisar aluno(a)" onChange={setParams} />

                        <SelectStudent
                            teacherId={'TgTfDirVTOQR5ZOxgFgr'}
                            onSelect={(student) => refetchStudent(student.studentId)}
                            filterName={params}
                        />

                        <Button
                            mode="contained"
                            onPress={() => setNewStudent(false)}
                        >
                            Continuar
                        </Button>
                    </View>
                        :
                        <>
                            <FormWorkout />
                        </>
                    }
                </>

            }
        />
    );
};

export default CreateWorkout;
