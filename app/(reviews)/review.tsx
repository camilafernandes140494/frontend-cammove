import React from 'react';
import { FlatList, View } from 'react-native';
import { Appbar, Button, Card, Chip, IconButton, Text } from 'react-native-paper';
import { useTheme } from '../ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { getReviewsByTeacher } from '@/api/reviews/reviews.api';
import { useUser } from '../UserContext';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

type ReviewsStudentProps = {
  navigation: any,
};

const Reviews = ({ navigation }: ReviewsStudentProps) => {
  const { theme } = useTheme();
  const { user } = useUser();


  const { data: review } = useQuery({
    queryKey: ['getReviewsByTeacher', user?.id,],
    queryFn: () => getReviewsByTeacher(user?.id || ''),
    enabled: !!user?.id,
  });

  const colorReview = (note: number) => {
    if (note <= 2) {
      return {
        background: theme.colors.card.negativeFeedback.background,
        text: theme.colors.card.negativeFeedback.text.primary,
        chipBackground: theme.colors.card.negativeFeedback.chipBackground,
      };
    } else if (note === 3) {
      return {
        background: theme.colors.card.neutralFeedback.background,
        text: theme.colors.card.neutralFeedback.text.primary,
        chipBackground: theme.colors.card.neutralFeedback.chipBackground,
      };
    } else {
      return {
        background: theme.colors.card.feedback.background,
        text: theme.colors.card.feedback.text.primary,
        chipBackground: theme.colors.card.feedback.chipBackground,
      };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('Home')} />
        <Appbar.Content title="Avaliações" />
      </Appbar.Header>
      <FlatList
        style={{ flex: 1, backgroundColor: theme.colors.background }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20, marginTop: 16 }}
        data={review}
        renderItem={({ item }) => <>
          {
            <Card
              mode='outlined'
              theme={{ colors: { outline: colorReview(item?.reviewNote || 0)?.text } }}
              style={{
                marginHorizontal: 16,
                borderRadius: 12,
                elevation: 2,
                marginBottom: 16,
                backgroundColor: colorReview(item?.reviewNote || 0)?.background,
              }}
            >
              <Card.Content>
                <View style={{ marginBottom: 8 }}>
                  <Text variant="titleMedium" style={{ color: colorReview(item?.reviewNote || 0)?.text, fontWeight: 'bold' }}>
                    {item.review}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#6C757D', marginTop: 2 }}>
                    {`Criado em: ${format(item?.createdAt || '', "dd/MM/yyyy")}`}
                  </Text>
                </View>

                <Text style={{ color: colorReview(item?.reviewNote || 0)?.text, }}>
                  {item?.reviewDescription}
                </Text>
                {!!item?.reviewFeedback && <Text style={{ color: colorReview(item?.reviewNote || 0)?.text, }}>
                  {item?.reviewFeedback}
                </Text>}

                <View style={{ flexDirection: "row", justifyContent: "center", }}>
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <IconButton
                      key={star}
                      icon={(item?.reviewNote || 0) >= index + 1 ? 'star' : 'star-outline'}
                      iconColor={colorReview(item?.reviewNote || 0)?.text}
                      size={20}
                    />
                  ))}
                </View>

                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <Chip
                    style={{
                      backgroundColor: colorReview(item?.reviewNote || 0)?.chipBackground, flexWrap: 'wrap',
                      flexShrink: 1,
                      maxWidth: 220,
                    }}
                    icon={
                      () => <Ionicons
                        name="person-circle-outline"
                        size={18}
                        color={colorReview(item?.reviewNote || 0)?.text}
                      />
                    }> <Text style={{ color: colorReview(item?.reviewNote || 0)?.text }}>
                      {item?.student?.name || ''}
                    </Text>
                  </Chip>

                  <Button
                    mode='outlined'
                    theme={{ colors: { outline: colorReview(item?.reviewNote || 0)?.text } }}
                    compact
                    onPress={() => {
                      navigation.navigate('WorkoutsScreen', {
                        screen: 'CreateWorkout',
                        params: { workoutId: item.workoutId, studentId: item?.student?.studentId },
                      });
                    }}
                    textColor={colorReview(item?.reviewNote || 0)?.text}
                    style={{
                      alignSelf: 'flex-start',
                    }}
                  >
                    Ir para o treino
                  </Button>
                </View>


              </Card.Content>
            </Card>

          }
        </>
        }
      />
    </View>
  );
};

export default Reviews;

