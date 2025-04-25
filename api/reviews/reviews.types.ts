export type studentReviewData = {
  studentId: string;
  name: string;
};

export type ReviewData = {
  teacherId: string;
  studentId: string;
  student: studentReviewData;
  workoutId: string;
  review: string;
  reviewNote: number;
  reviewDescription: string;
  reviewFeedback: string;
  createdAt: string;
  updateAt: string;
};
