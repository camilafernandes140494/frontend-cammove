import React, { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import {
  Button,
  Text,
  Appbar,
  Card,
  Chip
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import { getSchedule } from '@/api/schedules/schedules.api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from '@/common/common';
import { useMyTeacher } from '../context/MyTeacherContext';

const SchedulesStudent = ({ navigation }: any) => {
  const [params, setParams] = useState<{ name: string }>();
  const { user } = useUser();
  const { theme } = useTheme();
  const { teacher } = useMyTeacher()

  const { data: schedule, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getSchedule', params],
    queryFn: () => getSchedule(teacher?.teacherId!, params),
    enabled: !!teacher?.teacherId,
  });


  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header mode='small'>
        <Appbar.Content title="Agenda" />
      </Appbar.Header>

      <FlatList
        data={schedule}
        keyExtractor={(item) => `${item.createdAt}-${item.id}`}
        keyboardShouldPersistTaps="handled"
        refreshing={isLoading || isFetching}
        onRefresh={refetch}
        ListEmptyComponent={
          isLoading || isFetching ? <ActivityIndicator animating={true} style={{ marginTop: 16 }} size="large" /> :
            <View style={{ alignItems: 'center', padding: 40 }}>
              <MaterialCommunityIcons name="playlist-remove" size={48} color="#999" />
              <Text style={{ fontSize: 16, marginVertical: 12, color: '#555' }}>
                Nenhum item encontrado.
              </Text>
              <Button onPress={() => refetch()} >Tentar novamente</Button>
            </View>
        }
        renderItem={({ item }) => <>
          {
            <Card style={{ marginHorizontal: 16, borderRadius: 12, elevation: 5, marginBottom: 16 }}>
              <Card.Title
                title={item.name}
                subtitle={item.description}
                titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                subtitleStyle={{ fontSize: 12, color: 'gray' }}
                right={() => <Chip
                  icon={() => (
                    <Ionicons
                      name={item.students?.length ? 'people' : 'person-add-outline'}
                      size={18}
                      color={item.students?.length ? '#1565C0' : '#2E7D32'}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  style={{
                    backgroundColor: item.students?.length ? '#BBDEFB' : '#C8E6C9',
                    alignSelf: 'flex-start',
                    marginRight: 16
                  }}
                  textStyle={{
                    color: item.students?.length ? '#1565C0' : '#2E7D32',
                  }}
                >
                  {item.students?.length
                    ? `${item.students?.length || 0} aluno${item.students?.length || 0 > 1 ? 's' : ''} inscrito${item.students?.length || 0 > 1 ? 's' : ''}`
                    : 'Vagas disponíveis'}
                </Chip>}
              />
              <Card.Content style={{ gap: 6 }}>

                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <Ionicons
                    name={'time'}
                    size={18}
                    color={theme.colors.primary}
                  />
                  <Text
                    variant="bodyMedium"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ fontSize: 14, flexShrink: 1 }}
                  >
                    {item?.time && item.time.length > 0
                      ? item.time
                        .filter((t) => t !== 'Personalizado')
                        .join(', ')
                      : '-'}
                  </Text>
                </View>
                <View style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center', }}>
                  <Ionicons
                    name={'calendar'}
                    size={18}
                    color={theme.colors.primary}
                  />
                  <Text
                    variant="bodyMedium"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={{ fontSize: 14, flexShrink: 1 }}
                  >
                    {item?.date && item.date.length > 0
                      ? item.date.map((s) => formatDate(s)).join(', ')
                      : '-'}
                  </Text>
                </View>


              </Card.Content>
              <Card.Actions>

                <Button
                  mode='contained-tonal'
                  onPress={() => navigation.navigate('RegisterSchedules', { schedulesId: item.id })}
                > Detalhes</Button>

              </Card.Actions>
            </Card>
          }
        </>
        }

      />
    </View>
  );
};

export default SchedulesStudent;
