import {
  getAssessmentsByStudentIdAndAssessmentsId,
  patchAssessments,
  postAssessments,
} from '@/api/assessments/assessments.api';
import type { AssessmentData } from '@/api/assessments/assessments.types';
import { postEmail } from '@/api/email/email.api';
import type { PostEmail } from '@/api/email/email.types';
import { calculateIMC } from '@/common/common';
import GeneratePDFBase64 from '@/common/GeneratePDFBase64';
import { useStudent } from '@/context/StudentContext';
import { useTheme } from '@/context/ThemeContext';
import { useUser } from '@/context/UserContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FlatList, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import * as z from 'zod';
import { FormField } from './FormField';
import Skeleton from './Skeleton';

interface FormAssessmentsProps {
  assessmentsId?: string;
}

const FormAssessments = ({ assessmentsId }: FormAssessmentsProps) => {
  const [visible, setVisible] = useState(false);
  const { student } = useStudent();
  const { user } = useUser();
  const { theme } = useTheme();
  const today = new Date();
  const navigation = useNavigation();

  const {
    data: assessmentsByStudent,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: [
      'getAssessmentsByStudentIdAndAssessmentsId',
      assessmentsId,
      student?.id,
    ],
    queryFn: () =>
      getAssessmentsByStudentIdAndAssessmentsId(
        assessmentsId || '',
        student?.id || ''
      ),
    enabled: Boolean(assessmentsId && student?.id), // ✅ só ativa quando os dois existem
  });

  const [sendEmail, setSendEmail] = useState(false);

  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleSendPDFEmail = async () => {
    try {
      setSendEmail(true);
      const pdfBase64 = await GeneratePDFBase64(
        `
        Medições Corporais
    
        Peso: ${assessmentsByStudent?.bodyMeasurements?.weight || ''} kg
        Altura: ${assessmentsByStudent?.bodyMeasurements?.height || ''} cm
        Porcentagem de Gordura Corporal: ${assessmentsByStudent?.bodyMeasurements?.bodyFatPercentage || ''}%
        IMC: ${assessmentsByStudent?.bodyMeasurements?.imc || ''}
    
        Circunferências 
        Cintura: ${assessmentsByStudent?.bodyMeasurements?.waistCircumference || ''} cm
        Quadril: ${assessmentsByStudent?.bodyMeasurements?.hipCircumference || ''} cm
        Peito: ${assessmentsByStudent?.bodyMeasurements?.chestCircumference || ''} cm
        Braço Direita: ${assessmentsByStudent?.bodyMeasurements?.rightArmCircumference || ''} cm | Braço Esquerda: ${assessmentsByStudent?.bodyMeasurements?.leftArmCircumference || ''} cm
        Coxa Direita: ${assessmentsByStudent?.bodyMeasurements?.rightThighCircumference || ''} cm | Coxa Esquerda: ${assessmentsByStudent?.bodyMeasurements?.leftThighCircumference || ''} cm
        Panturrilha Direita: ${assessmentsByStudent?.bodyMeasurements?.rightCalfCircumference || ''} cm | Panturrilha Esquerda: ${assessmentsByStudent?.bodyMeasurements?.leftCalfCircumference || ''} cm
        Pescoço: ${assessmentsByStudent?.bodyMeasurements?.neckCircumference || ''} cm
    
        Composição Corporal
        Massa Muscular: ${assessmentsByStudent?.bodyMass.muscleMass || ''} kg
        Massa Óssea: ${assessmentsByStudent?.bodyMass.boneMass || ''} kg
    
        Frequência Cardíaca
        Em repouso: ${assessmentsByStudent?.heartRate?.restingHeartRate || ''} bpm
        Máxima: ${assessmentsByStudent?.heartRate?.maxHeartRate || ''} bpm
    
        Equilíbrio e Mobilidade 
        Teste de Equilíbrio: ${assessmentsByStudent?.balanceAndMobility?.balanceTest.value || ''}
        Teste de Mobilidade: ${assessmentsByStudent?.balanceAndMobility?.mobilityTest.value || ''}
    
        Postura 
        Avaliação Postural: ${assessmentsByStudent?.posture?.postureAssessment.value || ''}
    
        Histórico Médico 
        Lesões Anteriores: ${assessmentsByStudent?.medicalHistory?.injuryHistory || ''}
        Condições Médicas: ${assessmentsByStudent?.medicalHistory?.medicalConditions || ''}
        Dores Crônicas: ${assessmentsByStudent?.medicalHistory?.chronicPain || ''}
    
        Objetivos 
        ${assessmentsByStudent?.fitnessGoals || ''}
    
        Observações
        ${assessmentsByStudent?.observations || ''}
    
        Caso tenha dúvidas ou precise de ajustes no seu plano de treino, me avise! Vamos juntos alcançar seus objetivos.
    
        Atenciosamente,
        ${user?.name}
        Equipe CamMove 
    `,
        student
      );

      const emailData: PostEmail = {
        to: [student?.email || ''],
        subject: ' Sua Avaliação Física – Resultados e Análise',
        body: `Olá ${student?.name} <br><br>

        Tudo bem? Segue em anexo sua avaliação física com todos os detalhes sobre seu progresso e pontos de melhoria. <br><br>

        Com base nesses resultados, podemos ajustar seu treino e estabelecer novas metas para que você continue evoluindo.<br><br>
        
        Se tiver dúvidas ou quiser marcar uma conversa para discutirmos os próximos passos, me avise! Estou à disposição.<br><br>

        Vamos juntos alcançar seus objetivos! 💪<br><br>

        Atenciosamente,
        ${user?.name}<br><br>
        Equipe CamMove 🚀 `,
        attachments: [
          {
            filename: `avaliacao-${formattedDate}.pdf`,
            content: pdfBase64, // Conteúdo em base64
            encoding: 'base64', // Valor fixo para 'base64'
          },
        ],
      };

      // Chamando a função da API
      await postEmail(emailData);
    } catch (error) {
      console.error('Erro ao gerar/enviar PDF:', error);
    } finally {
      setSendEmail(false);
    }
  };

  const schema = z.object({
    studentName: z.string().optional(),
    studentId: z.string().optional(),
    bodyMeasurements: z.object({
      weight: z.number().optional(),
      height: z.number().optional(),
      bodyFatPercentage: z.number().optional(),
      imc: z.string().optional(),
      waistCircumference: z.number().optional(),
      hipCircumference: z.number().optional(),
      chestCircumference: z.number().optional(),
      rightArmCircumference: z.number().optional(),
      leftArmCircumference: z.number().optional(),
      rightThighCircumference: z.number().optional(),
      leftThighCircumference: z.number().optional(),
      rightCalfCircumference: z.number().optional(),
      leftCalfCircumference: z.number().optional(),
      neckCircumference: z.number().optional(),
    }),
    bodyMass: z.object({
      muscleMass: z.number().optional(),
      boneMass: z.number().optional(),
    }),
    heartRate: z.object({
      restingHeartRate: z.number().optional(),
      maxHeartRate: z.number().optional(),
    }),
    balanceAndMobility: z.object({
      balanceTest: z.object({
        value: z.string().optional(),
        label: z.string().optional(),
      }),
      mobilityTest: z.object({
        value: z.string().optional(),
        label: z.string().optional(),
      }),
    }),
    posture: z.object({
      postureAssessment: z.object({
        value: z.string().optional(),
        label: z.string().optional(),
      }),
    }),
    medicalHistory: z.object({
      injuryHistory: z.string().optional(),
      medicalConditions: z.string().optional(),
      chronicPain: z.string().optional(),
    }),
    fitnessGoals: z.string().optional(),
    observations: z.string().optional(),
    assessmentDate: z.string().optional(),
  });

  const mapAssessmentToForm = {
    studentName: student?.name || '',
    studentId: student?.id || '',
    bodyMeasurements: {
      weight: Number(assessmentsByStudent?.bodyMeasurements?.weight) || 0,
      height: Number(assessmentsByStudent?.bodyMeasurements?.height) || 0,
      bodyFatPercentage:
        assessmentsByStudent?.bodyMeasurements?.bodyFatPercentage || 0,
      imc: String(assessmentsByStudent?.bodyMeasurements?.imc) || '',
      waistCircumference:
        Number(assessmentsByStudent?.bodyMeasurements?.waistCircumference) || 0,
      hipCircumference:
        Number(assessmentsByStudent?.bodyMeasurements?.hipCircumference) || 0,
      chestCircumference:
        Number(assessmentsByStudent?.bodyMeasurements?.chestCircumference) || 0,
      rightArmCircumference:
        Number(assessmentsByStudent?.bodyMeasurements?.rightArmCircumference) ||
        0,
      leftArmCircumference:
        Number(assessmentsByStudent?.bodyMeasurements?.leftArmCircumference) ||
        0,
      rightThighCircumference:
        Number(
          assessmentsByStudent?.bodyMeasurements?.rightThighCircumference
        ) || 0,
      leftThighCircumference:
        Number(
          assessmentsByStudent?.bodyMeasurements?.leftThighCircumference
        ) || 0,
      rightCalfCircumference:
        Number(
          assessmentsByStudent?.bodyMeasurements?.rightCalfCircumference
        ) || 0,
      leftCalfCircumference:
        Number(assessmentsByStudent?.bodyMeasurements?.leftCalfCircumference) ||
        0,
      neckCircumference:
        Number(assessmentsByStudent?.bodyMeasurements?.neckCircumference) || 0,
    },
    bodyMass: {
      muscleMass: Number(assessmentsByStudent?.bodyMass.muscleMass) || 0,
      boneMass: Number(assessmentsByStudent?.bodyMass.boneMass) || 0,
    },
    heartRate: {
      restingHeartRate:
        Number(assessmentsByStudent?.heartRate?.restingHeartRate) || 0,
      maxHeartRate: Number(assessmentsByStudent?.heartRate?.maxHeartRate) || 0,
    },
    balanceAndMobility: {
      balanceTest: {
        value:
          String(assessmentsByStudent?.balanceAndMobility?.balanceTest) || '',
        label:
          String(assessmentsByStudent?.balanceAndMobility?.balanceTest) || '',
      },
      mobilityTest: {
        value:
          String(assessmentsByStudent?.balanceAndMobility?.mobilityTest) || '',
        label:
          String(assessmentsByStudent?.balanceAndMobility?.mobilityTest) || '',
      },
    },
    posture: {
      postureAssessment: {
        value: String(assessmentsByStudent?.posture?.postureAssessment) || '',
        label: String(assessmentsByStudent?.posture?.postureAssessment) || '',
      },
    },
    medicalHistory: {
      injuryHistory:
        (assessmentsByStudent?.medicalHistory?.injuryHistory as string) || '',
      medicalConditions:
        (assessmentsByStudent?.medicalHistory?.medicalConditions as string) ||
        '',
      chronicPain:
        (assessmentsByStudent?.medicalHistory?.chronicPain as string) || '',
    },
    fitnessGoals: assessmentsByStudent?.fitnessGoals || '',
    observations: assessmentsByStudent?.observations || '',
    assessmentDate: assessmentsByStudent?.assessmentDate || '',
  };

  const { control, handleSubmit, watch, setValue, getValues, reset } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
    defaultValues: mapAssessmentToForm,
  });

  console.log('getValues', getValues('assessmentDate'));
  useEffect(() => {
    if (assessmentsByStudent) {
      reset(mapAssessmentToForm);
    }
  }, [assessmentsByStudent]);

  const selectedWeight = watch('bodyMeasurements.weight');
  const selectedHeight = watch('bodyMeasurements.height');

  const selectedBalanceTest = watch('balanceAndMobility.balanceTest');
  const selectedMobilityTest = watch('balanceAndMobility.mobilityTest');
  const selectedPostureTest = watch('posture.postureAssessment');

  const imcDescription = useMemo(() => {
    const alturaEmMetros =
      Number(String(selectedHeight).replace(',', '.')) / 100;
    const peso = Number(selectedWeight);

    const resultadoIMC = calculateIMC(peso, alturaEmMetros || 0);

    return `${resultadoIMC.categoria} - ${resultadoIMC.imc}`;
  }, [selectedWeight, selectedHeight]);

  useEffect(() => {
    setValue('bodyMeasurements.imc', imcDescription);
  }, [imcDescription]);
  const assessmentMutation = useMutation({
    mutationFn: async (data: Partial<AssessmentData>) => {
      if (assessmentsId) {
        await patchAssessments(
          assessmentsId,
          user?.id || '',
          student?.id || '',
          data
        );
      } else {
        await postAssessments(user?.id || '', student?.id || '', data);
      }
    },
    onSuccess: () => {
      if (assessmentsId) {
        refetch();
      } else {
        navigation.navigate('Assessments' as never);
      }
      handleSendPDFEmail();
    },
    onError: () => {
      setVisible(true);
    },
  });

  const onSubmit = (data: Partial<AssessmentData>) => {
    const dataToSend = {
      ...data,
      posture: {
        postureAssessment: getValues().posture.postureAssessment.value,
      },
      balanceAndMobility: {
        balanceTest: getValues().balanceAndMobility.balanceTest.value,
        mobilityTest: getValues().balanceAndMobility.mobilityTest.value,
      },
    };
    assessmentMutation.mutate(dataToSend);
  };

  // const removeAssessments = (exerciseId: string) => {
  //   setAssessmentsList((prevList) =>
  //     prevList.filter((exercise) => exercise.exerciseId.id !== exerciseId)
  //   );
  // };

  // const updateAssessmentsList = (exercise: ExerciseWorkout) => {
  //   setAssessmentsList((prevList) => {
  //     const index = prevList.findIndex((ex) => ex.exerciseId.id === exercise.exerciseId.id);
  //     if (index !== -1) {
  //       const updatedList = [...prevList];
  //       updatedList[index] = exercise;
  //       return updatedList;
  //     }
  //     return [...prevList, exercise];
  //   });
  // };

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      data={[{}]}
      keyboardShouldPersistTaps="handled"
      keyExtractor={() => 'FormWorkout'}
      ListHeaderComponent={
        <View
          style={{
            backgroundColor: theme.colors.secondaryContainer,
            padding: 12,
          }}
        >
          <Button
            disabled={sendEmail}
            icon="email-fast-outline"
            mode="contained"
            onPress={handleSendPDFEmail}
          >
            Enviar por e-mail
          </Button>
        </View>
      }
      renderItem={() => (
        <>
          {assessmentsId && isLoading ? (
            <FormAssessmentsSkeleton />
          ) : (
            <View style={{ padding: 20, gap: 16 }}>
              <Card>
                <Card.Title title="Medidas Corporais" />
                <Card.Content style={{ gap: 10 }}>
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Peso"
                    left={<TextInput.Icon icon="scale-balance" />}
                    mode="flat"
                    name="bodyMeasurements.weight"
                    right={<TextInput.Affix text=" kg" />}
                    type="number"
                  />
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Altura"
                    left={<TextInput.Icon icon="human-male-height-variant" />}
                    mode="flat"
                    name="bodyMeasurements.height"
                    right={<TextInput.Affix text=" cm" />}
                    type="number"
                  />
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Porcentagem de Gordura Corporal"
                    left={<TextInput.Icon icon="percent" />}
                    mode="flat"
                    name="bodyMeasurements.bodyFatPercentage"
                    right={<TextInput.Affix text=" %" />}
                    type="number"
                  />

                  <Chip icon="information">{`${imcDescription} (IMC)`}</Chip>
                </Card.Content>
              </Card>

              <Card>
                <Card.Title title="Medidas de Circunferência" />
                <Card.Content style={{ gap: 10 }}>
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Cintura"
                    left={<TextInput.Icon icon="ruler" />}
                    mode="flat"
                    name="bodyMeasurements.waistCircumference"
                    right={<TextInput.Affix text=" cm" />}
                    type="number"
                  />

                  <FormField
                    control={control}
                    keyboardType="decimal-pad"
                    label="Quadril" // permite ponto nos iPhones
                    left={<TextInput.Icon icon="ruler" />}
                    mode="flat"
                    name="bodyMeasurements.hipCircumference"
                    right={<TextInput.Affix text=" cm" />}
                    type="number"
                  />
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Peito"
                    left={<TextInput.Icon icon="ruler" />}
                    mode="flat"
                    name="bodyMeasurements.chestCircumference"
                    right={<TextInput.Affix text=" cm" />}
                    type="number"
                  />
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Pescoço"
                    left={<TextInput.Icon icon="ruler" />}
                    mode="flat"
                    name="bodyMeasurements.neckCircumference"
                    right={<TextInput.Affix text=" cm" />}
                    type="number"
                  />
                </Card.Content>
              </Card>

              <Card>
                <Card.Title title="Medidas de Braços" />
                <Card.Content style={{ gap: 10 }}>
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Braço Direito"
                    left={<TextInput.Icon icon="ruler" />}
                    mode="flat"
                    name="bodyMeasurements.rightArmCircumference"
                    right={<TextInput.Affix text=" cm" />}
                    type="number"
                  />
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Braço Esquerdo"
                    left={<TextInput.Icon icon="ruler" />}
                    mode="flat"
                    name="bodyMeasurements.leftArmCircumference"
                    right={<TextInput.Affix text=" cm" />}
                    type="number"
                  />
                </Card.Content>
              </Card>

              <Card>
                <Card.Title title="Medidas das Pernas" />
                <Card.Content style={{ gap: 10 }}>
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Coxa Direita"
                    left={<TextInput.Icon icon="ruler" />}
                    mode="flat"
                    name="bodyMeasurements.rightThighCircumference"
                    right={<TextInput.Affix text=" cm" />}
                    type="number"
                  />
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Coxa Esquerda"
                    left={<TextInput.Icon icon="ruler" />}
                    mode="flat"
                    name="bodyMeasurements.leftThighCircumference"
                    right={<TextInput.Affix text=" cm" />}
                    type="number"
                  />
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Panturrilha Direita"
                    left={<TextInput.Icon icon="ruler" />}
                    mode="flat"
                    name="bodyMeasurements.rightCalfCircumference"
                    right={<TextInput.Affix text=" cm" />}
                    type="number"
                  />
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Panturrilha Esquerda"
                    left={<TextInput.Icon icon="ruler" />}
                    mode="flat"
                    name="bodyMeasurements.leftCalfCircumference"
                    right={<TextInput.Affix text=" cm" />}
                    type="number"
                  />
                </Card.Content>
              </Card>

              <Card>
                <Card.Title title="Massa Corporal" />
                <Card.Content style={{ gap: 10 }}>
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Massa Muscular"
                    left={<TextInput.Icon icon="scale-balance" />}
                    mode="flat"
                    name="bodyMass.muscleMass"
                    right={<TextInput.Affix text=" kg" />}
                    type="number"
                  />
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Massa Óssea"
                    left={<TextInput.Icon icon="bone" />}
                    mode="flat"
                    name="bodyMass.boneMass"
                    right={<TextInput.Affix text=" kg" />}
                    type="number"
                  />
                </Card.Content>
              </Card>

              <Card>
                <Card.Title title="Frequência Cardíaca" />
                <Card.Content style={{ gap: 10 }}>
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Em repouso"
                    left={<TextInput.Icon icon="sleep" />}
                    mode="flat"
                    name="heartRate.restingHeartRate"
                    right={<TextInput.Affix text=" bpm" />}
                    type="number"
                  />
                  <FormField
                    control={control}
                    keyboardType="numeric"
                    label="Máxima"
                    left={<TextInput.Icon icon="heart-pulse" />}
                    mode="flat"
                    name="heartRate.maxHeartRate"
                    right={<TextInput.Affix text=" bpm" />}
                    type="number"
                  />
                </Card.Content>
              </Card>

              <Card>
                <Card.Title title="Histórico Médico" />
                <Card.Content style={{ gap: 10 }}>
                  <FormField
                    control={control}
                    label="Lesões Anteriores"
                    left={<TextInput.Icon icon="bandage" />}
                    mode="flat"
                    name="medicalHistory.injuryHistory"
                    type="text"
                  />
                  <FormField
                    control={control}
                    label="Condições Médicas"
                    left={<TextInput.Icon icon="stethoscope" />}
                    mode="flat"
                    name="medicalHistory.medicalConditions"
                    type="text"
                  />
                  <FormField
                    control={control}
                    label="Dores Crônicas"
                    left={<TextInput.Icon icon="pill" />}
                    mode="flat"
                    name="medicalHistory.chronicPain"
                    type="text"
                  />
                </Card.Content>
              </Card>
              <Card>
                <Card.Title title="Equilíbrio, Mobilidade e Postura" />
                <Card.Content style={{ gap: 10 }}>
                  {selectedBalanceTest.value && (
                    <Text>Teste de Equilíbrio</Text>
                  )}
                  <FormField
                    control={control}
                    getLabel={(option) => option.label}
                    label="Teste de Equilíbrio"
                    name="balanceAndMobility.balanceTest.value"
                    options={[
                      { label: 'Boa', value: 'Boa' },
                      { label: 'Regular', value: 'Regular' },
                      { label: 'Ruim', value: 'Ruim' },
                    ]}
                    type="select"
                  />
                  {selectedMobilityTest.value && (
                    <Text>Teste de Mobilidade</Text>
                  )}

                  <FormField
                    control={control}
                    getLabel={(option) => option.label}
                    label="Teste de Mobilidade"
                    name="balanceAndMobility.mobilityTest.value"
                    options={[
                      { label: 'Boa', value: 'Boa' },
                      { label: 'Regular', value: 'Regular' },
                      { label: 'Ruim', value: 'Ruim' },
                    ]}
                    type="select"
                  />

                  {selectedPostureTest.value && <Text>Teste de Postura</Text>}
                  <FormField
                    control={control}
                    getLabel={(option) => option.label}
                    label="Teste de Postura"
                    name="posture.postureAssessment.value"
                    options={[
                      { label: 'Boa', value: 'Boa' },
                      { label: 'Regular', value: 'Regular' },
                      { label: 'Ruim', value: 'Ruim' },
                    ]}
                    type="select"
                  />
                </Card.Content>
              </Card>

              <Card>
                <Card.Title title="Objetivo" />
                <Card.Content style={{ gap: 10 }}>
                  <FormField
                    control={control}
                    label="Objetivo"
                    left={<TextInput.Icon icon="bullseye-arrow" />}
                    mode="flat"
                    name="fitnessGoals"
                    type="text"
                  />
                </Card.Content>
              </Card>

              <Card>
                <Card.Title title="Observação" />
                <Card.Content style={{ gap: 10 }}>
                  <FormField
                    control={control}
                    label="Observação"
                    left={<TextInput.Icon icon="comment" />}
                    mode="flat"
                    name="observations"
                    type="text"
                  />
                </Card.Content>
              </Card>

              <Snackbar
                action={{
                  label: 'Close',
                  icon: 'close',
                  onPress: () => setVisible(false),
                }}
                onDismiss={() => setVisible(false)}
                visible={visible}
              >
                <Text>Erro ao cadastrar treino</Text>
              </Snackbar>
              <Button
                disabled={assessmentMutation.isPending}
                loading={assessmentMutation.isPending}
                mode="contained"
                onPress={handleSubmit(onSubmit)}
              >
                Enviar
              </Button>
            </View>
          )}
        </>
      )}
      style={{ flex: 1 }}
    />
  );
};

