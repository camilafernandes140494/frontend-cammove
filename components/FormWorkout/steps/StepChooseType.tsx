/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import { useWorkoutForm } from '@/context/WorkoutFormContext';
import { View } from 'react-native';
import { Card, Icon, SegmentedButtons, Text } from 'react-native-paper';

// interface StepChooseTypeProps {
//   control?: any;
//   selectedType: string;
// }

const StepChooseType = () => {
  const { isGeneratedByIA, setIsGeneratedByIA } = useWorkoutForm();

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Icon size={20} source="sync" />
        <Text variant="titleMedium">Escolha como montar o treino</Text>{' '}
      </View>
      <View style={{ marginVertical: 20 }}>
        <Card mode="outlined">
          <Card.Title title="Como deseja montar o treino?" />
          <Card.Content>
            <SegmentedButtons
              buttons={[
                {
                  value: 'manual',
                  label: 'Cadastro manual',
                  icon: 'lightbulb',
                },
                {
                  value: 'ia',
                  label: 'Sugestão IA',
                  icon: 'creation',
                },
              ]}
              onValueChange={(value) => setIsGeneratedByIA(value === 'ia')}
              value={isGeneratedByIA ? 'ia' : 'manual'}
            />
          </Card.Content>
        </Card>
      </View>
    </>
  );
};
export default StepChooseType;
