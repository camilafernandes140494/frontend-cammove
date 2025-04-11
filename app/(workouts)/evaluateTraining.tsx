import React from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Card, Text } from 'react-native-paper';
import { useTheme } from '../ThemeContext';

const EvaluateTraining = ({ navigation }: any) => {
  const { theme } = useTheme();


  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('WorkoutsStudent')} />
        <Appbar.Content title="Avaliações" />
      </Appbar.Header>
      <ScrollView
        style={{ flex: 1, }}
        contentContainerStyle={{
          display: 'flex',
          flexDirection: 'column',
          padding: 24,
          gap: 12
        }}
      >
        <Text variant='titleLarge'>O que você achou desse treino?</Text>
        
        <Card style={{ marginVertical: 16, padding: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text variant="titleMedium" style={{ marginBottom: 4 }}>
                Você treinou  na última semana
              </Text>
              <Text variant="bodyMedium">{'message'}</Text>
            </View>
          </View>
        </Card>


      </ScrollView>

    </View>
  );
};

export default EvaluateTraining;
