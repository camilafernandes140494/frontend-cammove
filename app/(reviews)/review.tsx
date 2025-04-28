import React from 'react';
import { FlatList, View } from 'react-native';
import { Appbar } from 'react-native-paper';
import { useTheme } from '../ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { getReviewsByTeacher } from '@/api/reviews/reviews.api';
import { useUser } from '../UserContext';
import CardReview from '@/components/CardReview';

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
        renderItem={({ item }) => <CardReview reviewData={item} navigation={navigation} />
        }
      />
    </View>
  );
};

export default Reviews;

