import React, { useMemo, useState } from 'react';
import { ScrollView, View, } from 'react-native';
import { Appbar, Avatar, Button, Card, Snackbar, Text } from 'react-native-paper';
import { useUser } from '../UserContext';
import { getInitials } from '@/common/common';
import CustomModal from '@/components/CustomModal';
import { FormField } from '@/components/FormField';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import * as z from "zod";
import { patchUser } from '@/api/users/users.api';
import { useTheme } from '../ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useStudent } from '../context/StudentContext';
import { Calendar } from "react-native-calendars";
import { isAfter, subDays, parseISO } from 'date-fns';

export type RootHomeStackParamList = {
  home: undefined;
  StudentProfile: { studentProfileId?: string };
  RegisterUserByTeacher: undefined
};

const HomeStudent = () => {
  const { user, setUser } = useUser();
  const [visible, setVisible] = useState(false);
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const [rating, setRating] = useState(0);
  const [showStudent, setShowStudent] = useState(false);
  const navigation = useNavigation<NavigationProp<RootHomeStackParamList>>();
  const { refetchStudent } = useStudent();

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

  type IoniconName = keyof typeof Ionicons.glyphMap;
  const datesArray = ['2025-04-04', '2025-04-10', '2025-04-15'];
  const markedDates = datesArray.reduce((acc, date) => {
    acc[date] = {
      marked: true,
      dotColor: 'green',
      selected: true,
      selectedColor: 'green',
    };
    return acc;
  }, {} as Record<string, any>);


  const { count, message, icon } = useMemo(() => {
    const oneWeekAgo = subDays(new Date(), 7);
    const count = datesArray.filter(date =>
      isAfter(parseISO(date), oneWeekAgo)
    ).length;

    let message = '';
    let icon = 'emoticon-happy-outline';

    if (count >= 3) {
      message = 'Incrível! Você está se superando! 💥';
      icon = 'fire';
    } else if (count === 2) {
      message = 'Muito bem! Continue nesse ritmo! 🙌';
      icon = 'emoticon-excited-outline';
    } else if (count === 1) {
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
      </Appbar.Header>
      <View style={{ display: 'flex', backgroundColor: theme.colors.secondaryContainer, flexDirection: 'row', alignItems: "center", padding: 16 }}>
        <Avatar.Text label={getInitials(user?.name || '')} />

        <View style={{ display: 'flex', marginHorizontal: 16 }}>
          <View style={{ display: 'flex', flexDirection: "row", alignItems: 'center', justifyContent: "space-between", width: '85%', gap: 16 }}>
            <Text variant="headlineMedium" >
              Olá, {user?.name}
            </Text>
            <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"}
              size={24} onPress={toggleTheme} color={theme.colors.onBackground} />
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>

            <CustomModal
              onPress={handleSubmit(onSubmit)}
              title="Editar perfil"
              trigger={
                <Button mode="text" icon="cog-outline" >
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

            <CustomModal
              onPress={() => setUser({
                id: null,
                name: null,
                gender: null,
                permission: null,
                token: null
              })}
              title="Tem certeza de que deseja sair? Você precisará fazer login novamente para acessar sua conta."
              primaryButtonLabel="Sair"
              trigger={
                <Button mode="text" icon="logout" >
                  Sair
                </Button>
              }
            />

          </View>
        </View>

      </View>



      <ScrollView
        style={{ flex: 1, }}
        contentContainerStyle={{
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          gap: 12
        }}
      >


        <View
          style={{
            backgroundColor: '#F5F5F5', // muda aqui para a cor que quiser
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
                Você treinou {count} {count === 1 ? 'vez' : 'vezes'} na última semana
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