export default FormAssessments;

const FormAssessmentsSkeleton = () => {
  const renderFieldSkeleton = () => (
    <View style={{ marginBottom: 12 }}>
      <Skeleton style={{ marginTop: 24, height: 48 }} />
    </View>
  );

  const renderCardSkeleton = (title: string, fields = 3) => (
    <Card style={{ marginBottom: 16 }}>
      <Card.Title title={title} />
      <Card.Content>
        {[...Array(fields)].map((_, index) => (
          <View key={index}>{renderFieldSkeleton()}</View>
        ))}
      </Card.Content>
    </Card>
  );

  return (
    <View style={{ padding: 20 }}>
      {renderCardSkeleton('Medidas Corporais', 3)}
      {renderCardSkeleton('Medidas de Circunferência', 4)}
      {renderCardSkeleton('Medidas de Braços', 2)}
      {renderCardSkeleton('Medidas das Pernas', 4)}
      {renderCardSkeleton('Massa Corporal', 2)}
      {renderCardSkeleton('Frequência Cardíaca', 2)}
      {renderCardSkeleton('Histórico Médico', 3)}
      {renderCardSkeleton('Equilíbrio, Mobilidade e Postura', 3)}
      {renderCardSkeleton('Objetivo', 1)}
      {renderCardSkeleton('Observação', 1)}

      <Skeleton style={{ marginTop: 24, height: 48, borderRadius: 26 }} />
    </View>
  );
};
