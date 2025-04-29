import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Appbar, Avatar, Button, Card, Dialog, Divider, IconButton, Portal, Text, Modal } from 'react-native-paper';
import { useUser } from '../UserContext';
import { getInitials } from '@/common/common';
import CustomModal from '@/components/CustomModal';

import { getUserById } from '@/api/users/users.api';
import { useTheme } from '../ThemeContext';
import { Calendar } from "react-native-calendars";
import { format, parse, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getTrainingDays } from '@/api/workoutsDay/workoutsDay.api';
import { useMyTeacher } from '../context/MyTeacherContext';
import { Linking } from 'react-native';
import { getScheduleDatesByStudent } from '@/api/schedules/schedules.api';
import { SchedulesStudentDateData } from '@/api/schedules/schedules.types';
import { Ionicons } from '@expo/vector-icons';
import { ptBR } from 'date-fns/locale';
import { NavigationProp, useNavigation } from '@react-navigation/native';


export type RootHomeStackParamList = {
  home: undefined;
  StudentProfile: { studentProfileId?: string };
  RegisterUserByTeacher: undefined;
  MyProfile: undefined
};

const HomeStudent = () => {
  const { user, setUser } = useUser();
  const [visible, setVisible] = useState(false);
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [visibleConfig, setVisibleConfig] = useState(false);
  const { teacher } = useMyTeacher()
  const [selectedDate, setSelectedDate] = useState<SchedulesStudentDateData[]>();
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation<NavigationProp<RootHomeStackParamList>>();


  const { data: teacherData, isLoading: isLoadingTeacherData } = useQuery({
    queryKey: ['teacherData', teacher?.teacherId],
    queryFn: () => getUserById(teacher?.teacherId || ''),
    enabled: !!teacher?.teacherId,
  });



  const { data: scheduleDates,
    refetch: scheduleDatesRefetch,
    isLoading: scheduleDatesIsLoading,
    isFetching: scheduleDatesIsFetching
  } = useQuery({
    queryKey: ['getScheduleDatesByStudent', teacher?.teacherId, user?.id],
    queryFn: () => getScheduleDatesByStudent(teacher?.teacherId!, user?.id!),
    enabled: !!teacher?.teacherId && !!user?.id,
  });

  const {
    data: trainingDates,
    refetch: trainingDatesRefetch,
    isLoading: trainingDatesIsLoading,
    isFetching: trainingDatesIsFetching } = useQuery({
      queryKey: ['getTrainingDays', user?.id],
      queryFn: () => getTrainingDays(user?.id!,),
      enabled: !!user?.id
    });

  const markedDates = {
    ...(trainingDates?.reduce((acc, date) => {
      acc[date] = {
        marked: true,
        dotColor: theme.colors.card.feedback.button,
        selected: true,
        selectedColor: theme.colors.card.feedback.button,
      };
      return acc;
    }, {} as Record<string, any>)),

    ...(scheduleDates?.reduce((acc, date) => {
      acc[date.date] = {
        marked: true,
        dotColor: theme.colors.card.purple.border.default,
        selected: true,
        selectedColor: theme.colors.card.purple.border.default,
      };
      return acc;
    }, {} as Record<string, any>)),
  };



  const handleDayPress = (day: { dateString: string }) => {
    const selectedDates = scheduleDates?.filter(
      (schedule) => schedule.date === day.dateString
    );

    if (selectedDates && selectedDates.length > 0) {
      setSelectedDate(selectedDates); // agora é uma lista
      setModalVisible(true);
    }
  };

  const { count, message, icon } = useMemo(() => {
    if (!trainingDates) return { count: 0, message: '', icon: 'emoticon-neutral-outline' };

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const uniqueWorkoutDays = new Set(
      trainingDates
        .map(dateStr => parseISO(dateStr))
        .filter(date =>
          date.getMonth() === currentMonth && date.getFullYear() === currentYear
        )
        .map(date => date.getDate()) // pegando só o dia para contar os únicos
    );

    const count = uniqueWorkoutDays.size;

    let message = '';
    let icon = 'emoticon-happy-outline';

    if (count >= 3) {
      message = 'Incrível! Você está se superando! 💥';
      icon = 'fire';
    } else if (count >= 15) {
      message = 'Muito bem! Continue nesse ritmo! 🙌';
      icon = 'emoticon-excited-outline';
    } else if (count <= 6) {
      message = 'Você começou, e isso é o mais importante! 💪';
      icon = 'star-outline';
    }
    else if (count === 1) {
      message = 'Você começou, e isso é o mais importante! 💪';
      icon = 'star-outline';
    } else {
      message = 'Hora de voltar à rotina! Você consegue! 🚀';
      icon = 'run-fast';
    }

    return { count, message, icon };
  }, [trainingDates]);



  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header mode='small'>
        <Appbar.Content title="CamMove" />
        <Appbar.Action icon="bell-outline" onPress={() => { }} />
        <Appbar.Action icon="menu" onPress={() => setVisibleConfig(!visibleConfig)} />
        <Portal>
          <Dialog visible={visibleConfig} onDismiss={() => setVisibleConfig(false)}>
            <Dialog.Title style={{ textAlign: 'center' }}>Configurações</Dialog.Title>
            <Dialog.Content style={{ alignItems: 'flex-start', gap: 16 }}>

              <Button mode="text" icon={isDarkMode ? 'moon-waning-crescent' : 'weather-sunny'} onPress={toggleTheme}>
                {isDarkMode ? 'Usar tema claro' : 'Usar tema escuro'}
              </Button>
              <Divider style={{ width: '100%', backgroundColor: theme.colors.outlineVariant, height: 1 }} />
              <Button mode="text" icon="cog-outline" onPress={() => { setVisibleConfig(false), navigation.navigate('MyProfile') }}>
                Editar perfil
              </Button>

              <Divider style={{ width: '100%', backgroundColor: theme.colors.outlineVariant, height: 1 }} />

              <CustomModal
                onPress={() =>
                  setUser({
                    id: null,
                    name: null,
                    gender: null,
                    permission: null,
                    token: null,
                  })
                }
                title="Tem certeza de que deseja sair? Você precisará fazer login novamente para acessar sua conta."
                primaryButtonLabel="Sair"
                trigger={
                  <Button mode="text" icon="logout">
                    Sair
                  </Button>
                }
              />
            </Dialog.Content>
          </Dialog>
        </Portal>
      </Appbar.Header>
      <View style={{ display: 'flex', backgroundColor: theme.colors.secondaryContainer, flexDirection: 'row', alignItems: "center", padding: 16, gap: 16 }}>
        {user?.image ? <Avatar.Image size={80} source={{ uri: user.image }} /> : <Avatar.Text label={getInitials(user?.name || '')} />}
        <Text variant="headlineMedium" >
          Olá, {user?.name}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, }}
        contentContainerStyle={{
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          gap: 12
        }}
        refreshControl={
          <RefreshControl
            refreshing={trainingDatesIsLoading || trainingDatesIsFetching || scheduleDatesIsLoading || scheduleDatesIsFetching}
            onRefresh={() => {
              trainingDatesRefetch();
              scheduleDatesRefetch();
            }}
          />
        }
      >


        <Card>
          <Card.Title
            title={teacherData?.name}
            titleStyle={{ fontWeight: 'bold', fontSize: 18 }}
            subtitle="Treinador responsável"
            left={(props) => (
              <Avatar.Image
                {...props}
                size={48}
                source={
                  teacherData?.gender
                    ? require('@/assets/images/teacher-girl.png')
                    : require('@/assets/images/teacher-man.png')
                }
              />
            )}
            right={(props) => (
              <IconButton
                {...props}
                icon="whatsapp"
                iconColor="#25D366"
                onPress={() => {
                  const phone = teacherData?.phone?.replace(/\D/g, '');
                  if (phone) {
                    Linking.openURL(`https://wa.me/${phone}`);
                  }
                }}
              />
            )}
          />
        </Card>


        {user?.status && <Card style={{ backgroundColor: theme.colors.onErrorContainer }}>
          <Card.Title
            title="Aluno Inativo"
            subtitle="Entre em contato com o professor."
            titleStyle={{ color: theme.colors.errorContainer, fontWeight: 'bold' }}
            subtitleStyle={{ color: theme.colors.errorContainer }}
            left={(props) => (
              <Avatar.Icon {...props} icon="alert-circle" color={theme.colors.errorContainer} style={{ backgroundColor: theme.colors.onErrorContainer }} />
            )}
          />
        </Card>}

        <View
          style={{
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 10,
            elevation: 3,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
          }}
        >
          <Calendar
            markedDates={markedDates}
            monthFormat={'MMMM yyyy'}
            onDayPress={handleDayPress}
          />
          <Portal>
            <Modal
              visible={modalVisible}
              onDismiss={() => setModalVisible(false)}
              contentContainerStyle={{ paddingHorizontal: 0 }} // opcional
            >
              <View
                style={{
                  backgroundColor: theme.colors.background,
                  padding: 20,
                  borderRadius: 10,
                  margin: 30,
                }}
              >
                <ScrollView>
                  {selectedDate?.map((item, index) => (
                    <View key={index}>
                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: 16
                        }}
                      >
                        <View>
                          <Text variant='titleLarge'>
                            {item?.name}
                          </Text>
                          <Text variant='bodySmall'>
                            {item?.description}
                          </Text>
                        </View>
                        {index === 0 && (
                          <IconButton
                            icon="close"
                            size={20}
                            onPress={() => setModalVisible(false)}
                          />
                        )}
                      </View>

                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                          marginBottom: 10
                        }}
                      >
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
                            ? item.time.filter((t) => t !== 'Personalizado').join(', ')
                            : '-'}
                        </Text>
                      </View>

                      <View
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 12,
                          alignItems: 'center'
                        }}
                      >
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
                          {item?.date
                            ? format(parse(item.date, 'yyyy-MM-dd', new Date()), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                            : ''}
                        </Text>
                      </View>

                      {index + 1 < selectedDate.length && (
                        <Divider
                          style={{
                            width: '100%',
                            marginVertical: 16,
                            backgroundColor: theme.colors.outlineVariant,
                            height: 2
                          }}
                        />
                      )}
                    </View>
                  ))}
                </ScrollView>
              </View>
            </Modal>
          </Portal>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ width: 12, height: 12, backgroundColor: theme.colors.card.purple.border.default, borderRadius: 6, marginRight: 6 }} />
            <Text style={{ color: theme.colors.card.purple.text.primary }}>Agendamentos</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <View style={{ width: 12, height: 12, backgroundColor: theme.colors.card.feedback.button, borderRadius: 6, marginRight: 6 }} />
            <Text style={{ color: theme.colors.card.feedback.text.primary }}>Treinos realizados</Text>
          </View>
        </View>


        <Card style={{ marginVertical: 16, padding: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Avatar.Icon size={40} icon={icon} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ marginBottom: 4 }}>
                Você treinou {count} {count === 1 ? 'vez' : 'vezes'} no último mês
              </Text>
              <Text variant="bodyMedium">{message}</Text>
            </View>
          </View>
        </Card>


      </ScrollView>

    </View>
  );
};

export default HomeStudent;
