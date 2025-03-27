import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import {
  Text, Appbar, Button
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import SelectStudent from '@/components/SelectStudent';
import { useStudent } from '../context/StudentContext';
import FilterInput from '@/components/FilterInput';
import { useUser } from '../UserContext';
import StudentCard from '@/components/StudentCard';
import { useTheme } from '../ThemeContext';
import FormAssessments from '@/components/FormAssessments';
import { formatDate } from '@/common/common';

const CreateAssessments = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUser();
  const { refetchStudent } = useStudent();
  const [params, setParams] = useState('');
  const { assessmentsId } = route.params as { assessmentsId: string | undefined };
  const [newStudent, setNewStudent] = useState(!assessmentsId);
  const { theme } = useTheme();
  const today = new Date();
  const formattedDate = formatDate(today);
  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Assessments' as never)} />
        <Appbar.Content title="Cadastrar avaliação" />
      </Appbar.Header>
      {!newStudent && <StudentCard>
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
