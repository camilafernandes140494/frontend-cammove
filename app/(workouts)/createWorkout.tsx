import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import {
    Text, Appbar, Button
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SelectStudent from '@/components/SelectStudent';
import { useStudent } from '../context/StudentContext';
import FilterInput from '@/components/FilterInput';
import { useUser } from '../UserContext';
import FormWorkout from '@/components/FormWorkout';
import StudentCard from '@/components/StudentCard';
import { useTheme } from '../ThemeContext';

type CreateWorkoutProps = {
    route: {
        params?: {
            workoutId?: string;
            studentId?: string
        };
    };
};


const CreateWorkout = ({ route }: CreateWorkoutProps) => {
    const navigation = useNavigation();
    const { user } = useUser();
    const { refetchStudent } = useStudent();
    const [params, setParams] = useState('');
    const { workoutId, studentId } = route.params || {};
    const [newStudent, setNewStudent] = useState(!studentId);
    const { theme } = useTheme();

    return (
        <>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.navigate('Workouts' as never)} />
                <Appbar.Content title="Cadastrar treino" />
            </Appbar.Header>
            {!workoutId && <StudentCard>
                {workoutId && <Text variant="bodySmall" style={{ marginLeft: 16, color: theme.colors.outline }}>ID: {workoutId}</Text>}
            </StudentCard>}
            <FlatList
                style={{ flex: 1, backgroundColor: theme.colors.background }}

                data={[{}]}
                keyExtractor={() => 'header'}
                renderItem={() =>
                    <>
                        {newStudent ? <View style={{ margin: 20 }}>
                            <Text variant="titleMedium">Escolha um aluno(a)</Text>
                            <FilterInput placeholder="Pesquisar aluno(a)" onChange={setParams} />
                            <SelectStudent
                                teacherId={user?.id || ''}
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
                                <FormWorkout workoutId={workoutId} />
                            </>
                        }
                    </>

                }
            />
        </>

    );
};

export default CreateWorkout;
