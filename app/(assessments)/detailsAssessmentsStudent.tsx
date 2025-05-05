import React from 'react';
import { Appbar, Card, Chip, Divider, Text } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { getAssessmentsByStudentIdAndAssessmentsId } from '@/api/assessments/assessments.api';
import { RefreshControl, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import InfoField from '@/components/InfoField';
import StudentCard from '@/components/StudentCard';

export type RootStackParamList = {
  AssessmentsStudent: undefined;
  CreateAssessments: { assessmentsId?: string };
};

const DetailsAssessmentsStudent = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const route = useRoute();

  const { assessmentsId } = route.params as { assessmentsId: string | undefined };

  const { user } = useUser();

  const { data: assessmentsByStudent, refetch, isLoading, isFetching } = useQuery({
    queryKey: ['getAssessmentsByStudentIdAndAssessmentsId', assessmentsId, user?.id],
    queryFn: () =>
      getAssessmentsByStudentIdAndAssessmentsId(assessmentsId || '', user?.id || ''),
    enabled: Boolean(assessmentsId && user?.id), // ✅ só ativa quando os dois existem
  });


  return (<>
    <Appbar.Header>
      <Appbar.BackAction onPress={() => navigation.navigate('AssessmentsStudent')} />
      <Appbar.Content title="Avaliação" />

    </Appbar.Header>
    <StudentCard>
      {assessmentsId && <Text variant="bodySmall" style={{ marginLeft: 16, color: theme.colors.outline }}>ID: {assessmentsId}</Text>}
      <View style={{ display: 'flex', flexDirection: 'row', gap: 12, alignItems: 'center', marginLeft: 16, marginTop: 16 }}>
        <Ionicons
          name={'calendar'}
          size={18}
          color={theme.colors.primary}
        />
        {assessmentsByStudent?.createdAt ? (
          <Text>
            {format(new Date(assessmentsByStudent.createdAt), "dd 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </Text>
        ) : null}
      </View>
    </StudentCard>
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}
      refreshControl={
        <RefreshControl
          refreshing={isLoading || isFetching}
          onRefresh={refetch}
        />
      }>
      <View style={{ display: 'flex', gap: 16 }}>
        <Card>
          <Card.Title title="Medidas Corporais" />
          <Card.Content style={{ gap: 10 }}>
            <InfoField title='Peso' description={`${String(assessmentsByStudent?.bodyMeasurements?.weight)} kg` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Altura' description={`${String(assessmentsByStudent?.bodyMeasurements?.height)} cm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='% Gordura Corporal' description={`${String(assessmentsByStudent?.bodyMeasurements?.bodyFatPercentage)} %` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />

            <Chip icon="information">
              {`${assessmentsByStudent?.bodyMeasurements?.imc} (IMC)`}
            </Chip>
          </Card.Content>
        </Card>

        <Card>
          <Card.Title title="Medidas de Circunferência" />
          <Card.Content style={{ gap: 10 }}>
            <InfoField title='Cintura' description={`${String(assessmentsByStudent?.bodyMeasurements?.waistCircumference)} cm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Quadril' description={`${String(assessmentsByStudent?.bodyMeasurements?.hipCircumference)} cm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Peito' description={`${String(assessmentsByStudent?.bodyMeasurements?.chestCircumference)} cm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Pescoço' description={`${String(assessmentsByStudent?.bodyMeasurements?.neckCircumference)} cm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
          </Card.Content>
        </Card>

        <Card>
          <Card.Title title="Medidas de Braços" />
          <Card.Content style={{ gap: 10 }}>
            <InfoField title='Braço Direito' description={`${String(assessmentsByStudent?.bodyMeasurements?.rightArmCircumference)} cm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Braço Esquerdo' description={`${String(assessmentsByStudent?.bodyMeasurements?.leftArmCircumference)} cm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
          </Card.Content>
        </Card>

        <Card>
          <Card.Title title="Medidas das Pernas" />
          <Card.Content style={{ gap: 10 }}>
            <InfoField title='Coxa Direita' description={`${String(assessmentsByStudent?.bodyMeasurements?.rightThighCircumference)} cm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Coxa Esquerda' description={`${String(assessmentsByStudent?.bodyMeasurements?.leftThighCircumference)} cm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Panturrilha Direita' description={`${String(assessmentsByStudent?.bodyMeasurements?.rightCalfCircumference)} cm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Panturrilha Esquerda' description={`${String(assessmentsByStudent?.bodyMeasurements?.leftCalfCircumference)} cm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
          </Card.Content>
        </Card>

        <Card>
          <Card.Title title="Massa Corporal" />
          <Card.Content style={{ gap: 10 }}>
            <InfoField title='Massa Muscular' description={`${String(assessmentsByStudent?.bodyMass?.muscleMass)} kg` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Massa Óssea' description={`${String(assessmentsByStudent?.bodyMass?.boneMass)} kg` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
          </Card.Content>
        </Card>

        <Card>
          <Card.Title title="Frequência Cardíaca" />
          <Card.Content style={{ gap: 10 }}>
            <InfoField title='Em repouso' description={`${String(assessmentsByStudent?.heartRate?.restingHeartRate)} bpm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Máxima' description={`${String(assessmentsByStudent?.heartRate?.maxHeartRate)} bpm` || ''} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
          </Card.Content>
        </Card>


        <Card>
          <Card.Title title="Histórico Médico" />
          <Card.Content style={{ gap: 10 }}>
            <InfoField title='Lesões Anteriores' description={String(assessmentsByStudent?.medicalHistory?.injuryHistory) || 'Não informado.'} />
            <Divider />
            <InfoField title='Condições Médicas' description={String(assessmentsByStudent?.medicalHistory?.medicalConditions) || 'Não informado.'} />
            <Divider />
            <InfoField title='Dores Crônicas' description={String(assessmentsByStudent?.medicalHistory?.chronicPain) || 'Não informado.'} />
          </Card.Content>
        </Card>
        <Card>
          <Card.Title title="Equilíbrio, Mobilidade e Postura" />
          <Card.Content style={{ gap: 10 }}>
            <InfoField title='Teste de Equilíbrio' description={String(assessmentsByStudent?.balanceAndMobility?.balanceTest) || 'Não informado.'} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Teste de Mobilidade' description={String(assessmentsByStudent?.balanceAndMobility?.mobilityTest) || 'Não informado.'} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
            <Divider />
            <InfoField title='Teste de Postura' description={String(assessmentsByStudent?.posture?.postureAssessment) || 'Não informado.'} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} />
          </Card.Content>
        </Card>


        <Card>
          <Card.Title title="Objetivo" />
          <Card.Content style={{ gap: 10 }}>
            <Text>{assessmentsByStudent?.fitnessGoals ? assessmentsByStudent?.fitnessGoals : 'Nenhuma objetivo registrado.'}</Text>

          </Card.Content>
        </Card>

        <Card>
          <Card.Title title="Observação" />
          <Card.Content style={{ gap: 10 }}>
            <Text>{assessmentsByStudent?.observations ? assessmentsByStudent?.observations : 'Nenhuma observação registrada'}</Text>
          </Card.Content>
        </Card>

      </View>

    </ScrollView></>


  );
};

export default DetailsAssessmentsStudent;
