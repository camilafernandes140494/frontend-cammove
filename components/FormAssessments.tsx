import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import * as z from "zod";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { useStudent } from '@/app/context/StudentContext';
import { FormField } from './FormField';
import { Button, Card, Chip, TextInput, Text, Snackbar } from 'react-native-paper';
import { useUser } from '@/app/UserContext';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { calculateIMC } from '@/common/common';
import GeneratePDFBase64 from '@/common/GeneratePDFBase64';
import { postEmail } from '@/api/email/email.api';
import { PostEmail } from '@/api/email/email.types';
import { getAssessmentsByStudentIdAndAssessmentsId, patchAssessments, postAssessments } from '@/api/assessments/assessments.api';
import { AssessmentData } from '@/api/assessments/assessments.types';
import { useTheme } from '@/app/ThemeContext';


interface FormAssessmentsProps {
  assessmentsId?: string;
};

const FormAssessments = ({ assessmentsId }: FormAssessmentsProps) => {
  const [visible, setVisible] = useState(false);
  const { student } = useStudent();
  const { user } = useUser();
  const { theme } = useTheme();
  const today = new Date();
  const navigation = useNavigation();

  const { data: assessmentsByStudent, refetch } = useQuery({
    queryKey: ['getAssessmentsByStudentIdAndAssessmentsId', assessmentsId, student?.id],
    queryFn: () => getAssessmentsByStudentIdAndAssessmentsId(assessmentsId || '', student?.id || ''),
    enabled: !!assessmentsId
  });


  const [sendEmail, setSendEmail] = useState(false)

  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const handleSendPDFEmail = async () => {
    try {
      setSendEmail(true)
      const pdfBase64 = await GeneratePDFBase64(`
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
        Teste de Equilíbrio: ${assessmentsByStudent?.balanceAndMobility?.balanceTest || ''}
        Teste de Mobilidade: ${assessmentsByStudent?.balanceAndMobility?.mobilityTest || ''}
    
        Postura 
        Avaliação Postural: ${assessmentsByStudent?.posture?.postureAssessment || ''}
    
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
    `, student);

      const emailData: PostEmail = {
        to: ['camilaferna140494@gmail.com'],
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
      const result = await postEmail(emailData);
      console.log(result); // Verifique o resultado no console
    } catch (error) {
      console.error('Erro ao gerar/enviar PDF:', error);
    }
    finally {
      setSendEmail(false)
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
      balanceTest: z.string().optional(),
      mobilityTest: z.string().optional(),
    }),
    posture: z.object({
      postureAssessment: z.string().optional(),
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

  const { control, handleSubmit, watch, setValue } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      studentName: student?.name || '',
      studentId: student?.id || '',
      bodyMeasurements: {
        weight: Number(assessmentsByStudent?.bodyMeasurements?.weight) || 0,
        height: Number(assessmentsByStudent?.bodyMeasurements?.height) || 0,
        bodyFatPercentage: assessmentsByStudent?.bodyMeasurements?.bodyFatPercentage || 0,
        imc: String(assessmentsByStudent?.bodyMeasurements?.imc) || '',
        waistCircumference: Number(assessmentsByStudent?.bodyMeasurements?.waistCircumference) || 0,
        hipCircumference: Number(assessmentsByStudent?.bodyMeasurements?.hipCircumference) || 0,
        chestCircumference: Number(assessmentsByStudent?.bodyMeasurements?.chestCircumference) || 0,
        rightArmCircumference: Number(assessmentsByStudent?.bodyMeasurements?.rightArmCircumference) || 0,
        leftArmCircumference: Number(assessmentsByStudent?.bodyMeasurements?.leftArmCircumference) || 0,
        rightThighCircumference: Number(assessmentsByStudent?.bodyMeasurements?.rightThighCircumference) || 0,
        leftThighCircumference: Number(assessmentsByStudent?.bodyMeasurements?.leftThighCircumference) || 0,
        rightCalfCircumference: Number(assessmentsByStudent?.bodyMeasurements?.rightCalfCircumference) || 0,
        leftCalfCircumference: Number(assessmentsByStudent?.bodyMeasurements?.leftCalfCircumference) || 0,
        neckCircumference: Number(assessmentsByStudent?.bodyMeasurements?.neckCircumference) || 0,
      },
      bodyMass: {
        muscleMass: Number(assessmentsByStudent?.bodyMass.muscleMass) || 0,
        boneMass: Number(assessmentsByStudent?.bodyMass.boneMass) || 0,
      },
      heartRate: {
        restingHeartRate: Number(assessmentsByStudent?.heartRate?.restingHeartRate) || 0,
        maxHeartRate: Number(assessmentsByStudent?.heartRate?.maxHeartRate) || 0,
      },
      balanceAndMobility: {
        balanceTest: String(assessmentsByStudent?.balanceAndMobility?.balanceTest) || '',
        mobilityTest: String(assessmentsByStudent?.balanceAndMobility?.mobilityTest) || '',
      },
      posture: {
        postureAssessment: String(assessmentsByStudent?.posture?.postureAssessment) || '',
      },
      medicalHistory: {
        injuryHistory: assessmentsByStudent?.medicalHistory?.injuryHistory as string || '',
        medicalConditions: assessmentsByStudent?.medicalHistory?.medicalConditions as string || '',
        chronicPain: assessmentsByStudent?.medicalHistory?.chronicPain as string || '',
      },
      fitnessGoals: assessmentsByStudent?.fitnessGoals || '',
      observations: assessmentsByStudent?.observations || '',
      assessmentDate: assessmentsByStudent?.assessmentDate || '',
    },
  });


  const selectedWeight = watch("bodyMeasurements.weight");
  const selectedHeight = watch("bodyMeasurements.height");

  const selectedBalanceTest = watch("balanceAndMobility.balanceTest");
  const selectedMobilityTest = watch("balanceAndMobility.mobilityTest");
  const selectedPostureTest = watch("posture.postureAssessment");

  const imcDescription = useMemo(() => {
    return `${calculateIMC(Number(selectedWeight), String(selectedHeight)?.replace(",", ".") || 0).categoria} - ${calculateIMC(Number(selectedWeight), String(selectedHeight)?.replace(",", ".") || 0).imc}`;
  }, [selectedWeight, selectedHeight]);

  useEffect(() => {
    setValue('bodyMeasurements.imc', imcDescription)
  }, [imcDescription])

  const onSubmit = async (data: AssessmentData) => {
    try {
      if (assessmentsId) {
        await patchAssessments(assessmentsId, user?.id || '', student?.id || '', data);
        refetch();
      } else {
        await postAssessments(user?.id || '', student?.id || '', data);
        navigation.navigate('Assessments' as never);
      }
      handleSendPDFEmail()
    } catch (error) {
      setVisible(true);
    }

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
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      data={[{}]}
      keyExtractor={() => 'FormWorkout'}
      ListHeaderComponent={<View
        style={{ backgroundColor: theme.colors.secondaryContainer, padding: 12, }}>
        <Button disabled={sendEmail} icon="email-fast-outline" mode='contained' onPress={handleSendPDFEmail}
        >Enviar por e-mail</Button>
      </View>}
      renderItem={() => (
        <View style={{ padding: 20, gap: 16 }}>
          <Card>
            <Card.Title title="Medidas Corporais" />
            <Card.Content style={{ gap: 10 }}>
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="scale-balance" />}
                name="bodyMeasurements.weight"
                label="Peso"
                type="text"
                right={<TextInput.Affix text=" kg" />}
              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="human-male-height-variant" />}
                name="bodyMeasurements.height"
                label="Altura"
                type="text"
                right={<TextInput.Affix text=" cm" />}

              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="percent" />}
                name="bodyMeasurements.bodyFatPercentage"
                label="Porcentagem de Gordura Corporal"
                type="text"
                right={<TextInput.Affix text=" %" />}

              />

              <Chip icon="information">
                {calculateIMC(Number(selectedWeight), String(selectedHeight)?.replace(",", ".") || 0
                ).categoria}
              </Chip>
            </Card.Content>
          </Card>

          <Card>
            <Card.Title title="Medidas de Circunferência" />
            <Card.Content style={{ gap: 10 }}>
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="bodyMeasurements.waistCircumference"
                label="Cintura"
                type="text"
                right={<TextInput.Affix text=" cm" />}
              />

              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="bodyMeasurements.hipCircumference"
                label="Quadril"
                type="text"
                right={<TextInput.Affix text=" cm" />}

              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="bodyMeasurements.chestCircumference"
                label="Peito"
                type="text"
                right={<TextInput.Affix text=" cm" />}

              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="bodyMeasurements.neckCircumference"
                label="Pescoço"
                type="text"
                right={<TextInput.Affix text=" cm" />}
              />

            </Card.Content>
          </Card>

          <Card>
            <Card.Title title="Medidas de Braços" />
            <Card.Content style={{ gap: 10 }}>
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="bodyMeasurements.rightArmCircumference" label="Braço Direito"
                type="text"
                right={<TextInput.Affix text=" cm" />}

              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="bodyMeasurements.leftArmCircumference"
                label="Braço Esquerdo"
                type="text"
                right={<TextInput.Affix text=" cm" />}

              />
            </Card.Content>
          </Card>

          <Card>
            <Card.Title title="Medidas das Pernas" />
            <Card.Content style={{ gap: 10 }}>
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="bodyMeasurements.rightThighCircumference"
                label="Coxa Direita"
                type="text"
                right={<TextInput.Affix text=" cm" />}

              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="bodyMeasurements.leftThighCircumference"
                label="Coxa Esquerda"
                type="text"
                right={<TextInput.Affix text=" cm" />}

              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="bodyMeasurements.rightCalfCircumference"
                label="Panturrilha Direita"
                type="text"
                right={<TextInput.Affix text=" cm" />}

              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="bodyMeasurements.leftCalfCircumference"
                label="Panturrilha Esquerda"
                type="text"
                right={<TextInput.Affix text=" cm" />}

              />
            </Card.Content>
          </Card>

          <Card>
            <Card.Title title="Massa Corporal" />
            <Card.Content style={{ gap: 10 }}>
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="scale-balance" />}
                name="bodyMass.muscleMass"
                label="Massa Muscular"
                type="text"
                right={<TextInput.Affix text=" kg" />}

              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="bone" />}
                name="bodyMass.boneMass"
                label="Massa Óssea"
                type="text"
                right={<TextInput.Affix text=" kg" />}

              />
            </Card.Content>
          </Card>

          <Card>
            <Card.Title title="Frequência Cardíaca" />
            <Card.Content style={{ gap: 10 }}>
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="sleep" />}
                name="heartRate.restingHeartRate"
                label="Em repouso"
                type="text"
                right={<TextInput.Affix text=" bpm" />}

              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="heart-pulse" />}
                name="heartRate.maxHeartRate"
                label="Máxima"
                type="text"
                right={<TextInput.Affix text=" bpm" />}

              />
            </Card.Content>
          </Card>


          <Card>
            <Card.Title title="Histórico Médico" />
            <Card.Content style={{ gap: 10 }}>
              <FormField
                control={control}
                mode="flat"
                left={<TextInput.Icon icon="bandage" />}
                name="medicalHistory.injuryHistory"
                label="Lesões Anteriores"
                type="text"
              />
              <FormField
                control={control}
                mode="flat"
                left={<TextInput.Icon icon="stethoscope" />}
                name="medicalHistory.medicalConditions"
                label="Condições Médicas"
                type="text"
              />
              <FormField
                control={control}
                mode="flat"
                left={<TextInput.Icon icon="pill" />}
                name="medicalHistory.chronicPain"
                label="Dores Crônicas"
                type="text"
              />
            </Card.Content>
          </Card>
          <Card>
            <Card.Title title="Equilíbrio, Mobilidade e Postura" />
            <Card.Content style={{ gap: 10 }}>
              {selectedBalanceTest && <Text>Teste de Equilíbrio</Text>}
              <FormField
                control={control}
                name="balanceAndMobility.balanceTest"
                label="Teste de Equilíbrio"
                type="select"
                getLabel={(option) => option.label}
                options={[
                  { label: "Boa", value: "Boa" },
                  { label: "Regular", value: "Regular" },
                  { label: "Ruim", value: "Ruim" },
                ]}
              />
              {selectedMobilityTest && <Text>Teste de Mobilidade</Text>}

              <FormField
                control={control}
                name="balanceAndMobility.mobilityTest"
                label="Teste de Mobilidade"
                type="select"
                getLabel={(option) => option.label}
                options={[
                  { label: "Boa", value: "Boa" },
                  { label: "Regular", value: "Regular" },
                  { label: "Ruim", value: "Ruim" },
                ]}
              />

              {selectedPostureTest && <Text>Teste de Postura</Text>}
              <FormField
                control={control}
                name="posture.postureAssessment"
                label="Teste de Postura"
                type="select"
                getLabel={(option) => option.label}
                options={[
                  { label: "Boa", value: "Boa" },
                  { label: "Regular", value: "Regular" },
                  { label: "Ruim", value: "Ruim" },
                ]}
              />
            </Card.Content>
          </Card>


          <Card>
            <Card.Title title="Objetivo" />
            <Card.Content style={{ gap: 10 }}>
              <FormField
                control={control}
                mode="flat"
                left={<TextInput.Icon icon="bullseye-arrow" />}
                name="fitnessGoals"
                label="Objetivo"
                type="text"

              />
            </Card.Content>
          </Card>

          <Card>
            <Card.Title title="Observação" />
            <Card.Content style={{ gap: 10 }}>
              <FormField
                control={control}
                mode="flat"
                left={<TextInput.Icon icon="comment" />}
                name="observations"
                label="Observação"
                type="text"
              />
            </Card.Content>
          </Card>

          <Snackbar
            visible={visible}
            onDismiss={() => setVisible(false)}
            action={{
              label: 'Close',
              icon: 'close',
              onPress: () => setVisible(false),
            }}
          >
            <Text>Erro ao cadastrar treino</Text>
          </Snackbar>

          <Button mode="contained" onPress={handleSubmit(onSubmit)}>
            Enviar
          </Button>
        </View>
      )}
    />
  );
};

export default FormAssessments;
