
import React from 'react';
import { Button, Card, Chip, IconButton, Text } from 'react-native-paper';
import { useTheme } from '@/app/ThemeContext';
import { ReviewData } from '@/api/reviews/reviews.types';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';


interface CardReviewProps {
  reviewData: Partial<ReviewData>,
  navigation: any,
  showButtonWorkout?: boolean
}

const CardReview = ({ reviewData, navigation, showButtonWorkout = true }: CardReviewProps) => {
  const { theme } = useTheme();
  const colorReview = (note: number, theme: any) => {
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
    <Card
      mode='outlined'
      theme={{ colors: { outline: colorReview(reviewData?.reviewNote || 0, theme)?.text } }}
      style={{
        marginHorizontal: 16,
        borderRadius: 12,
        elevation: 2,
        marginBottom: 16,
        backgroundColor: colorReview(reviewData?.reviewNote || 0, theme)?.background,
      }}
    >
      <Card.Content>
        <View style={{ marginBottom: 8 }}>
          <Text variant="titleMedium" style={{ color: colorReview(reviewData?.reviewNote || 0, theme)?.text, fontWeight: 'bold' }}>
            {reviewData.review}
          </Text>
          <Text style={{ fontSize: 12, color: '#6C757D', marginTop: 2 }}>
            {`Criado em: ${format(reviewData?.createdAt || '', "dd/MM/yyyy")}`}
          </Text>
        </View>

        <Text style={{ color: colorReview(reviewData?.reviewNote || 0, theme)?.text, }}>
          {reviewData?.reviewDescription}
        </Text>
        {!!reviewData?.reviewFeedback && <Text style={{ color: colorReview(reviewData?.reviewNote || 0, theme)?.text, }}>
          {reviewData?.reviewFeedback}
        </Text>}

        <View style={{ flexDirection: "row", justifyContent: "center", }}>
          {[1, 2, 3, 4, 5].map((star, index) => (
            <IconButton
              key={star}
              icon={(reviewData?.reviewNote || 0) >= index + 1 ? 'star' : 'star-outline'}
              iconColor={colorReview(reviewData?.reviewNote || 0, theme)?.text}
              size={20}
            />
          ))}
        </View>
        {showButtonWorkout && <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
          <Chip
            style={{
              backgroundColor: colorReview(reviewData?.reviewNote || 0, theme)?.chipBackground, flexWrap: 'wrap',
              flexShrink: 1,
              maxWidth: 220,
            }}
            icon={
              () => <Ionicons
                name="person-circle-outline"
                size={18}
                color={colorReview(reviewData?.reviewNote || 0, theme)?.text}
              />
            }> <Text style={{ color: colorReview(reviewData?.reviewNote || 0, theme)?.text }}>
              {reviewData?.student?.name || ''}
            </Text>
          </Chip>

          <Button
            mode='outlined'
            theme={{ colors: { outline: colorReview(reviewData?.reviewNote || 0, theme)?.text } }}
            compact
            onPress={() => {
              navigation.navigate('WorkoutsScreen', {
                screen: 'CreateWorkout',
                params: { workoutId: reviewData.workoutId, studentId: reviewData?.student?.studentId },
              });
            }}
            textColor={colorReview(reviewData?.reviewNote || 0, theme)?.text}
            style={{
              alignSelf: 'flex-start',
            }}
          >
            Ir para o treino
          </Button>
        </View>}



      </Card.Content>
    </Card>
  );
};

export default CardReview;