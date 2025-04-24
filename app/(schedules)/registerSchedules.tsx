import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';
import { Appbar, Button, Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from '@tanstack/react-query';
import { getScheduleById, patchSchedule } from '@/api/schedules/schedules.api';
import { SchedulesData } from '@/api/schedules/schedules.types';
import { useMyTeacher } from '../context/MyTeacherContext';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CustomChip from '@/components/CustomChip';

type CreateWorkoutProps = {
  route: {
    params?: {
      schedulesId?: string;
    };
  };
};


const RegisterSchedules = ({ route }: CreateWorkoutProps) => {
  const navigation = useNavigation();
  const { user } = useUser();
  const { schedulesId } = route.params || {};
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const { teacher } = useMyTeacher()

  const { data: scheduleById, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getScheduleById', teacher?.teacherId, schedulesId],
    queryFn: () => getScheduleById(teacher?.teacherId!, schedulesId!),
    enabled: !!teacher?.teacherId && !!schedulesId,
  });

  const schema = z.object({
    time: z.array(z.string()),
    date: z.array(z.string()),
    name: z.string(),
    description: z.string(),
    students: z.array(
      z.object({
        studentName: z.string(),
        studentId: z.string(),
      })
    ).optional(),
    available: z.boolean(),
    customTime: z.string(),
    studentLimit: z.number().min(1, "Informe ao menos 1 aluno").optional(),
  });

  const defaultValuesById = useMemo(() => {
    const originalTime = scheduleById?.time || [];

    return {
      time: originalTime.includes("Personalizado") ? ["Personalizado"] : originalTime,
      date: scheduleById?.date || [],
      name: scheduleById?.name || '',
      description: scheduleById?.description || '',
      students: scheduleById?.students || [],
      available: scheduleById?.available || false,
      customTime: '',
      studentLimit: scheduleById?.studentLimit || 1,
    };
  }, [scheduleById,]);



  useEffect(() => {
    if (scheduleById) {
      reset(defaultValuesById);
    }
  }, [scheduleById,]);

  const { control, handleSubmit, reset } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValuesById
  });


  const mutation = useMutation({
    mutationFn: async (data: Partial<SchedulesData>) => {
      if (schedulesId) {
        return await patchSchedule(teacher?.teacherId || '', schedulesId, data);
      }
    },
    onSuccess: () => {
      navigation.navigate('SchedulesStudent' as never);
    },
    onError: () => {
      setVisible(true);
    }
  });

  const isUserSubscribed = scheduleById?.students?.some(item => item.studentId === user?.id);
  const buttonLabel = isUserSubscribed ? 'Cancelar inscrição' : 'Quero me inscrever';

  const onSubmit = async () => {
    const currentStudents = scheduleById?.students ?? [];

    const updatedStudents = isUserSubscribed
      ? currentStudents.filter(student => student.studentId !== user?.id)
      : [...currentStudents, { studentId: user?.id || '', studentName: user?.name || '' }];

    mutation.mutate({
      ...scheduleById,
      students: updatedStudents,
    });
  };


  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('SchedulesStudent' as never)} />
        <Appbar.Content title="Detalhes do agendamento" />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <FlatList
            contentContainerStyle={{ padding: 24 }}
            style={{ flex: 1, backgroundColor: theme.colors.background }}
            data={[{}]}
            keyExtractor={() => 'header'}
            renderItem={() =>
              <Card>

                <View style={{ padding: 16, }}>
                  <Card.Title title={scheduleById?.name} subtitle={scheduleById?.description} />
                  <Card.Content style={{ padding: 16, gap: 16 }}>
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
                        {scheduleById?.time && scheduleById.time.length > 0
                          ? scheduleById.time
                            .filter((t) => t !== 'Personalizado')
                            .join(', ')
                          : '-'}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, }}>
                      <Ionicons name="calendar" size={18} color={theme.colors.primary} />
                      <View style={{ flex: 1 }}>
                        {scheduleById?.date && scheduleById.date.length > 0 ? (
                          scheduleById.date.map((date, index) => (
                            <Text key={index} variant="bodyMedium" style={{ fontSize: 14, marginBottom: 2 }}>
                              {format(new Date(date), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                            </Text>
                          ))
                        ) : (
                          <Text variant="bodyMedium" style={{ fontSize: 14 }}>-</Text>
                        )}
                      </View>
                    </View>
                    {(scheduleById?.students?.length || 0) > (scheduleById?.studentLimit || 1) && (
                      <CustomChip color="error" label={'Capacidade da turma atingida'} icon="information" style={{ marginVertical: 12, padding: 10, borderRadius: 20 }} disabled />
                    )}
                    <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={mutation.isPending} loading={mutation.isPending}>
                      {buttonLabel}
                    </Button>
                  </Card.Content>

                </View>

              </Card>
            }
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );

};

export default RegisterSchedules;
