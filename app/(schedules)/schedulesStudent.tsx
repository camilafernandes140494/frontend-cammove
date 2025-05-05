import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import {
  Button,
  Text,
  Appbar,
  Card,
  Chip
} from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { getSchedule } from '@/api/schedules/schedules.api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useMyTeacher } from '../../context/MyTeacherContext';
import Skeleton from '@/components/Skeleton';
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
        renderItem={({ item }) => {
          const isUserSubscribed = item?.students?.some(itemData => itemData.studentId === user?.id)
          return <>
            {
              <Card style={{ marginHorizontal: 16, borderRadius: 12, elevation: 5, marginBottom: 16 }}>
                <Card.Title
                  title={item.name}
                  subtitle={item.description}
                  titleStyle={{ fontSize: 18, fontWeight: 'bold' }}
                  subtitleStyle={{ fontSize: 12, color: 'gray' }}
                  right={() => (
                    !isUserSubscribed ? (
                      <Chip
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
                          ? `${item.students.length} aluno${item.students.length > 1 ? 's' : ''} inscrit${item.students.length > 1 ? 'os' : 'o'}`
                          : 'Vagas disponíveis'}
                      </Chip>
                    ) : null
                  )}

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
                        ? item.date.map((s) =>
                          format(parse(s, 'yyyy-MM-dd', new Date()), "dd/MM/yyyy", { locale: ptBR })
                        ).join(', ')
                        : '-'}

                    </Text>
                  </View>


                </Card.Content>
                <Card.Actions>

                  <Button
                    mode={isUserSubscribed ? 'text' : 'contained'}
                    onPress={() => navigation.navigate('RegisterSchedules', { schedulesId: item.id })}
                  > {isUserSubscribed ? 'Cancelar inscrição' : 'Detalhes'}</Button>

                </Card.Actions>
              </Card>
            }
          </>
        }
        }
        ListEmptyComponent={
          isLoading || isFetching ? (
            <View>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  style={{
                    width: '90%',
                    height: 100,
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
              Nenhum dado encontrado.
            </Text>
            <Button onPress={() => refetch()} >Tentar novamente</Button>
          </View>
        }
      />
    </View>
  );
};

export default SchedulesStudent;
