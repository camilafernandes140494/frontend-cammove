export type WorkoutSuggestionData = {
  age: string;
  gender: string;
  type: string;
  nameWorkout: string;
  level: string;
  muscleGroup: string[];
  amountExercises: number;
};

export type WorkoutSuggestionResponse = {
  treino: {
    exercises: {
      restTime: string;
      repetitions: string;
      sets: string;
      name: string;
      category: string;
    }[];
  };
};
