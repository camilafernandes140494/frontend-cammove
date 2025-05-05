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
import StudentCard from '@/components/StudentCard';
import FormAssessments from '@/components/FormAssessments';
import { formatDate } from '@/common/common';
import { useTheme } from '@/context/ThemeContext';
export type RootStackParamList = {
  Workouts: undefined;
  CreateWorkout: { workoutId?: string, studentId?: string };
};

type CreateAssessmentsProps = {
  route: {
    params?: {
      assessmentsId?: string;
      studentId?: string
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

  useEffect(() => { studentId && refetchStudent(studentId) }, [studentId])

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Assessments' as never)} />
        <Appbar.Content title="Cadastrar avaliação" />
      </Appbar.Header>
      {!assessmentsId && <StudentCard>
        {assessmentsId && <Text variant="bodySmall" style={{ marginLeft: 16, color: theme.colors.outline }}>ID: {assessmentsId}</Text>}
        <Text variant="bodySmall" style={{ marginLeft: 16, color: theme.colors.outline }}>{`Criado em: ${formattedDate}`}</Text>
      </StudentCard>}

      <FlatList
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
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
                <FormAssessments assessmentsId={assessmentsId} />
              </>
            }
          </>

        }
      />
    </>
  );
};

export default CreateAssessments;
