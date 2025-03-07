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

  console.log(assessmentsByStudent)

  const schema = z.object({
    weight: z.number().optional(),
    height: z.string().optional(),
    waist: z.number().optional(),
    hip: z.number().optional(),
    chest: z.number().optional(),
    armRight: z.number().optional(),
    armLeft: z.number().optional(),
    thighRight: z.number().optional(),
    thighLeft: z.number().optional(),
    calfRight: z.number().optional(),
    calfLeft: z.number().optional(),
    muscleMass: z.number().optional(),
    boneMass: z.number().optional(),
    balanceTest: z.string().optional(),
    mobilityTest: z.string().optional(),
    postureTest: z.string().optional(),
    observation: z.string().optional(),
  });

  const { control, handleSubmit, watch } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      weight: 0,
      height: '0',
      waist: 0,
      hip: 0,
      chest: 0,
      armRight: 0,
      armLeft: 0,
      thighRight: 0,
      thighLeft: 0,
      calfRight: 0,
      calfLeft: 0,
      muscleMass: 0,
      boneMass: 0,
      balanceTest: '',
      mobilityTest: '',
      postureTest: '',
      observation: '',
    },
  });

  const selectedWeight = watch("weight");
  const selectedHeight = watch("height");

  const selectedBalanceTest = watch("balanceTest");
  const selectedMobilityTest = watch("mobilityTest");
  const selectedPostureTest = watch("postureTest");

  const [assessmentsList, setAssessmentsList] = useState<AssessmentData[]>([]);

  const onSubmit = async (data: any) => {
    const typeData = data.type ? data.type.label : data.customType
    const assessmentsData = {
      studentId: student?.id || '',
      studentName: student?.name || '',
      bodyMeasurements: 'BodyMeasurements',
      bodyMass: 'BodyMass',
      physicalTests: 'PhysicalTests',
      heartRate: 'HeartRate',
      balanceAndMobility: 'BalanceAndMobility',
      posture: 'Posture',
      medicalHistory: 'MedicalHistory',
      fitnessGoals: 'string',
      observations: 'string',
      assessmentDate: 'string'
    }
    try {
      if (assessmentsId) {
        await patchAssessments(assessmentsId, user?.id || '', student?.id || '', assessmentsData);
        refetch()
      } else {
        await postAssessments(user?.id || '', student?.id || '', assessmentsData);
        navigation.navigate('Assessments' as never);
      }

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
        <Text>Erro ao cadastrar treino</Text>
      </Snackbar>
    }
  }

  const removeAssessments = (exerciseId: string) => {
    setAssessmentsList((prevList) =>
      prevList.filter((exercise) => exercise.exerciseId.id !== exerciseId)
    );
  };

  const updateAssessmentsList = (exercise: ExerciseWorkout) => {
    setAssessmentsList((prevList) => {
      const index = prevList.findIndex((ex) => ex.exerciseId.id === exercise.exerciseId.id);
      if (index !== -1) {
        const updatedList = [...prevList];
        updatedList[index] = exercise;
        return updatedList;
      }
      return [...prevList, exercise];
    });
  };


  const handleSendPDFEmail = async () => {
    try {
      const pdfBase64 = await GeneratePDFBase64();

      const emailData: PostEmail = {
        to: ['camilaferna140494@gmail.com'], // Destinatários
        subject: 'Avaliação física - ', // Assunto
        body: 'Segue o PDF em anexo.', // Corpo do e-mail
        attachments: [
          {
            filename: 'meuArquivo.pdf', // Nome do arquivo
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
                name="weight"
                label="Peso"
                type="text"
              />
              <FormField
                control={control}
                mode="flat"
                keyboardType="numeric"
                left={<TextInput.Icon icon="human-male-height-variant" />}
                name="height"
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

          <Button mode="contained" onPress={handleSubmit(onSubmit)}>
            Enviar
          </Button>
        </View>
      )}
    />
  );
};

export default FormAssessments;
