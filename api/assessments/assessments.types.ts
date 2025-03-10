// Definindo o tipo para a avaliação física
type BodyMeasurements = {
  weight: number | string;
  height: number | string;
  bodyFatPercentage: number | string;
  imc: number | string;
  waistCircumference: number | string;
  hipCircumference: number | string;
  chestCircumference: number | string;
  rightArmCircumference: number | string;
  leftArmCircumference: number | string;
  rightThighCircumference: number | string;
  leftThighCircumference: number | string;
  rightCalfCircumference: number | string;
  leftCalfCircumference: number | string;
  neckCircumference: number | string;
};

type BodyMass = {
  muscleMass: number | string;
  boneMass: number | string;
};

type PhysicalTests = {
  pushUpTest: number | string;
  squatTest: number | string;
  flexibilityTest: number | string;
  cooperTestDistance: number | string;
};

type HeartRate = {
  restingHeartRate: number | string;
  maxHeartRate: number | string;
};

type BalanceAndMobility = {
  balanceTest: string;
  mobilityTest: string;
};

type Posture = {
  postureAssessment: string;
};

type MedicalHistory = {
  injuryHistory: string;
  medicalConditions: string;
  chronicPain: string;
};

export type AssessmentData = {
  // Medições Corporais
  studentName: string;
  studentId: string;

  bodyMeasurements: BodyMeasurements;

  // Massa Corporal
  bodyMass: BodyMass;

  // Testes Físicos
  physicalTests: PhysicalTests;

  // Frequência Cardíaca
  heartRate: HeartRate;

  // Avaliações de Equilíbrio e Mobilidade
  balanceAndMobility: BalanceAndMobility;

  // Postura
  posture: Posture;

  // Histórico de Lesões e Condições Médicas
  medicalHistory: MedicalHistory;

  // Objetivos de Fitness
  fitnessGoals: string;

  observations: string;
  // Data da avaliação
  assessmentDate: string;
};
