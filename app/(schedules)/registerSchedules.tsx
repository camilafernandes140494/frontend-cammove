import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from '@tanstack/react-query';
import { getScheduleById, patchSchedule, postSchedule } from '@/api/schedules/schedules.api';
import { SchedulesData } from '@/api/schedules/schedules.types';

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

  const { data: scheduleById, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['getScheduleById', user?.id, schedulesId],
    queryFn: () => getScheduleById(user?.id!, schedulesId!),
    enabled: !!user?.id && !!schedulesId,
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

  const { control, handleSubmit, watch, reset, getValues, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValuesById
  });


  const mutation = useMutation({
    mutationFn: async (data: Partial<SchedulesData>) => {
      if (!schedulesId) {
        return await postSchedule(user?.id || '', data);
      } else {
        return await patchSchedule(user?.id || '', schedulesId, data);
      }
    },
    onSuccess: () => {
      navigation.navigate('Schedules' as never);
    },
    onError: () => {
      setVisible(true);
    }
  });

  const onSubmit = async (data: Partial<SchedulesData>) => {
    const values = getValues();
    let updatedTime = [...(values.time || [])];

    if (updatedTime.includes("Personalizado")) {
      if (values.customTime) {
        updatedTime.push(values.customTime);
      }
    }

    mutation.mutate({ ...data, time: updatedTime });
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
              <>

                <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={mutation.isPending} loading={mutation.isPending}>
                  Inscrever-se
                </Button>
              </>
            }
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );

};

export default RegisterSchedules;
