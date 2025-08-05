import type { Exercise } from '@/api/exercise/exercise.types';
import type { ExerciseWorkout } from '@/api/workout/workout.types';
import CustomModal from '@/components/CustomModal';
import ExerciseModal from '@/components/ExerciseModal';
import { useTheme } from '@/context/ThemeContext';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import { View } from 'react-native';
import { Card, Chip, Icon, IconButton, Text } from 'react-native-paper';

interface ExerciseCardProps {
  item: ExerciseWorkout;
  isLinked: boolean;
  searchByName?: (name: string) => Exercise[] | undefined;
  match?: Exercise | null;
  setMatch?: (exercise: Exercise | null) => void;
  removeExercise: (exerciseId: string) => void;
  updateExerciseList: (exercise: ExerciseWorkout) => void;
}

export const ExerciseCard = ({
  item,
  isLinked,
  searchByName,
  match,
  setMatch,
  removeExercise,
  updateExerciseList,
}: ExerciseCardProps) => {
  const { theme } = useTheme();

  return (
    <Card style={{ marginVertical: 10 }}>
      <Card.Content style={{ gap: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{ flexShrink: 1, flexWrap: 'wrap' }}
            variant="titleMedium"
          >
            {item.exerciseId.name}
          </Text>
          {!isLinked && !!searchByName && !!setMatch && (
            <CustomModal
              onOpen={() => {
                const matchName = searchByName(item.exerciseId.name)?.[0];
                setMatch(matchName || null);
              }}
              onPress={() => {
                if (match) {
                  removeExercise(item.exerciseId.name || '');
                  updateExerciseList({
                    ...item,
                    exerciseId: match,
                  });
                }
              }}
              primaryButtonLabel={
                match ? 'Substituir Exercício' : 'Nenhum Exercício Encontrado'
              }
              showPrimaryButton={Boolean(match)}
              title="Alternar Exercício"
              trigger={<IconButton icon="sync" size={20} />}
            >
              <Card mode="outlined">
                <Card.Content
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                    paddingVertical: 20,
                  }}
                >
                  {/* Título Explicativo */}
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    }}
                  >
                    Substituir Exercício Gerado pela IA
                  </Text>

                  {/* Exercício atual */}
                  <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text style={{ fontSize: 14, color: '#666' }}>
                      Exercício Atual:
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: theme.colors.primary,
                      }}
                    >
                      {item.exerciseId.name}
                    </Text>
                  </View>

                  {/* Ícone animado entre eles */}
                  <Icon
                    color={theme.colors.primary}
                    size={48}
                    source={'sync'}
                  />

                  {/* Match encontrado */}
                  {match ? (
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontSize: 14, color: '#666' }}>
                        Será substituído por:
                      </Text>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: theme.colors.primary,
                        }}
                      >
                        {match.name}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      style={{
                        color: '#999',
                        textAlign: 'center',
                        marginTop: 8,
                      }}
                    >
                      Nenhum exercício parecido foi encontrado na base.
                    </Text>
                  )}

                  {/* Dica para o usuário */}
                  <Text
                    style={{
                      fontSize: 12,
                      color: '#777',
                      marginTop: 12,
                      textAlign: 'center',
                    }}
                  >
                    Essa ação irá substituir o exercício gerado automaticamente
                    por um equivalente da base de dados.
                  </Text>
                </Card.Content>
              </Card>
            </CustomModal>
          )}
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons
            color={theme.colors.primary}
            name={'bed-outline'}
            size={18}
            style={{ marginRight: 4 }}
          />
          <Text variant="bodySmall">{`Descanso: ${item.restTime}`}</Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons
            color={theme.colors.primary}
            name={'grid-outline'}
            size={18}
            style={{ marginRight: 4 }}
          />
          <Text variant="bodySmall">{item?.category || ''}</Text>
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
          }}
        >
          {item.sets && (
            <Chip
              disabled
              icon={() => (
                <Ionicons
                  color={theme.colors.primary}
                  name={'repeat'}
                  size={18}
                />
              )}
              style={{
                backgroundColor: theme.colors.primaryContainer,
                alignSelf: 'flex-start',
              }}
              textStyle={{
                color: theme.colors.primary,
              }}
            >
              {item.sets}
            </Chip>
          )}
          {item.repetitions && (
            <Chip
              disabled
              icon={() => (
                <Ionicons
                  color={theme.colors.primary}
                  name={'repeat'}
                  size={18}
                />
              )}
              style={{
                backgroundColor: theme.colors.primaryContainer,
                alignSelf: 'flex-start',
              }}
              textStyle={{
                color: theme.colors.primary,
              }}
            >
              {item.repetitions}
            </Chip>
          )}
        </View>

        <View
          style={{
            display: 'flex',
            justifyContent:
              !!searchByName && !!setMatch ? 'space-between' : 'flex-end',
            alignItems: 'center',
            flexDirection: 'row',
            marginTop: 24,
          }}
        >
          {setMatch && searchByName && (
            <CustomModal
              cancelButtonLabel="Entendi"
              onPress={() => console.log('Vinculado')}
              showPrimaryButton={false}
              title={isLinked ? 'Vinculado' : 'Não vinculado'}
              trigger={
                <Chip
                  icon={() => (
                    <Ionicons
                      color={isLinked ? '#2E7D32' : '#D32F2F'}
                      name={isLinked ? 'checkmark-circle' : 'alert-circle'}
                      size={18}
                    />
                  )}
                  style={{
                    backgroundColor: isLinked ? '#E8F5E9' : '#FFEBEE',
                  }}
                  textStyle={{
                    color: isLinked ? '#2E7D32' : '#D32F2F',
                    fontWeight: '600',
                  }}
                >
                  {isLinked ? 'Vinculado' : 'Não vinculado'}
                </Chip>
              }
            >
              <View
                style={{
                  borderRadius: 50,
                  padding: 12,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon
                  color={
                    isLinked
                      ? '#4CAF50'
                      : theme.colors.card.negativeFeedback.text.primary
                  }
                  size={48}
                  source={isLinked ? 'database-check' : 'database-alert'}
                />
              </View>

              <Text style={{ textAlign: 'center' }} variant="bodySmall">
                {isLinked
                  ? 'Este exercício já está cadastrado na nossa base. O seu aluno poderá visualizar fotos, vídeos e os grupos musculares relacionados para entender melhor a execução.'
                  : 'Este exercício não está cadastrado na nossa base. Ao vinculá-lo, seu aluno poderá visualizar fotos, vídeos e grupos musculares para entender melhor a execução.'}
              </Text>
            </CustomModal>
          )}
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <CustomModal
              onPress={() => removeExercise(item?.exerciseId.name || '')}
              primaryButtonLabel="Deletar"
              title="Tem certeza que deseja deletar o exercício?"
            />
            <ExerciseModal
              exercise={item}
              onSave={(exerciseData) => {
                removeExercise(item.exerciseId.name || '');
                updateExerciseList(exerciseData);
              }}
              triggerWithIcon={true}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};
