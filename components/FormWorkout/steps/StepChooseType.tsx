/** biome-ignore-all lint/suspicious/noConsole: <explanation> */

import { useTheme } from '@/context/ThemeContext';
import { useWorkoutForm } from '@/context/WorkoutFormContext';
import { View } from 'react-native';
import { Avatar, Card } from 'react-native-paper';

// interface StepChooseTypeProps {
//   control?: any;
//   selectedType: string;
// }

const StepChooseType = () => {
  const { isGeneratedByIA, setIsGeneratedByIA } = useWorkoutForm();
  const { theme } = useTheme();

  return (
    <View style={{ marginVertical: 20 }}>
      <Card mode="outlined">
        <Card.Title title="Como deseja montar o treino?" />
        <Card.Content style={{ gap: 16 }}>
          <Card
            mode="outlined"
            onPress={() => setIsGeneratedByIA(false)}
            style={{
              backgroundColor: isGeneratedByIA
                ? undefined
                : theme.colors.surfaceVariant,
              borderColor: isGeneratedByIA ? undefined : theme.colors.primary,
            }}
          >
            <Card.Title
              left={(props) => <Avatar.Icon {...props} icon="pencil" />}
              subtitle="Você escolhe cada exercício e monta o treino do zero."
              subtitleNumberOfLines={5}
              subtitleVariant="bodySmall"
              title="Montar treino manualmente"
              titleNumberOfLines={2}
              titleVariant="titleMedium"
            />
          </Card>
          <Card
            mode="outlined"
            onPress={() => setIsGeneratedByIA(true)}
            style={{
              backgroundColor: isGeneratedByIA
                ? theme.colors.surfaceVariant
                : undefined,
              borderColor: isGeneratedByIA ? theme.colors.primary : undefined,
            }}
          >
            <Card.Title
              left={(props) => <Avatar.Icon {...props} icon="creation" />}
              subtitle="A IA gera sugestões, mas você pode modificar os exercícios."
              subtitleNumberOfLines={5}
              subtitleVariant="bodySmall"
              title="Sugestão automática por IA"
              titleNumberOfLines={2}
              titleVariant="titleMedium"
            />
          </Card>
        </Card.Content>
      </Card>
    </View>
  );
};
export default StepChooseType;
