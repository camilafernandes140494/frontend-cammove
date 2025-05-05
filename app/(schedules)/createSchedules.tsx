import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, View } from 'react-native';
import { Appbar, Button, Chip, Menu, SegmentedButtons, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from '@tanstack/react-query';
import { getScheduleById, patchSchedule, postSchedule } from '@/api/schedules/schedules.api';
import { SchedulesData } from '@/api/schedules/schedules.types';
import { FormField } from '@/components/FormField';
import { getRelationship } from '@/api/relationships/relationships.api';
import { Student } from '@/api/relationships/relationships.types';
import CustomChip from '@/components/CustomChip';

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
  const [activeTab, setActiveTab] = useState('details');


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
      customTime: customOnly[0] || '',
      studentLimit: scheduleById?.studentLimit || 1,
    };
  }, [scheduleById, timeOptionValues]);



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
  const selectedTime = watch("time");
  const studentsSelected = watch("students") ?? [];

  const [menuVisible, setMenuVisible] = useState(false);

  const { data } = useQuery({
    queryKey: ["getRelationship", user?.id,],
    queryFn: () => getRelationship(user?.id!, { status: "ACTIVE" }),
    enabled: !!user?.id,
  });

  const students: Student[] = data?.students ?? [];


  const handleSelect = (student: Partial<Student>) => {
    if (student.studentId && student.studentName) {
      if (!studentsSelected?.some(s => s.studentId === student.studentId)) {
        setValue('students', [...studentsSelected, {
          studentId: student.studentId,
          studentName: student.studentName,
        }]);
      }
      setMenuVisible(false);
    }
  };

  const handleRemove = (studentId: string) => {
    setValue('students', studentsSelected?.filter(s => s.studentId !== studentId));
  };
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
                <SegmentedButtons
                  value={activeTab}
                  onValueChange={setActiveTab}
                  buttons={[
                    {
                      value: 'details',
                      label: 'Detalhes',
                      icon: 'calendar-text',
                    },
                    {
                      value: 'students',
                      label: 'Participantes',
                      icon: 'account-group-outline',
                    },
                  ]}
                  style={{ paddingHorizontal: 24, marginBottom: 16 }}
                />
                {activeTab === 'details' && <>
                  <FormField control={control} name="name" label="Nome" type="text" />
                  <FormField control={control} name="description" label="Descrição" type="text" />

                  <FormField
                    control={control}
                    name="studentLimit"
                    label="Limite de alunos"
                    type="number"
                    keyboardType="numeric"
                  />

                  <FormField
                    control={control}
                    name="date"
                    label="Datas disponíveis"
                    type="calendar"
                  />
                  <Text style={{ color: theme.colors.primary, }}>Horários disponíveis</Text>

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
                </>}
                {activeTab === 'students' && <>
                  {(getValues().students?.length || 0) > (getValues().studentLimit || 1) && (
                    <CustomChip color="error" label={`Ultrapassou o limite | Máx. ${getValues().studentLimit || 1} aluno(s)`} icon="information" style={{ marginVertical: 12, padding: 10, borderRadius: 20 }} disabled />
                  )}

                  <FormField
                    control={control}
                    name="students"
                    type="custom"
                    customRender={({ value, onChange }) => (
                      <View style={{ marginBottom: 10 }}>
                        <Menu
                          visible={menuVisible}
                          onDismiss={() => setMenuVisible(false)}
                          style={{ width: "90%" }}
                          anchor={
                            <Button mode="outlined" onPress={() => setMenuVisible(true)} style={{ marginBottom: 12 }}>
                              Selecionar aluno(a)
                            </Button>
                          }
                        >
                          {students.length > 0 ? (
                            students.map((student) => (
                              <Menu.Item
                                key={student.studentId}
                                title={student.studentName}
                                onPress={() => handleSelect(student)}
                              />
                            ))
                          ) : (
                            <Menu.Item title="Nenhum aluno encontrado" disabled />
                          )}
                        </Menu>

                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                            gap: 8,
                            marginTop: 10,
                          }}
                        >
                          {studentsSelected?.map((student) => (
                            <Chip key={student.studentId} onClose={() => handleRemove(student.studentId!)}>
                              {student.studentName || 'Aluno'}
                            </Chip>
                          ))}
                        </View>
                      </View>
                    )}
                  />

                  <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={mutation.isPending} loading={mutation.isPending}>
                    Enviar
                  </Button>
                </>}
              </View>
            }
          />
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );

};

export default CreateSchedules;
