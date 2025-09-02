import type { Exercise } from "../exercise/exercise.types";

export type getWorkoutsSummaryResponse = {
	id: string;
	workoutId: string;
	createdAt: string;
	expireAt: string;
	workoutType: string;
	nameWorkout: string;
	studentName: string;
	studentId: string;
};

export type ExerciseWorkout = {
	exerciseId: Exercise;
	repetitions: string;
	sets: string;
	restTime: string;
	observations: string;
	category?: string;
};
export type WorkoutData = {
	createdAt?: string;
	updatedAt?: string;
	deletedAt?: string;
	exercises: ExerciseWorkout[];
	type: string;
	studentName: string;
	studentId: string;
	nameWorkout: string;
	level?: string;
	muscleGroup?: string[];
};

export type WorkoutDataByIdStudent = {
	id: string;
	createdAt: string;
	type?: string;
	nameWorkout: string;
};
