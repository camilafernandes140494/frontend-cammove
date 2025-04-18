import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Appbar, Button, Snackbar, Text } from 'react-native-paper';
import { useTheme } from '../ThemeContext';
import SelectableCard from '@/components/SelectableCard';
import { FormField } from '@/components/FormField';
import * as z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getReviewById, postReview } from '@/api/reviews/reviews.api';
import { useUser } from '../UserContext';
import { useMyTeacher } from '../context/MyTeacherContext';
import { ReviewData } from '@/api/reviews/reviews.types';

type ReviewsStudentProps = {
  navigation: any,
  route: {
    params?: {
      workoutId?: string;
    };
  };
};

const ReviewsStudent = ({ route, navigation }: ReviewsStudentProps) => {
  const { theme } = useTheme();
  const { user } = useUser();
  const { teacher } = useMyTeacher()
  const { workoutId, } = route.params || {};

  const [selectedEvaluation, setSelectedEvaluation] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);


  const { data: review } = useQuery({
    queryKey: ['getReviewById', user?.id, teacher?.teacherId, workoutId],
    queryFn: () => getReviewById(teacher?.teacherId || '', workoutId || '', user?.id || ''),
    enabled: !!user?.id,
  });

  const handleEvaluation = (evaluation: string) => {
    setSelectedEvaluation(evaluation);
    setValue('review', evaluation)

  };

  const evaluations = [
    { label: 'Muito bom', icon: 'fire', message: 'Excelente treino! Me senti muito bem durante e depois.' },
    { label: 'Bom', icon: 'thumb-up', message: 'O treino foi bom, mas poderia ter sido mais desafiador.' },
    { label: 'Ruim', icon: 'thumb-down', message: 'Não gostei do treino. Precisa de melhorias.' },
  ];


  const schema = z.object({
    review: z.string(),
    reviewDescription: z.string().optional(),
  });


  const { control, handleSubmit, setValue, reset } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      review: '',
      reviewDescription: ""
    },
  });

  useEffect(() => {
    if (review) {
      reset({
        review: review?.review || '',
        reviewDescription: review?.reviewDescription || '',
      });
      setSelectedEvaluation(review?.review || '')
    }
  }, [review, reset]);

  const mutation = useMutation({
    mutationFn: async (data: Partial<ReviewData>) => {
      const { review, reviewDescription } = data;
      const reviewNote = review === 'Muito bom' ? '3' : review === 'Bom' ? '2' : '1'
      const reviewData = {
        teacherId: teacher?.teacherId || '',
        studentId: user?.id || '',
        workoutId: workoutId,
        review: review,
        reviewNote: reviewNote,
        reviewDescription: reviewDescription,
      }
      await postReview(teacher?.teacherId || '', user?.id || '', reviewData);

    },
    onSuccess: () => {
      navigation.navigate('WorkoutsStudent' as never);
    },
    onError: () => {
      setVisible(true);
    }
  });

  const onSubmit = async (data: Partial<ReviewData>) => {
    mutation.mutate(data);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate('WorkoutsStudent')} />
        <Appbar.Content title="Avaliações" />
      </Appbar.Header>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexDirection: 'column',
          padding: 24,
          gap: 16
        }}
      >
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          action={{
            label: '',
            icon: 'close',
            onPress: () => setVisible(false),
          }}
        >
          <Text>Erro ao avaliar</Text>
        </Snackbar>
        <Text variant="titleLarge">O que você achou desse treino?</Text>
        <View>
          {evaluations.map((evaluation) => (
            <SelectableCard
              key={evaluation.label}
              icon={evaluation.icon}
              message={evaluation.message}
              label={evaluation.label}
              onPress={handleEvaluation}
              selected={selectedEvaluation === evaluation.label}
            />
          ))}
        </View>
        <FormField control={control} name="reviewDescription" label="Quer deixar um feedback?  (opcional)" type="text" multiline
          numberOfLines={5} />
        <Button mode="contained" onPress={handleSubmit(onSubmit)} disabled={mutation.isPending} loading={mutation.isPending}>
          Enviar
        </Button>
      </ScrollView>
    </View>
  );
};

export default ReviewsStudent;

