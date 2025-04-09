import React from 'react';
import { Appbar, Card, Text } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import { getAssessmentsByStudentIdAndAssessmentsId } from '@/api/assessments/assessments.api';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type RootStackParamList = {
  AssessmentsStudent: undefined;
  CreateAssessments: { assessmentsId?: string };
};

const DetailsAssessmentsStudent = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const route = useRoute();

  const { assessmentsId } = route.params as { assessmentsId: string | undefined };

  const { user } = useUser();

  const { data: assessmentsByStudent, refetch, isLoading } = useQuery({
    queryKey: ['getAssessmentsByStudentIdAndAssessmentsId', assessmentsId, user?.id],
    queryFn: () =>
      getAssessmentsByStudentIdAndAssessmentsId(assessmentsId || '', user?.id || ''),
    enabled: Boolean(assessmentsId && user?.id), // ✅ só ativa quando os dois existem
  });

  console.log(assessmentsByStudent)

  return (<>
    <Appbar.Header>
      <Appbar.BackAction onPress={() => navigation.navigate('AssessmentsStudent')} />
      <Appbar.Content title="Avaliação" />
    </Appbar.Header>
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>

      <Card>

        <Card.Content>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <Ionicons
              name={'calendar'}
              size={18}
              color={theme.colors.primary}
            />
            {assessmentsByStudent?.createdAt ? (
              <Text>
                {format(new Date(assessmentsByStudent.createdAt), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </Text>
            ) : null}
          </View>
          <Text style={{ marginTop: 16 }} >
            {`ID - ${assessmentsId}`}
          </Text>
        </Card.Content>

      </Card>
    </ScrollView></>


  );
};

export default DetailsAssessmentsStudent;
