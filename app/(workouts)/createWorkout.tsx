import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import {
    Text, Appbar, Button
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import SelectStudent from '@/components/SelectStudent';
import { useStudent } from '../../context/StudentContext';
import FilterInput from '@/components/FilterInput';
import { useUser } from '@/context/UserContext';
import FormWorkout from '@/components/FormWorkout';
import StudentCard from '@/components/StudentCard';
import { useTheme } from '@/context/ThemeContext';
import Skeleton from '@/components/Skeleton';
import { useQuery } from '@tanstack/react-query';
import { getReviewById } from '@/api/reviews/reviews.api';
import CustomModal from '@/components/CustomModal';
import CardReview from '@/components/CardReview';

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
    const { refetchStudent, isLoading } = useStudent();
    const [params, setParams] = useState('');
    const { workoutId, studentId } = route.params || {};
    const [newStudent, setNewStudent] = useState(!studentId);
    const { theme } = useTheme();

    useEffect(() => { studentId && refetchStudent(studentId) }, [studentId])

    const { data: review } = useQuery({
        queryKey: ['getReviewById', user?.id, workoutId],
        queryFn: () => getReviewById(user?.id || '', workoutId || '', studentId || ''),
        enabled: !!user?.id,
    });

    return (
        <>
            <Appbar.Header mode='small'>
                <Appbar.BackAction onPress={() => navigation.navigate('Workouts' as never)} />
                <Appbar.Content title="Cadastrar treino" />

                {review?.review && <CustomModal
                    onPress={() => { }}
                    title="Avaliação do treino"
                    showPrimaryButton={false}
                    cancelButtonLabel={'Fechar'}
                    trigger={
                        <Button
                            mode='elevated'
                            icon={'star'}
                        >
                            Ver avaliação
                        </Button>
                    }
                >
                    <CardReview reviewData={review!} navigation={navigation} showButtonWorkout={false} />
                </CustomModal>
                }

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
                                {isLoading ?
                                    <View
                                        style={{ alignItems: "center", gap: 16, marginTop: 16 }}>
                                        <Skeleton style={{ width: '90%', height: 50, borderRadius: 20 }} />
                                        <Skeleton style={{ width: '90%', height: 50, borderRadius: 20 }} />
                                        <Skeleton style={{ width: '90%', height: 150, borderRadius: 20 }} />
                                        <Skeleton style={{ width: '90%', height: 50, borderRadius: 20 }} />
                                    </View>
                                    : <FormWorkout workoutId={workoutId} />}

                            </>
                        }


                    </>

                }

            />

        </>

    );
};

export default CreateWorkout;
