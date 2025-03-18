import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import {
  Button, Appbar,
  SegmentedButtons
} from 'react-native-paper';
import FilterInput from '@/components/FilterInput';
import { useStudent } from '../context/StudentContext';
import SelectStudent from '@/components/SelectStudent';
import { useUser } from '../UserContext';

const Assessments = ({ navigation }: any) => {
  const [params, setParams] = useState<{ name: string }>({ name: '' });
  const { refetchStudent } = useStudent();
  const { user } = useUser();
  const [value, setValue] = useState('workouts');


  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode='small'>
        <Appbar.Content title="Avaliação" />
        <Button icon="plus" mode="contained" onPress={() => navigation.navigate('CreateAssessments', { workoutId: undefined })}>
          Nova Avaliação
        </Button>
      </Appbar.Header>

      <FlatList
        data={['student']}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View style={{ padding: 16 }}>
            <SegmentedButtons
              value={value}
              onValueChange={setValue}
              buttons={[
                { value: 'assessments', label: 'Avaliações', icon: 'chart-bar' },
                { value: 'students', label: 'Alunos', icon: 'account-group' },
              ]}
            />
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
