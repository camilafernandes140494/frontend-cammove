import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';
import { Appbar, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../UserContext';
import { useTheme } from '../ThemeContext';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from '@tanstack/react-query';
import { getScheduleById, patchSchedule, postSchedule } from '@/api/schedules/schedules.api';
import { SchedulesData } from '@/api/schedules/schedules.types';
import { FormField } from '@/components/FormField';

type CreateWorkoutProps = {
  route: {
    params?: {
      schedulesId?: string;
    };
  };
};


const CreateSchedules = ({ route }: CreateWorkoutProps) => {
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
  });

  const timeOptions = useMemo(() => [
    { label: "08:00", value: "08:00" },
    { label: "08:30", value: "08:30" },
    { label: "09:00", value: "09:00" },
    { label: "09:30", value: "09:30" },
    { label: "10:00", value: "10:00" },
    { label: "10:30", value: "10:30" },
    { label: "11:00", value: "11:00" },
    { label: "11:30", value: "11:30" },
    { label: "12:00", value: "12:00" },
    { label: "12:30", value: "12:30" },
    { label: "13:00", value: "13:00" },
    { label: "13:30", value: "13:30" },
    { label: "14:00", value: "14:00" },
    { label: "14:30", value: "14:30" },
    { label: "15:00", value: "15:00" },
    { label: "15:30", value: "15:30" },
    { label: "16:00", value: "16:00" },
    { label: "16:30", value: "16:30" },
    { label: "17:00", value: "17:00" },
    { label: "17:30", value: "17:30" },
    { label: "18:00", value: "18:00" },
    { label: "Personalizado", value: "Personalizado" },
  ], []);

  const timeOptionValues = new Set(timeOptions.map(opt => opt.value));

  const defaultValuesById = useMemo(() => {
    const originalTime = scheduleById?.time || [];

    const customOnly = originalTime.filter(t => !timeOptionValues.has(t));
    const defaultOnly = originalTime.filter(t => timeOptionValues.has(t) && t !== 'Personalizado');

    return {
      time: originalTime.includes("Personalizado") ? [...defaultOnly, "Personalizado"] : originalTime,
      date: scheduleById?.date || [],
      name: scheduleById?.name || '',
      description: scheduleById?.description || '',
      students: scheduleById?.students || [],
      available: scheduleById?.available || false,
      customTime: customOnly[0] || ''
    };
  }, [scheduleById, timeOptionValues]);



  useEffect(() => {
    if (scheduleById) {
      reset(defaultValuesById);
    }
  }, [scheduleById,]);

  const { control, handleSubmit, watch, reset, getValues } = useForm<z.infer<typeof schema>>({
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
  const selectedTime = watch("time");

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Schedules' as never)} />
        <Appbar.Content title="Cadastrar agendamento" />
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
              <View>
                <Text variant="titleSmall" style={{ marginBottom: 8 }}>Informações do agendamento</Text>

                <FormField control={control} name="name" label="Nome" type="text" />
                <FormField control={control} name="description" label="Descrição" type="text" multiline numberOfLines={5} />
                <FormField control={control} name="available" label="Disponível" type="switch" />

                <FormField
                  control={control}
                  name="date"
                  label="Datas disponíveis"
                  type="calendar"
                />
                <Text>Horários disponíveis</Text>

                <FormField
                  control={control}
                  name="time"
                  type="chip-multi"
                  options={timeOptions}
                />
                {selectedTime.includes("Personalizado") && (
                  <FormField control={control} name="customTime" label="Horário personalizado" type="time" keyboardType="numeric" />
                )}
                <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={mutation.isPending} loading={mutation.isPending}>
                  Enviar
                </Button>
              </View>
            }
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );

};

export default CreateSchedules;
