import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import {
  Button, Appbar
} from 'react-native-paper';
import FilterInput from '@/components/FilterInput';
import { useStudent } from '../context/StudentContext';
import SelectStudent from '@/components/SelectStudent';
import { useUser } from '../UserContext';

const Assessments = ({ navigation }: any) => {
  const [params, setParams] = useState<{ name: string }>({ name: '' });
  const { refetchStudent } = useStudent();
  const { user } = useUser();


  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Avaliação" />
        <Button icon="plus" mode="contained" onPress={() => navigation.navigate('CreateAssessments', { workoutId: undefined })}>
          Nova Avaliação
        </Button>
      </Appbar.Header>

      <FlatList
        data={['student']}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 16 }}>
            <FilterInput placeholder="Pesquisar aluno(a)" onChange={(value) => setParams({ name: value })} />
          </View>
        }
        renderItem={() => <>
          <View style={{ paddingHorizontal: 16 }}>
            <SelectStudent
              teacherId={user?.id!}
              onSelect={(student) => { refetchStudent(student.studentId) }}
              filterName={params?.name}
            />
          </View>
        </>
        }

      />
    </View>
  );
};

export default Assessments;
