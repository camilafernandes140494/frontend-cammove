import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Appbar, Avatar, Button, Card, Dialog, Divider, Portal, Snackbar, Text } from 'react-native-paper';
import { useUser } from '../UserContext';
import { getInitials } from '@/common/common';
import CustomModal from '@/components/CustomModal';
import { FormField } from '@/components/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import * as z from "zod";
import { patchUser } from '@/api/users/users.api';
import { useTheme } from '../ThemeContext';
import { Calendar } from "react-native-calendars";
import { parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getTrainingDays } from '@/api/workoutsDay/workoutsDay.api';

export type RootHomeStackParamList = {
  home: undefined;
  StudentProfile: { studentProfileId?: string };
  RegisterUserByTeacher: undefined
};

const HomeStudent = () => {
  const { user, setUser } = useUser();
  const [visible, setVisible] = useState(false);
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [visibleConfig, setVisibleConfig] = useState(false);

  console.log(user)
  const modalSchema = z.object({
    name: z.string().min(1, "Obrigatório"),
  });

  const { control, handleSubmit } = useForm<z.infer<typeof modalSchema>>({
    resolver: zodResolver(modalSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });


  const onSubmit = async (data: any) => {
    try {
      await patchUser(user?.id || '', data);
      setUser({ name: data.name })
    } catch (error) {
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        action={{
          label: '',
          icon: 'close',
          onPress: () => setVisible(false),
        }}
      >
        <Text>Erro ao atualizar usuário</Text>
      </Snackbar>
    }
  }


  const { data: datesArray, refetch, isLoading, isFetching } = useQuery({
    queryKey: ['getTrainingDays', user?.id],
    queryFn: () => getTrainingDays(user?.id!,),
    enabled: !!user?.id
  });

  const markedDates = datesArray?.reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: 'green',
      selected: true,
      selectedColor: 'green',
    };
    return acc;
  }, {} as Record<string, any>);


  const { count, message, icon } = useMemo(() => {
    if (!datesArray) return { count: 0, message: '', icon: 'emoticon-neutral-outline' };

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Extrai apenas os dias únicos do mês atual
    const uniqueWorkoutDays = new Set(
      datesArray
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
  }, [datesArray]);



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
              <CustomModal
                onPress={handleSubmit(onSubmit)}
                title="Editar perfil"
                trigger={
                  <Button mode="text" icon="cog-outline">
                    Editar perfil
                  </Button>
                }
              >
                <FormField
                  control={control}
                  mode="flat"
                  name="name"
                  label="Nome"
                  type="text"
                />
              </CustomModal>

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
        <Avatar.Text label={getInitials(user?.name || '')} />
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
            refreshing={isLoading || isFetching}
            onRefresh={refetch}
          />
        }
      >
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
          // enableSwipeMonths={true}

          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <View style={{ width: 12, height: 12, backgroundColor: 'green', borderRadius: 6, marginRight: 6 }} />
          <Text>Treinos realizados</Text>
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
