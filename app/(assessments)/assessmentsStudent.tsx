import React from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import {
  Appbar, Button, Card,
  Chip,
  IconButton,
  Text
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { getAssessmentsByStudentId } from '@/api/assessments/assessments.api';
import { useTheme } from '@/context/ThemeContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Skeleton from '@/components/Skeleton';
import { useUser } from '@/context/UserContext';

const AssessmentsStudent = ({ navigation }: any) => {
  const { user } = useUser();
  const { theme } = useTheme();

  const { data: assessmentsSummary, isLoading, isFetching, refetch } = useQuery({
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
        refreshing={isLoading || isFetching}
        onRefresh={refetch}
        renderItem={({ item }) => <>
          {
            isLoading ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" /> : <Card style={{ marginHorizontal: 16, borderRadius: 12, elevation: 5, marginTop: 16 }}>
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
        ListEmptyComponent={
          isLoading ? (
            <View>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  style={{
                    width: '90%',
                    height: 60,
                    borderRadius: 4,
                    marginVertical: 8,
                    alignSelf: 'center',
                  }}
                />
              ))}
            </View>
          ) : <View style={{ alignItems: 'center', padding: 40 }}>
            <MaterialCommunityIcons name="playlist-remove" size={48} color="#999" />
            <Text style={{ fontSize: 16, marginVertical: 12, color: '#555' }}>
              Nenhuma avaliação encontrada.
            </Text>
            <Button onPress={() => refetch()} >Tentar novamente</Button>
          </View>
        }
      />
    </View>
  );
};

export default AssessmentsStudent;
