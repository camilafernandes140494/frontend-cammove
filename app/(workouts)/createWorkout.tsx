import React, { useState } from 'react';
import { FlatList } from 'react-native';
import {
    Text,
    Snackbar, Appbar,
    ActivityIndicator,
    Button
} from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import SelectStudent from '@/components/SelectStudent';
import { Student } from '@/api/relationships/relationships.types';

const CreateWorkout = (navigation: any) => {
    const [visible, setVisible] = useState(false);
    const route = useRoute();
    const { workoutId } = route.params as { workoutId: string | undefined };
    const [student, setStudent] = useState<Student>();
    const [showButtonContinue, setShowButtonContinue] = useState(true);

    console.log(workoutId)
    // const { data: exerciseById, isLoading } = useQuery({
    //     queryKey: ['getExerciseById', exerciseId],
    //     queryFn: () => getExerciseById(exerciseId || ''),
    //     enabled: !!exerciseId
    // });

    return (
        <FlatList
            style={{ flex: 1, }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            ListHeaderComponent={
                <>
                    <Appbar.Header>
                        <Appbar.BackAction onPress={() => navigation.goBack()} />
                        <Appbar.Content title="Cadastrar treino" />
                    </Appbar.Header>
                    <Snackbar
                        visible={visible}
                        onDismiss={() => setVisible(false)}
                        action={{
                            label: '',
                            icon: 'close',
                            onPress: () => setVisible(false),
                        }}
                    >
                        <Text>Erro ao cadastrar</Text>
                    </Snackbar>
                </>
            }
            data={[{}]}
            keyExtractor={() => 'header'}  // Usar id ou um identificador único
            renderItem={() => <>
                {showButtonContinue ? <>
                    <SelectStudent
                        teacherId={'TgTfDirVTOQR5ZOxgFgr'}
                        navigation={navigation}
                        onSelect={(student) => setStudent(student)} />
                    <Button
                        mode="contained"
                        onPress={() => setShowButtonContinue(false)}
                        style={{ borderRadius: 10, marginVertical: 20 }}
                        contentStyle={{ height: 50 }}
                    >
                        Continuar
                    </Button>
                </> :
                    <>
                        <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" color="#6200ea" />
                    </>}
            </>
            }
        />
    );
};

export default CreateWorkout;
