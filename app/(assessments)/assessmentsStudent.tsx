import React, { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import {
  Appbar, Card,
  IconButton
} from 'react-native-paper';
import { useStudent } from '../context/StudentContext';
import { useUser } from '../UserContext';
import { useQuery } from '@tanstack/react-query';
import { getAssessmentsByStudentId } from '@/api/assessments/assessments.api';
import { useTheme } from '../ThemeContext';

const AssessmentsStudent = ({ navigation }: any) => {
  const [params, setParams] = useState<{ name: string }>({ name: '' });
  const { refetchStudent } = useStudent();
  const { user } = useUser();
  const [value, setValue] = useState('assessments');
  const { theme } = useTheme();

  const { data: assessmentsSummary, isLoading, refetch } = useQuery({
    queryKey: ['getAssessmentsByStudentId', user?.id],
    queryFn: () => getAssessmentsByStudentId(user?.id || ''),
    enabled: !!user?.id
  });

  console.log(assessmentsSummary)

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header mode='small'>
        <Appbar.Content title="Minhas avaliações" />

      </Appbar.Header>

      <FlatList
        data={value === 'students' ? [] : assessmentsSummary}
        keyExtractor={(item) => `${item}`}
        renderItem={({ item }) => <>
          {
            isLoading && value === 'assessments' ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" color="#6200ea" /> : value === 'assessments' && <Card style={{ marginHorizontal: 16, borderRadius: 12, elevation: 5, marginBottom: 16 }}>
              <Card.Title
                title="Avaliação"
                subtitle={`ID ${item}`}
                right={(props) => <IconButton {...props} icon="chevron-right" onPress={() => { navigation.navigate('CreateAssessments', { assessmentsId: item }) }} />}
                titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                subtitleStyle={{ fontSize: 12, color: 'gray' }}
              />

            </Card>
          }
        </>
        }

      />
    </View>
  );
};

export default AssessmentsStudent;
