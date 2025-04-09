import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import {
  Appbar, Card,
  Chip,
  IconButton
} from 'react-native-paper';
import { useUser } from '../UserContext';
import { useQuery } from '@tanstack/react-query';
import { getAssessmentsByStudentId } from '@/api/assessments/assessments.api';
import { useTheme } from '../ThemeContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';

const AssessmentsStudent = ({ navigation }: any) => {
  const { user } = useUser();
  const { theme } = useTheme();

  const { data: assessmentsSummary, isLoading, refetch } = useQuery({
    queryKey: ['getAssessmentsByStudentId', user?.id],
    queryFn: () => getAssessmentsByStudentId(user?.id || ''),
    enabled: !!user?.id
  });


  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, }}>
      <Appbar.Header mode='small'>
        <Appbar.Content title="Minhas avaliações" />
      </Appbar.Header>

      <FlatList
        data={assessmentsSummary}
        keyExtractor={(item) => `${item.id}`}
        renderItem={({ item }) => <>
          {
            isLoading ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" color="#6200ea" /> : <Card style={{ marginHorizontal: 16, borderRadius: 12, elevation: 5, marginTop: 16 }}>
              <Card.Title
                title="Avaliação física"
                subtitle={`ID ${item.id}`}
                right={(props) => <IconButton {...props} icon="chevron-right" onPress={() => { navigation.navigate('DetailsAssessmentsStudent', { assessmentsId: item.id }) }} />}
                titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                subtitleStyle={{ fontSize: 12, color: 'gray' }}
              />
              <Card.Content>
                <Chip disabled icon={() => (
                  <Ionicons
                    name={'calendar'}
                    size={18}
                    color={theme.colors.primary}
                    style={{ marginRight: 4 }}
                  />

                )}
                  style={{
                    backgroundColor: theme.colors.primaryContainer,
                    alignSelf: 'flex-start',
                  }}
                  textStyle={{
                    color: theme.colors.primary,
                  }}>{format(new Date(item.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</Chip>

              </Card.Content>
            </Card>
          }
        </>
        }

      />
    </View>
  );
};

export default AssessmentsStudent;
