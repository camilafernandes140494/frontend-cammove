import React, { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import {
  Button, Appbar,
  SegmentedButtons,
  Text,
  Card,
  IconButton
} from 'react-native-paper';
import FilterInput from '@/components/FilterInput';
import { useStudent } from '../context/StudentContext';
import { useUser } from '../UserContext';
import { useQuery } from '@tanstack/react-query';
import { formatDate, getNextMonth } from '@/common/common';
import { getAssessmentsSummary } from '@/api/assessments/assessments.api';
import SelectStudent from '@/components/SelectStudent';
import { useTheme } from '../ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Assessments = ({ navigation }: any) => {
  const [params, setParams] = useState<{ name: string }>({ name: '' });
  const { refetchStudent } = useStudent();
  const { user } = useUser();
  const [value, setValue] = useState('assessments');
  const { theme } = useTheme();

  const { data: assessmentsSummary, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getAssessmentsSummary', params],
    queryFn: () => getAssessmentsSummary(user?.id!, params),
    enabled: !!user?.id,
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
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

            {value === 'students' && (
              <SelectStudent
                teacherId={user?.id!}
                onSelect={(student) => { refetchStudent(student.studentId), navigation.navigate('DetailsAssessments' as never) }}
                filterName={params?.name}
              />
            )}
          </View>
        }
        ListEmptyComponent={
          value === 'assessments' ? <View style={{ alignItems: 'center', padding: 40 }}>
            <MaterialCommunityIcons name="playlist-remove" size={48} color="#999" />
            <Text style={{ fontSize: 16, marginVertical: 12, color: '#555' }}>
              Nenhum item encontrado.
            </Text>
            <Button onPress={() => refetch()} >Tentar novamente</Button>
          </View> : <></>
        }
        renderItem={({ item }) => <>
          {
            isLoading && isFetching && value === 'assessments' ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" /> : value === 'assessments' && <Card style={{ marginHorizontal: 16, borderRadius: 12, elevation: 5, marginBottom: 16 }}>
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
                      navigation.navigate('CreateAssessments', { assessmentsId: item.workoutId });
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
                <Text variant="bodySmall" style={{ fontSize: 16, color: theme.colors.primary, fontWeight: '500', marginBottom: 20 }}>
                  {getNextMonth(item.createdAt)}
                </Text>
              </Card.Content>
            </Card>
          }

        </>
        }

      />
    </View >
  );
};

export default Assessments;
