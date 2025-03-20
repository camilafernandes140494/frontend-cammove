import React, { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import {
  Button, Appbar,
  SegmentedButtons,
  Text,
  Card,
  IconButton,
  Chip
} from 'react-native-paper';
import FilterInput from '@/components/FilterInput';
import { useStudent } from '../context/StudentContext';
import { useUser } from '../UserContext';
import { useQuery } from '@tanstack/react-query';
import { formatDate, getNextMonth } from '@/common/common';
import { getAssessmentsSummary } from '@/api/assessments/assessments.api';

const Assessments = ({ navigation }: any) => {
  const [params, setParams] = useState<{ name: string }>({ name: '' });
  const { refetchStudent } = useStudent();
  const { user } = useUser();
  const [value, setValue] = useState('workouts');


  const { data: assessmentsSummary, isLoading } = useQuery({
    queryKey: ['getAssessmentsSummary', params],
    queryFn: () => getAssessmentsSummary(user?.id!, params),
    enabled: !!user?.id,
  });

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header mode='small'>
        <Appbar.Content title="Avaliação" />
        <Button icon="plus" mode="contained" onPress={() => navigation.navigate('CreateAssessments', { workoutId: undefined })}>
          Nova Avaliação
        </Button>
      </Appbar.Header>

      <FlatList
        data={value === 'students' ? [] : assessmentsSummary}
        keyExtractor={(item) => `${item.studentName}-${item.id}`}
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
        renderItem={({ item }) => <>
          {
            isLoading && value === 'assessments' ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" color="#6200ea" /> : value === 'assessments' && <Card style={{ marginHorizontal: 16, borderRadius: 12, elevation: 5, marginBottom: 16 }}>
              <Card.Title
                title={item.studentName}
                subtitle={`Criado em: ${formatDate(item.createdAt)}`}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="chevron-right"
                    size={24}
                    onPress={() => {
                      refetchStudent(item.studentId);
                      navigation.navigate('CreateAssessments', { workoutId: item.workoutId });
                    }}
                  />
                )}
                titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                subtitleStyle={{ fontSize: 12, color: 'gray' }}
              />
              <Card.Content style={{ paddingVertical: 16 }}>
                <Text variant="bodyMedium" style={{ fontSize: 14, marginBottom: 8 }}>
                  Próxima atualização
                </Text>
                <Text variant="bodySmall" style={{ fontSize: 16, color: 'blue', fontWeight: '500', marginBottom: 20 }}>
                  {getNextMonth(item.createdAt)}
                </Text>
                <Chip>{item.workoutType}</Chip>
              </Card.Content>
            </Card>
          }
        </>
        }

      />
    </View>
  );
};

export default Assessments;
