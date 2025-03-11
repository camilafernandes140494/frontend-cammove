import React, { useState } from 'react';
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


interface FormAssessmentsProps {
  assessmentsId?: string;
};

const FormAssessments = ({ assessmentsId }: FormAssessmentsProps) => {
  const [visible, setVisible] = useState(false);
  const { student } = useStudent();
  const { user } = useUser();
  const navigation = useNavigation();

  const { data: assessmentsByStudent, refetch } = useQuery({
    queryKey: ['getAssessmentsByStudentIdAndAssessmentsId', assessmentsId, student?.id],
    queryFn: () => getAssessmentsByStudentIdAndAssessmentsId(assessmentsId || '', student?.id || ''),
    enabled: !!assessmentsId
  });


  const schema = z.object({
    studentName: z.string().optional(),
    studentId: z.string().optional(),
    bodyMeasurements: z.object({
      weight: z.string().optional(),
      height: z.string().optional(),
      bodyFatPercentage: z.number().optional(),
      imc: z.number().optional(),
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
    physicalTests: z.object({
      pushUpTest: z.string().optional(),
      squatTest: z.string().optional(),
      flexibilityTest: z.string().optional(),
      cooperTestDistance: z.string().optional(),
    }),
    heartRate: z.object({
      restingHeartRate: z.string().optional(),
      maxHeartRate: z.string().optional(),
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

  const { control, handleSubmit, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      studentName: student?.name || '',
      studentId: student?.id || '',
      bodyMeasurements: {
        weight: String(assessmentsByStudent?.bodyMeasurements?.weight) || '0',
        height: String(assessmentsByStudent?.bodyMeasurements?.height) || '0',
        bodyFatPercentage: Number(assessmentsByStudent?.bodyMeasurements?.bodyFatPercentage) || 0,
        imc: Number(assessmentsByStudent?.bodyMeasurements?.imc) || 0,
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
      physicalTests: {
        pushUpTest: String(assessmentsByStudent?.physicalTests?.pushUpTest) || '',
        squatTest: String(assessmentsByStudent?.physicalTests?.squatTest) || '',
        flexibilityTest: String(assessmentsByStudent?.physicalTests?.flexibilityTest) || '',
        cooperTestDistance: String(assessmentsByStudent?.physicalTests?.cooperTestDistance) || '',
      },
      heartRate: {
        restingHeartRate: String(assessmentsByStudent?.heartRate?.restingHeartRate) || '',
        maxHeartRate: String(assessmentsByStudent?.heartRate?.maxHeartRate) || '',
      },
      balanceAndMobility: {
        balanceTest: String(assessmentsByStudent?.balanceAndMobility?.balanceTest) || '',
        mobilityTest: String(assessmentsByStudent?.balanceAndMobility?.mobilityTest) || '',
      },
      posture: {
        postureAssessment: String(assessmentsByStudent?.posture?.postureAssessment) || '',
      },
      medicalHistory: {
        injuryHistory: String(assessmentsByStudent?.medicalHistory?.injuryHistory) || '',
        medicalConditions: String(assessmentsByStudent?.medicalHistory?.medicalConditions) || '',
        chronicPain: String(assessmentsByStudent?.medicalHistory?.chronicPain) || '',
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

  const onSubmit = async (data: AssessmentData) => {
    try {
      if (assessmentsId) {
        await patchAssessments(assessmentsId, user?.id || '', student?.id || '', data);
        refetch();
      } else {
        await postAssessments(user?.id || '', student?.id || '', data);
        navigation.navigate('Assessments' as never);
      }
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

  const handleSendPDFEmail = async () => {
    try {
      const pdfBase64 = await GeneratePDFBase64(`
        📊 Medições Corporais
    
        Peso: ${assessmentsByStudent?.bodyMeasurements?.weight || ''} kg
        Altura: ${assessmentsByStudent?.bodyMeasurements?.height || ''} cm
        % Gordura Corporal: ${assessmentsByStudent?.bodyMeasurements?.bodyFatPercentage || ''}%
        IMC: ${assessmentsByStudent?.bodyMeasurements?.imc || ''}
    
        Circunferências 
        Cintura: ${assessmentsByStudent?.bodyMeasurements?.waistCircumference || ''} cm
        Quadril: ${assessmentsByStudent?.bodyMeasurements?.hipCircumference || ''} cm
        Peito: ${assessmentsByStudent?.bodyMeasurements?.chestCircumference || ''} cm
        Braço D: ${assessmentsByStudent?.bodyMeasurements?.rightArmCircumference || ''} cm | Braço E: ${assessmentsByStudent?.bodyMeasurements?.leftArmCircumference || ''} cm
        Coxa D: ${assessmentsByStudent?.bodyMeasurements?.rightThighCircumference || ''} cm | Coxa E: ${assessmentsByStudent?.bodyMeasurements?.leftThighCircumference || ''} cm
        Panturrilha D: ${assessmentsByStudent?.bodyMeasurements?.rightCalfCircumference || ''} cm | Panturrilha E: ${assessmentsByStudent?.bodyMeasurements?.leftCalfCircumference || ''} cm
        Pescoço: ${assessmentsByStudent?.bodyMeasurements?.neckCircumference || ''} cm
    
        💪 Composição Corporal
        Massa Muscular: ${assessmentsByStudent?.bodyMass.muscleMass || ''} kg
        Massa Óssea: ${assessmentsByStudent?.bodyMass.boneMass || ''} kg
    
        🏋️ Testes Físicos 
        Flexões de braço: ${assessmentsByStudent?.physicalTests?.pushUpTest || ''} repetições
        Agachamentos: ${assessmentsByStudent?.physicalTests?.squatTest || ''} repetições
        Flexibilidade: ${assessmentsByStudent?.physicalTests?.flexibilityTest || ''} cm
        Teste de Cooper (Distância corrida): ${assessmentsByStudent?.physicalTests?.cooperTestDistance || ''} metros
    
        ❤️ Frequência Cardíaca
        Em repouso: ${assessmentsByStudent?.heartRate?.restingHeartRate || ''} bpm
        Máxima: ${assessmentsByStudent?.heartRate?.maxHeartRate || ''} bpm
    
        ⚖️ Equilíbrio e Mobilidade 
        Teste de Equilíbrio: ${assessmentsByStudent?.balanceAndMobility?.balanceTest || ''}
        Teste de Mobilidade: ${assessmentsByStudent?.balanceAndMobility?.mobilityTest || ''}
    
        🏃‍♂️ Postura 
        Avaliação Postural: ${assessmentsByStudent?.posture?.postureAssessment || ''}
    
        🏥 Histórico Médico 
        Lesões Anteriores: ${assessmentsByStudent?.medicalHistory?.injuryHistory || ''}
        Condições Médicas: ${assessmentsByStudent?.medicalHistory?.medicalConditions || ''}
        Dores Crônicas: ${assessmentsByStudent?.medicalHistory?.chronicPain || ''}
    
        🎯 Objetivos 
        ${assessmentsByStudent?.fitnessGoals || ''}
    
        📝 Observações
        ${assessmentsByStudent?.observations || ''}
    
        Caso tenha dúvidas ou precise de ajustes no seu plano de treino, me avise! Vamos juntos alcançar seus objetivos. 💪🔥
    
        Atenciosamente,
        ${user?.name}
        Equipe CamMove 🚀
    `, student);

      const emailData: PostEmail = {
        to: ['camilaferna140494@gmail.com'],
        subject: ' Sua Avaliação Física – Resultados e Análise',
        body: `Olá ${student?.name} 

        Tudo bem? Segue em anexo sua avaliação física com todos os detalhes sobre seu progresso e pontos de melhoria. 

        Com base nesses resultados, podemos ajustar seu treino e estabelecer novas metas para que você continue evoluindo.
        
        Se tiver dúvidas ou quiser marcar uma conversa para discutirmos os próximos passos, me avise! Estou à disposição.

        Vamos juntos alcançar seus objetivos! 💪

        Atenciosamente,
        ${user?.name}
        Equipe CamMove 🚀 `,
        attachments: [
          {
            filename: `avaliacao.pdf`, // Nome do arquivo
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
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      data={[{}]}
      keyExtractor={() => 'FormWorkout'}
      renderItem={() => (
        <View style={{ padding: 20, gap: 16 }}>
          <Card>
            <Button onPress={handleSendPDFEmail} >"Gerar e Enviar PDF"</Button>
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
              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="human-male-height-variant" />}
                name="bodyMeasurements.height"
                label="Altura"
                type="text"
              />
              <Chip icon="information">
                {calculateIMC(Number(selectedWeight), selectedHeight?.replace(",", ".") || 0
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
                name="waist"
                label="Cintura"
                type="text"
              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="hip"
                label="Quadril"
                type="text"
              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="chest"
                label="Peito"
                type="text"
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
                name="armRight"
                label="Braço Direito"
                type="text"
              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="armLeft"
                label="Braço Esquerdo"
                type="text"
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
                name="thighRight"
                label="Coxa Direita"
                type="text"
              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="thighLeft"
                label="Coxa Esquerda"
                type="text"
              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="calfRight"
                label="Panturrilha Direita"
                type="text"
              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="ruler" />}
                name="calfLeft"
                label="Panturrilha Esquerda"
                type="text"
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
                name="muscleMass"
                label="Massa Muscular"
                type="text"
              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="bone" />}
                name="boneMass"
                label="Massa Óssea"
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
                name="balanceTest"
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
                name="mobilityTest"
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
                name="postureTest"
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
            <Card.Title title="Observação" />
            <Card.Content style={{ gap: 10 }}>
              <FormField
                control={control}
                mode="flat"
                left={<TextInput.Icon icon="comment" />}
                name="observation"
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
