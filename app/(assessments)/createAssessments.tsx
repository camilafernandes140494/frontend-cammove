import { formatDate } from '@/common/common';
import FilterInput from '@/components/FilterInput';
import FormAssessments from '@/components/FormAssessments';
import SelectStudent from '@/components/SelectStudent';
import StudentCard from '@/components/StudentCard';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import { useStudent } from '../../context/StudentContext';
export type RootStackParamList = {
  Workouts: undefined;
  CreateWorkout: { workoutId?: string; studentId?: string };
};

type CreateAssessmentsProps = {
  route: {
    params?: {
      assessmentsId?: string;
      studentId?: string;
    };
  };
};

const CreateAssessments = ({ route }: CreateAssessmentsProps) => {
  const navigation = useNavigation();
  const { user } = useUser();
  const { refetchStudent } = useStudent();
  const [params, setParams] = useState('');
  const { assessmentsId, studentId } = route.params || {};
  const [newStudent, setNewStudent] = useState(!studentId);
  const { theme } = useTheme();
  const today = new Date();
  const formattedDate = formatDate(today);

  useEffect(() => {
    studentId && refetchStudent(studentId);
  }, [studentId]);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() => navigation.navigate('Assessments' as never)}
        />
        <Appbar.Content title="Cadastrar avaliação" />
      </Appbar.Header>
      {!assessmentsId && (
        <StudentCard>
          {assessmentsId && (
            <Text
              style={{ marginLeft: 16, color: theme.colors.outline }}
              variant="bodySmall"
            >
              ID: {assessmentsId}
            </Text>
          )}
          <Text
            style={{ marginLeft: 16, color: theme.colors.outline }}
            variant="bodySmall"
          >{`Criado em: ${formattedDate}`}</Text>
        </StudentCard>
      )}

      <FlatList
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        data={[{}]}
        keyExtractor={() => 'header'}
        renderItem={() => (
          <>
            {newStudent ? (
              <View style={{ margin: 20 }}>
                <Text variant="titleMedium">Escolha um aluno(a)</Text>
                <FilterInput
                  onChange={setParams}
                  placeholder="Pesquisar aluno(a)"
                />
                <SelectStudent
                  filterName={params}
                  onSelect={(student) => refetchStudent(student.studentId)}
                  teacherId={user?.id || ''}
                />
                <Button mode="contained" onPress={() => setNewStudent(false)}>
                  Continuar
                </Button>
              </View>
            ) : (
              <>
                <FormAssessments assessmentsId={assessmentsId} />
              </>
            )}
          </>
        )}
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      />
    </>
  );
};

export default CreateAssessments;
