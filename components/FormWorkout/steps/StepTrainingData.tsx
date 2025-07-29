import { FormField } from '@/components/FormField';
import { View } from 'react-native';
import { Card, Text } from 'react-native-paper';

interface StepTrainingDataProps {
  control?: any;
  selectedType: string;
}
const StepTrainingData = ({ control, selectedType }: StepTrainingDataProps) => {
  //   const { step, nextStep, prevStep, isGeneratedByIA, setIsGeneratedByIA } =
  //     useWorkoutForm();

  const muscleGroup = [
    'Peito',
    'Costas',
    'Ombros',
    'Bíceps',
    'Tríceps',
    'Antebraços',
    'Abdômen',
    'Glúteos',
    'Quadríceps',
    'Isquiotibiais',
    'Panturrilhas',
    'Adutores',
    'Flexores de quadril',
    'Trapézio',
    'Lombares',
    'Serrátil anterior',
    'Reto abdominal',
    'Oblíquos',
    'Erectores da espinha',
    'Flexores de tornozelo',
  ];

  const muscleGroupChip = muscleGroup?.map((item) => ({
    label: item,
    value: item,
  }));

  return (
    <View style={{ marginVertical: 20 }}>
      <Card mode="outlined">
        <Card.Title title="Informações" />
        <Card.Content>
          <FormField
            control={control}
            label="Nome do treino"
            name="nameWorkout"
            type="text"
          />
          <Text>{'Intensidade do treino'}</Text>
          <FormField
            control={control}
            getLabel={(option) => option.label}
            label="Intensidade do treino"
            name="level"
            options={[
              { label: 'Iniciante', value: 'iniciante' },
              { label: 'Médio', value: 'medio' },
              { label: 'Avançado', value: 'avançado' },
            ]}
            type="chip"
          />

          {selectedType !== '' && selectedType !== 'Personalizado' && (
            <Text style={{ marginBottom: 16 }}>Objetivo de treino</Text>
          )}

          <FormField
            control={control}
            getLabel={(option) => option.label}
            label="Escolha seu objetivo de treino"
            name="type"
            options={[
              { label: 'Personalizado', value: 'Personalizado' },
              { label: 'Hipertrofia', value: 'Hipertrofia' },
              { label: 'Emagrecimento', value: 'Emagrecimento' },
              { label: 'Resistência', value: 'Resistência' },
              { label: 'Definição', value: 'Definição' },
              { label: 'Força', value: 'Força' },
              { label: 'Flexibilidade', value: 'Flexibilidade' },
              { label: 'Equilíbrio', value: 'Equilíbrio' },
              { label: 'Saúde geral', value: 'Saúde geral' },
              { label: 'Velocidade', value: 'Velocidade' },
              {
                label: 'Desempenho atlético',
                value: 'Desempenho atlético',
              },
              { label: 'Pré-natal', value: 'Pré-natal' },
              { label: 'Reabilitação', value: 'Reabilitação' },
              { label: 'Mobilidade', value: 'Mobilidade' },
              { label: 'Potência', value: 'Potência' },
            ]}
            type="select"
          />
          {selectedType === 'Personalizado' && (
            <FormField
              control={control}
              label="Objetivo do Treino"
              name="customType"
              type="text"
            />
          )}

          <Text>{'Grupo muscular'}</Text>
          <FormField
            control={control}
            name="muscleGroup"
            options={muscleGroupChip}
            type="chip-multi"
          />
        </Card.Content>
      </Card>
    </View>
  );
};
export default StepTrainingData;
