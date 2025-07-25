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
        </Card.Content>
      </Card>
    </View>
  );
};
export default StepTrainingData;
